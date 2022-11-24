import Strapify from "./Strapify.js";
import StrapifyTemplate from "./StrapifyTemplate"
import strapiRequest from "./util/strapiRequest";

class StrapifyCollection {
	#collectionElement;
	#collectionData;
	#overrideCollectionData;
	#strapifyTemplates = [];

	#insertionElm;
	#insertBeforeElm;
	#templateElm;

	#mutationObserver;
	#minHeightCache;

	#attributes = {
		"strapi-collection": undefined,
		"strapi-relation": undefined,
		"strapi-collection-filter": undefined,
		"strapi-collection-sort": undefined,
		"strapi-collection-page": undefined,
		"strapi-collection-page-size": undefined,
	}

	constructor(collectionElement, overrideCollectionData) {
		//set the collection element and update the attributes
		this.#collectionElement = collectionElement;
		this.#overrideCollectionData = overrideCollectionData;
		this.#updateAttributes();

		//create mutation observer to watch for attribute changes
		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.#updateAttributes();
					this.process();
				}
			});
		});

		//observe the collection element for attribute changes
		this.#mutationObserver.observe(this.#collectionElement, {
			attributes: true,
			attributeFilter: Strapify.validStrapifyCollectionAttributes
		});

		//use the first strapi-template element as the template and remove all others
		const templateElms = this.#findTemplateElms();
		this.#insertionElm = templateElms[0].parentElement;
		this.#insertBeforeElm = this.#findInsertBeforeElm(templateElms[0]);
		this.#templateElm = templateElms[0].cloneNode(true);
		templateElms.forEach(templateElm => templateElm.remove());

		//get page control elements and add event listeners to page control elements
		const pageControlElms = this.#collectionElement.querySelectorAll("[strapi-page-control]");
		for (let pageControlElm of pageControlElms) {
			pageControlElm.addEventListener("click", this.#onPageControlClick.bind(this));
		}
	}

	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyTemplates.forEach(template => template.destroy());
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#collectionElement.getAttribute(attribute);
		})
	}

	#findTemplateElms() {
		const templateElms = Array.from(this.#collectionElement.querySelectorAll("[strapi-template]"))
		return templateElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === this.#collectionElement);
	}

	#findInsertBeforeElm(templateElm) {
		let curElm = templateElm.nextElementSibling;
		while (curElm) {
			if (!curElm.hasAttribute("strapi-template")) {
				return curElm;
			}

			curElm = curElm.nextElementSibling;
		}

		return null;
	}

	#findFieldElms(templateElm) {
		const querySelectorString = Strapify.validStrapifyFieldAttributes.map(attribute => `[${attribute}]`).join(",");
		const fieldElms = Array.from(templateElm.querySelectorAll(querySelectorString));
		return fieldElms.filter(child => child.closest("[strapi-template]") === templateElm);
	}

	#holdHeight() {
		this.#minHeightCache = this.#collectionElement.style.minHeight;
		this.#collectionElement.style.minHeight = `${this.#collectionElement.offsetHeight}px`;
	}

	#releaseHeight() {
		this.#collectionElement.style.minHeight = this.#minHeightCache;
	}

	#onPageControlClick(e) {
		const pageControlElm = e.target;
		const type = pageControlElm.getAttribute("strapi-page-control");

		const page = this.#collectionData.meta.pagination.page;
		const pageCount = this.#collectionData.meta.pagination.pageCount;

		if (type === "right") {
			const newPageIndex = Math.min(page + 1, pageCount);
			if (newPageIndex !== page) {
				this.#collectionElement.setAttribute("strapi-collection-page", newPageIndex);
			}

		}
		else if (type === "left") {
			const newPageIndex = Math.max(page - 1, 1);
			if (newPageIndex !== page) {
				this.#collectionElement.setAttribute("strapi-collection-page", newPageIndex);
			}
		}
	}

	#getQueryString() {
		let qs = Strapify.substituteQueryStringVariables;

		//search the template element for any descendants that are strapify fields with components to generate the populate string
		let populateComponents = ""
		let componentFieldElms = this.#findFieldElms(this.#templateElm);
		componentFieldElms.forEach(fieldElm => {
			for (let attribute of Strapify.validStrapifyFieldAttributes) {
				let attributeValue = fieldElm.getAttribute(attribute);

				if (attributeValue) {
					const args = attributeValue.split("|").map(arg => arg.trim());

					for (let arg of args) {
						if (arg) {
							const _arg = Strapify.removeQueryStringVariableReferences(arg);
							if (_arg.includes(".")) {
								populateComponents += `&populate=${_arg}`;
							}
						}
					}
				}

			}
		});

		const queryStringPairs = {
			"populate=": "*" + (populateComponents !== "" ? populateComponents : ""),
			"filters": qs(this.#collectionElement.getAttribute("strapi-collection-filter")),
			"sort=": qs(this.#collectionElement.getAttribute("strapi-collection-sort")),
			"pagination[page]=": qs(this.#collectionElement.getAttribute("strapi-collection-page")),
			"pagination[pageSize]=": qs(this.#collectionElement.getAttribute("strapi-collection-page-size")),
		}

		//Ridiculous but elegant?
		const queryString = "?" + Object.keys(queryStringPairs).map((prefix) => {
			if (queryStringPairs[prefix]) {
				return queryStringPairs[prefix].split("|").map(arg => {
					return `${prefix}${arg.trim()}`
				}).join("&");
			}
		}).filter(item => item).join("&");

		return queryString;
	}

	async process() {
		//hold the height of the collection element to prevent page from jumping
		this.#holdHeight();

		//destroy all strapify templates
		this.#strapifyTemplates.forEach(template => template.destroy());
		this.#strapifyTemplates = [];

		//get the strapi data
		if (this.#overrideCollectionData === undefined) {
			let collectionName
			if (this.#attributes["strapi-collection"]) {
				collectionName = this.#attributes["strapi-collection"]
			}
			else if (this.#attributes["strapi-relation"]) {
				collectionName = this.#attributes["strapi-relation"].split(",")[1].trim();
			}
			else if (this.#attributes["strapi-single-type-relation"]) {
				collectionName = this.#attributes["strapi-single-type-relation"].split(",")[1].trim();
			}

			const queryString = this.#getQueryString();
			const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)
			this.#collectionData = collectionData
		} else {
			this.#collectionData = this.#overrideCollectionData;
			//console.log("!!!!", this.#collectionData);
		}

		//loop through the collection data and create a strapify template for each item
		for (let i = 0; i < this.#collectionData.data.length; i++) {
			const { id: strapiDataId, attributes: strapiDataAttributes } = this.#collectionData.data[i];

			//clone the template and put it into the DOM
			let templateClone = this.#templateElm.cloneNode(true);
			if (this.#insertBeforeElm !== null) {
				this.#insertionElm.insertBefore(templateClone, this.#insertBeforeElm);
			} else {
				this.#insertionElm.appendChild(templateClone);
			}

			//create a strapify template for the template clone
			const strapifyTemplate = new StrapifyTemplate(templateClone, strapiDataId, strapiDataAttributes);
			this.#strapifyTemplates.push(strapifyTemplate);

			//process the strapify template
			strapifyTemplate.process();
		}

		//release the height of the collection element
		this.#releaseHeight();
	}
}

export default StrapifyCollection;