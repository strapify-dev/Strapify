import Strapify from "./Strapify.js";
import StrapifyControl from "./StrapifyControl.js";
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
	#conditionalTemplateElms;
	#stateElms;

	#mutationObserver;
	#minHeightCache;

	#attributes = {
		"strapi-collection": undefined,
		"strapi-relation": undefined,
		"strapi-single-type-relation": undefined,
		"strapi-filter": undefined,
		"strapi-filter-internal-relation": undefined,
		"strapi-filter-internal-control": undefined,
		"strapi-sort": undefined,
		"strapi-sort-internal-relation": undefined,
		"strapi-sort-internal-control": undefined,
		"strapi-page": undefined,
		"strapi-page-size": undefined
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

		const templateElms = Strapify.findTemplateElms(this.#collectionElement);
		const conditionalTemplateElms = Strapify.findUniqueConditionalTemplateElms(this.#collectionElement);

		if (conditionalTemplateElms.length > 0) {
			this.#conditionalTemplateElms = conditionalTemplateElms.map((conditionalTemplateElm) => conditionalTemplateElm.cloneNode(true));
			this.#templateElm = templateElms.filter(templateElm => !templateElm.hasAttribute("strapi-template-conditional"))[0].cloneNode(true);
		} else {
			this.#templateElm = templateElms[0].cloneNode(true);
		}

		this.#insertionElm = templateElms[0].parentElement;
		this.#insertBeforeElm = Strapify.findInsertBeforeElm(templateElms[0]);

		templateElms.forEach(templateElm => templateElm.remove());

		const pageControlElms = Strapify.findPageControlElms(this.#collectionElement);
		const filterControlElms = Strapify.findFilterControlElms(this.#collectionElement);
		const sortControlElms = Strapify.findSortControlElms(this.#collectionElement);

		const controlElms = [...pageControlElms, ...filterControlElms, ...sortControlElms];
		controlElms.forEach(controlElm => {
			const control = new StrapifyControl(controlElm, this.#collectionElement, this);
		})
	}

	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyTemplates.forEach(template => template.destroy());
	}

	setPage(page) {
		const pageCount = this.#collectionData.meta.pagination.pageCount;

		const newPage = Math.max(1, Math.min(page, pageCount));

		if (newPage !== this.#collectionData.meta.pagination.page) {
			this.#collectionElement.setAttribute("strapi-page", newPage);
		}
	}

	getPage() {
		return this.#collectionData.meta.pagination.page;
	}

	getPageCount() {
		return this.#collectionData.meta.pagination.pageCount;
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#collectionElement.getAttribute(attribute);
		})
	}

	#holdHeight() {
		this.#minHeightCache = this.#insertionElm.style.minHeight;
		this.#insertionElm.style.minHeight = `${this.#insertionElm.offsetHeight}px`;
	}

	#releaseHeight() {
		this.#insertionElm.style.minHeight = this.#minHeightCache;
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

	#getQueryString() {
		let qs = Strapify.substituteQueryStringVariables;

		//search the template element for any descendants that are strapify fields with components to generate the populate string
		let populateComponents = ""

		let templateElms = [];
		this.#templateElm && templateElms.push(this.#templateElm);
		this.#conditionalTemplateElms && this.#conditionalTemplateElms.forEach(conditionalTemplateElm => templateElms.push(conditionalTemplateElm));

		for (let templateElm of templateElms) {
			let componentFieldElms = Strapify.findFieldElms(templateElm);
			let componentRelationElms = Strapify.findRelationElms(templateElm);
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
		}

		//filter out any duplicate populate strings
		populateComponents = [...new Set(populateComponents.split("&"))].join("&");

		let filter = undefined;
		if (this.#attributes["strapi-filter"]) {
			filter = this.#attributes["strapi-filter"];
		}
		if (this.#attributes["strapi-filter-internal-relation"]) {
			filter = filter ? filter + " | " + this.#attributes["strapi-filter-internal-relation"] : this.#attributes["strapi-filter-internal-relation"];
		}
		if (this.#attributes["strapi-filter-internal-control"]) {
			filter = filter ? filter + " | " + this.#attributes["strapi-filter-internal-control"] : this.#attributes["strapi-filter-internal-control"];
		}

		let sort = undefined;
		if (this.#attributes["strapi-sort"]) {
			sort = this.#attributes["strapi-sort"];
		}
		if (this.#attributes["strapi-sort-internal-relation"]) {
			sort = sort ? sort + " | " + this.#attributes["strapi-sort-internal-relation"] : this.#attributes["strapi-sort-internal-relation"];
		}
		if (this.#attributes["strapi-sort-internal-control"]) {
			sort = sort ? sort + " | " + this.#attributes["strapi-sort-internal-control"] : this.#attributes["strapi-sort-internal-control"];
		}

		const queryStringPairs = {
			"populate=": "*" + (populateComponents !== "" ? populateComponents : ""),
			"filters": filter,
			"sort=": sort,
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

				let queryString;
				if (this.#conditionalTemplateElms) {
					queryString = this.#getQueryString(this.#conditionalTemplateElms[0]);
				} else {
					queryString = this.#getQueryString(this.#templateElm);
				}

				const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)
				this.#collectionData = collectionData
			} else {
				this.#collectionData = this.#overrideCollectionData;
			}

			//loop through the collection data and create a strapify template for each item
			for (let i = 0; i < this.#collectionData.data.length; i++) {
				const { id: strapiDataId, attributes: strapiDataAttributes } = this.#collectionData.data[i];

				//determine which template to use
				let templateElm = this.#templateElm;
				if (this.#conditionalTemplateElms) {
					for (let conditionalTemplateElm of this.#conditionalTemplateElms) {
						const condition = conditionalTemplateElm.getAttribute("strapi-template-conditional");
						const parsedConditionData = Strapify.parseCondition(condition, strapiDataAttributes).result;

						if (Strapify.checkCondition(parsedConditionData, strapiDataAttributes)) {
							templateElm = conditionalTemplateElm;
							break;
						}
					}
				}

				//clone the template and put it into the DOM
				let templateClone = templateElm.cloneNode(true);
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

			//dispatch custom event with the collection data
			this.#collectionElement.dispatchEvent(new CustomEvent("collectionchange", {
				bubbles: false,
				target: this.#collectionElement,
				detail: {
					collectionData: this.#collectionData,
				}
			}));

			this.#state = "success";
			this.#reflectState();

			Strapify.reinitializeIX2()

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