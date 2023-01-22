import Strapify from "./Strapify.js";
import StrapifyControl from "./StrapifyControl.js";
import StrapifyTemplate from "./StrapifyTemplate"
import strapiRequest from "./util/strapiRequest";

class StrapifyCollection {
	//element that contains the strapify-collection attribute
	#collectionElement;
	//collection data from strapi
	#collectionData;
	//visible state of the collectionElement
	#state = "initial";
	//used repeatable elements to emulate a non existent strapi collection
	#overrideCollectionData;
	//strapify templates that are used to render the collection entries
	#strapifyTemplates = [];

	//element that the collection entries (cloned templates) are inserted into
	#insertionElm;
	//element that the collection entries (cloned templates) are inserted before
	#insertBeforeElm;
	//holds the (first found) non conditional template element 
	#templateElm;
	//holds the conditional template elements
	#conditionalTemplateElms;
	//holds any state elements (strapify-state-element)
	#stateElms;

	//mutation observer to watch for strapify attribute changes
	#mutationObserver;
	//holds the height of the collection element, used to keep the size stable when templates are added/removed
	#minHeightCache;
	//holds references to all template elements
	#templateElmCache;

	//the allowed attributes for the collection element
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
		"strapi-page-size": undefined,
		"strapi-hide-on-fail": undefined,
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

		//find the template elements
		const templateElms = Strapify.findTemplateElms(this.#collectionElement);
		this.#templateElmCache = templateElms

		//find the conditional template elements, exlcluding any with duplicate conditions
		const conditionalTemplateElms = Strapify.findUniqueConditionalTemplateElms(this.#collectionElement);

		//set the templateElms and conditionalTemplateElms that will be used to render the collection entries
		if (conditionalTemplateElms.length > 0) {
			this.#conditionalTemplateElms = conditionalTemplateElms.map((conditionalTemplateElm) => conditionalTemplateElm.cloneNode(true));
			this.#templateElm = templateElms.filter(templateElm => !templateElm.hasAttribute("strapi-template-conditional"))[0].cloneNode(true);
		} else {
			this.#templateElm = templateElms[0].cloneNode(true);
		}

		//find the insertion element and the insert before element
		this.#insertionElm = templateElms[0].parentElement;
		this.#insertBeforeElm = Strapify.findInsertBeforeElm(templateElms[0]);

		//remove all the template elements from the DOM
		templateElms.forEach(templateElm => templateElm.remove());

		//find the control elements
		const pageControlElms = Strapify.findPageControlElms(this.#collectionElement);
		const filterControlElms = Strapify.findFilterControlElms(this.#collectionElement);
		const sortControlElms = Strapify.findSortControlElms(this.#collectionElement);

		//instantiate strapify control elements
		const controlElms = [...pageControlElms, ...filterControlElms, ...sortControlElms];
		controlElms.forEach(controlElm => {
			new StrapifyControl(controlElm, this.#collectionElement, this);
		})
	}

	//soft destroy that clears the templates and restores the original template elements
	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyTemplates.forEach(template => template.destroy());
		this.#templateElmCache.forEach(templateElm => {
			if (this.#insertBeforeElm) {
				this.#insertionElm.insertBefore(templateElm, this.#insertBeforeElm)
			} else {
				this.#insertionElm.appendChild(templateElm);
			}
		});
	}

	//used by control elements to set the page, clamping value to limits
	setPage(page) {
		const pageCount = this.#collectionData.meta.pagination.pageCount;

		const newPage = Math.max(1, Math.min(page, pageCount));

		if (newPage !== this.#collectionData.meta.pagination.page) {
			this.#collectionElement.setAttribute("strapi-page", newPage);
		}
	}

	//used by control elements to get the current page
	getPage() {
		return this.#collectionData.meta.pagination.page;
	}

	//used by control elements to get the page count
	getPageCount() {
		return this.#collectionData.meta.pagination.pageCount;
	}

	//update attributes with the values from the element's data attributes
	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#collectionElement.getAttribute(attribute);
		})
	}

	//explicitly set the height of the insertion element (to its current height) to prevent the page from jumping around
	#holdHeight() {
		this.#minHeightCache = this.#insertionElm.style.minHeight;
		this.#insertionElm.style.minHeight = `${this.#insertionElm.offsetHeight}px`;
	}

	//remove the explicit height css rule from the insertion element, restoring the original value
	#releaseHeight() {
		this.#insertionElm.style.minHeight = this.#minHeightCache;
	}

	//hide/show the state elements based on the current state
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
		//alias the substituteQueryStringVariables function for it is a long boy
		let qs = Strapify.substituteQueryStringVariables;

		//will contain the part of the query string that defines the population of components in the collection
		let componentPopulationString = ""

		//create an array of all usable template elements (non duplicate templates and conditional templates)
		let templateElms = [];
		this.#templateElm && templateElms.push(this.#templateElm);
		this.#conditionalTemplateElms && this.#conditionalTemplateElms.forEach(conditionalTemplateElm => templateElms.push(conditionalTemplateElm));

		//search each template element for any descendants that are strapify fields with components to generate the componentPopulationString
		for (let templateElm of templateElms) {
			//find all strapify elements which may contain component references
			let componentFieldElms = Strapify.findFieldElms(templateElm);
			let componentRelationElms = Strapify.findRelationElms(templateElm);
			let componentElms = componentFieldElms.concat(componentRelationElms);

			//and for each of those elements, find any component references and add them to the componentPopulationString
			componentElms.forEach(componentElm => {
				//we need to check all the attributes that may contain component references
				for (let attribute of [...Strapify.validStrapifyFieldAttributes, "strapi-relation"]) {
					let attributeValue = componentElm.getAttribute(attribute);

					if (attributeValue) {
						//split into multiple arguments where possible, take only values before the first comma (occurs when we have a strapi-relation attribute)
						const args = attributeValue.split("|").map(arg => arg.split(",")[0].trim());

						//finally, for each argument, if there are . characters after query string variables are removed, it is a component reference
						for (let arg of args) {
							if (arg) {
								const _arg = Strapify.removeQueryStringVariableReferences(arg);
								if (_arg.includes(".")) {
									componentPopulationString += `&populate=${_arg}`;
								}
							}
						}
					}
				}
			});
		}

		//filter out any duplicate populate strings
		componentPopulationString = [...new Set(componentPopulationString.split("&"))].join("&");

		//join the user filter with the internal filter attributes that are set by the control elements and relation restrictions
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

		//join the user sort with the internal sort attributes that are set by the control elements and relation restrictions
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

		//pairs of query string variable identifiers and the data which will be transformed into their values (just for conciseness)
		const queryStringPairs = {
			"populate=": "*" + (componentPopulationString !== "" ? componentPopulationString : ""),
			"filters": qs(filter),
			"sort=": qs(sort),
			"pagination[page]=": qs(this.#collectionElement.getAttribute("strapi-page")),
			"pagination[pageSize]=": qs(this.#collectionElement.getAttribute("strapi-page-size")),
		}

		//transform the pairs into a query string
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
		//wrap the entire process in a try catch block so we can reflect state and emit events on failure
		try {
			//hold the height of the collection element to prevent page from jumping
			this.#holdHeight();

			//destroy all strapify templates
			this.#strapifyTemplates.forEach(template => template.destroy());
			this.#strapifyTemplates = [];

			//since this class is used for collections, relations and repeatbles we need to determine which of those we are dealing with
			//when there is no overrideCollectionData, we are dealing with a collection or relation
			if (this.#overrideCollectionData === undefined) {
				//get the collection name, how this is done depends on the type of strapify element we are dealing with
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

				//get the collection data
				this.#collectionData = await strapiRequest(`/api/${collectionName}`, this.#getQueryString());
			} 
			//otherwise we are dealing with a repeatable, so we can just use the overrideCollectionData
			else {
				this.#collectionData = this.#overrideCollectionData;
			}

			//templates will be processed asynchronously, since they can have relations, repeatables
			const processPromises = [];

			//loop through the collection data and create a strapify template for each item
			for (let i = 0; i < this.#collectionData.data.length; i++) {
				const { id: strapiDataId, attributes: strapiDataAttributes } = this.#collectionData.data[i];

				//by default we use the template element
				let templateElm = this.#templateElm;
				
				//but if there are conditional template elements we need to check if one of them matches
				if (this.#conditionalTemplateElms) {
					//so iteratively check each condition and break if one matches, use the matching template
					for (let conditionalTemplateElm of this.#conditionalTemplateElms) {
						const condition = conditionalTemplateElm.getAttribute("strapi-template-conditional");
						const parsedConditionData = Strapify.parseCondition(condition, strapiDataAttributes).result;

						if (Strapify.checkCondition(parsedConditionData, strapiDataAttributes)) {
							templateElm = conditionalTemplateElm;
							break;
						}
					}
				}

				//clone the chosen template element and put it into the DOM
				let templateClone = templateElm.cloneNode(true);
				if (this.#insertBeforeElm !== null) {
					this.#insertionElm.insertBefore(templateClone, this.#insertBeforeElm);
				} else {
					this.#insertionElm.appendChild(templateClone);
				}

				//create a strapify template for the template element clone
				const strapifyTemplate = new StrapifyTemplate(templateClone, strapiDataId, strapiDataAttributes);
				this.#strapifyTemplates.push(strapifyTemplate);

				processPromises.push(strapifyTemplate.process());
			}

			//wait for all templates to be processed
			await Promise.allSettled(processPromises);
			
			//dispatch custom event with the collection data
			this.#collectionElement.dispatchEvent(new CustomEvent("strapiCollectionChange", {
				bubbles: false,
				target: this.#collectionElement,
				detail: {
					collectionData: this.#collectionData,
				}
			}));

			//reflect the state on success
			this.#state = "success";
			if (this.#collectionElement.hasAttribute("strapi-hide-on-fail")) {
				this.#collectionElement.classList.remove("strapify-hide");
			}
			this.#reflectState();

			//trigger webflow animation fix
			Strapify.reinitializeIX2()

			//release the height of the collection element
			this.#releaseHeight();
		} catch (err) {
			//reflect the state on failure
			this.#state = "error";
			if (this.#collectionElement.hasAttribute("strapi-hide-on-fail")) {
				this.#collectionElement.classList.add("strapify-hide");
			}
			this.#reflectState();
			console.error(err);
		}
	}
}

export default StrapifyCollection;