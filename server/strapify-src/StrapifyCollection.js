import Strapify from "./Strapify.js";
import StrapifyTemplate from "./StrapifyTemplate"
import strapiRequest from "./util/strapiRequest";

class StrapifyCollection {
	#collectionElement;
	#collectionData;
	#state = "initial";
	#overrideCollectionData;
	#strapifyTemplates = [];

	#insertionElm;
	#insertBeforeElm;
	#templateElm;
	#stateElms;

	#mutationObserver;
	#minHeightCache;

	#attributes = {
		"strapi-collection": undefined,
		"strapi-relation": undefined,
		"strapi-single-type-relation": undefined,
		"strapi-filter": undefined,
		"strapi-sort": undefined,
		"strapi-page": undefined,
		"strapi-page-size": undefined,
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

		//get the state elements and reflect the state
		this.#stateElms = Strapify.findStateElements(this.#collectionElement);
		this.#state = "loading"
		this.#reflectState();

		//use the first strapi-template element as the template and remove all others
		const templateElms = Strapify.findTemplateElms(this.#collectionElement);
		this.#insertionElm = templateElms[0].parentElement;
		this.#insertBeforeElm = Strapify.findInsertBeforeElm(templateElms[0]);
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

	#holdHeight() {
		this.#minHeightCache = this.#collectionElement.style.minHeight;
		this.#collectionElement.style.minHeight = `${this.#collectionElement.offsetHeight}px`;
	}

	#releaseHeight() {
		this.#collectionElement.style.minHeight = this.#minHeightCache;
	}

	#reflectState() {
		this.#stateElms.forEach(stateElm => {
			const stateKey = stateElm.getAttribute("strapi-state-element");

			if (stateKey === this.#state) {
				stateElm.classList.remove("strapify-hide");
			} else {
				stateElm.classList.add("strapify-hide");
			}
		});
	}

	#onPageControlClick(e) {
		const pageControlElm = e.target;
		const type = pageControlElm.getAttribute("strapi-page-control");

		const page = this.#collectionData.meta.pagination.page;
		const pageCount = this.#collectionData.meta.pagination.pageCount;

		if (type === "right") {
			const newPageIndex = Math.min(page + 1, pageCount);
			if (newPageIndex !== page) {
				this.#collectionElement.setAttribute("strapi-page", newPageIndex);
			}

		}
		else if (type === "left") {
			const newPageIndex = Math.max(page - 1, 1);
			if (newPageIndex !== page) {
				this.#collectionElement.setAttribute("strapi-page", newPageIndex);
			}
		}
	}

	#getQueryString() {
		let qs = Strapify.substituteQueryStringVariables;

		//search the template element for any descendants that are strapify fields with components to generate the populate string
		let populateComponents = ""
		let componentFieldElms = Strapify.findFieldElms(this.#templateElm);
		let componentRelationElms = Strapify.findRelationElms(this.#templateElm);
		let componentElms = componentFieldElms.concat(componentRelationElms);

		componentElms.forEach(componentElm => {
			for (let attribute of [...Strapify.validStrapifyFieldAttributes, "strapi-relation"]) {
				let attributeValue = componentElm.getAttribute(attribute);

				if (attributeValue) {

					const args = attributeValue.split("|").map(arg => arg.split(",")[0].trim());

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
			"filters": qs(this.#collectionElement.getAttribute("strapi-filter")),
			"sort=": qs(this.#collectionElement.getAttribute("strapi-sort")),
			"pagination[page]=": qs(this.#collectionElement.getAttribute("strapi-page")),
			"pagination[pageSize]=": qs(this.#collectionElement.getAttribute("strapi-page-size")),
		}

		//Ridiculous but elegant?
		const queryString = "?" + Object.keys(queryStringPairs).map((prefix) => {
			if (queryStringPairs[prefix]) {
				return queryStringPairs[prefix].split("|").map(arg => {
					return `${prefix}${arg.trim()}`
				}).join("&");
			}
		}).filter(item => item).join("&");

		//console.log(populateComponents)

		return queryString;
	}

	async process() {
		try {
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
				else if (this.#attributes["strapi-single-type-relation"]) {
					collectionName = this.#attributes["strapi-single-type-relation"].split(",")[1].trim();
				}

				const queryString = this.#getQueryString();
				const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)
				this.#collectionData = collectionData
			} else {
				this.#collectionData = this.#overrideCollectionData;
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

			this.#state = "success";
			this.#reflectState();

			//release the height of the collection element
			this.#releaseHeight();
		} catch (err) {
			this.#state = "error";
			this.#reflectState();
			console.error(err);
		}
	}

}

export default StrapifyCollection;