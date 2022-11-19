import Strapify from "./Strapify.js";
import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";

class StrapifyCollection {
	#collectionElement;
	#insertionElm
	#templateElm;
	#generatedTemplateElms = [];
	#collectionData
	#strapifyFields
	#strapifyRelations = []
	#mutationObserver;

	#attributes = {
		"strapi-collection": undefined,
		"strapi-relation": undefined,
		"strapi-collection-filter": undefined,
		"strapi-collection-sort": undefined,
		"strapi-collection-page": undefined,
		"strapi-collection-page-size": undefined,
	}

	constructor(collectionElement) {
		//set the collection element and update the attributes
		this.#collectionElement = collectionElement;
		this.#updateAttributes();

		//console.log(this.#attributes)

		//	if(this.#attributes["strapi-relation"]) {
		//		console.log(this.#collectionElement)
		//	}	

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
		this.#strapifyFields.forEach(field => field.destroy());
		this.#strapifyRelations.forEach(relation => relation.destroy());
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#collectionElement.getAttribute(attribute);
		})
	}

	#findTemplateElms() {
		const templateElms = Array.from(this.#collectionElement.querySelectorAll("[strapi-template]"))
		return templateElms.filter(child => child.closest("[strapi-collection], [strapi-relation]") === this.#collectionElement);
	}

	#findRelationElms(templateElm) {
		const relationElms = Array.from(templateElm.querySelectorAll("[strapi-relation]"))
		return relationElms.filter(child => child.closest("[strapi-template]") === templateElm);
	}

	#findFieldElms(templateElm) {
		const querySelectorString = Strapify.validStrapifyFieldAttributes.map(attribute => `[${attribute}]`).join(",");

		const fieldElms = Array.from(templateElm.querySelectorAll(querySelectorString));
		return fieldElms.filter(child => child.closest("[strapi-template]") === templateElm);
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
		const queryStringPairs = {
			"populate=": "*",
			"filters": this.#collectionElement.getAttribute("strapi-collection-filter"),
			"sort=": this.#collectionElement.getAttribute("strapi-collection-sort"),
			"pagination[page]=": this.#collectionElement.getAttribute("strapi-collection-page"),
			"pagination[pageSize]=": this.#collectionElement.getAttribute("strapi-collection-page-size"),
		}

		//Ridiculous but elegant?
		const queryString = "?" + Object.keys(queryStringPairs).map((prefix) => {
			if (queryStringPairs[prefix]) {
				return queryStringPairs[prefix].split("|").map(arg => {
					return `${prefix}${arg.trim()}`
				}).join("&");
			}
		}).filter(item => item).join("&")

		return queryString;
	}

	async process() {
		//destroy all existing strapify fields
		if (this.#strapifyFields) {
			this.#strapifyFields.forEach(strapifyField => strapifyField.destroy());
		}
		this.#strapifyFields = [];

		//destroy all existing generated template elements
		for (let i = 0; i < this.#generatedTemplateElms.length; i++) {
			this.#generatedTemplateElms[i].remove()
		}
		this.#generatedTemplateElms = [];

		//destroy all existing strapify relations
		if (this.#strapifyRelations) {
			this.#strapifyRelations.forEach(strapifyRelation => strapifyRelation.destroy());
		}

		//get the strapi data
		const collectionName = this.#attributes["strapi-collection"] ? this.#attributes["strapi-collection"] : this.#attributes["strapi-relation"];
		const queryString = this.#getQueryString();
		const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)
		this.#collectionData = collectionData

		//query string to find strapify field elements
		const querySelectorString = Strapify.validStrapifyFieldAttributes.map(attribute => `[${attribute}]`).join(",");

		//loop through the collection data and process template clone with the strapi data, add to DOM
		for (let i = 0; i < collectionData.data.length; i++) {
			const { id: strapiDataId, attributes: strapiDataAttributes } = collectionData.data[i];

			//clone the template 
			let templateClone = this.#templateElm.cloneNode(true);

			//find strapify field elements on the clone 
			const strapifyFieldElements = this.#findFieldElms(templateClone);
			strapifyFieldElements.forEach(fieldElement => {
				const strapifyField = new StrapifyField(fieldElement)
				this.#strapifyFields.push(strapifyField);

				strapifyField.process(strapiDataAttributes)
			});

			//find strapify relation elements on the clone and create a strapify collection for each relation element
			const strapifyRelationElements = this.#findRelationElms(templateClone);
			strapifyRelationElements.forEach(relationElement => {
				//use the relation ids to generate a filter string
				const relationData = strapiDataAttributes[relationElement.getAttribute("strapi-relation")].data;
				const filterString = relationData.map(relation => `[id]=${relation.id}`).join(" | ");

				//add the filter string to the relation element
				relationElement.setAttribute("strapi-collection-filter", filterString);

				//create a strapify collection with the relation data
				const strapifyRelation = new StrapifyCollection(relationElement);
				this.#strapifyRelations.push(strapifyRelation);

				strapifyRelation.process();
			})

			//put template elm into the dom
			this.#insertionElm.appendChild(templateClone);
			this.#generatedTemplateElms.push(templateClone);


		}
	}
}

export default StrapifyCollection;