import Strapify from "./Strapify.js";
import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";

class StrapifyCollection {
	#collectionElement;
	#templateElm;
	#generatedTemplateElms = [];
	#collectionData
	#strapifyFields
	#mutationObserver;

	#attributes = {
		"strapi-collection": undefined,
		"strapi-collection-filter": undefined,
		"strapi-collection-sort": undefined,
		"strapi-collection-page": undefined,
		"strapi-collection-page-size": undefined,
	}

	constructor(collectionElement) {
		this.#collectionElement = collectionElement;
		this.#updateAttributes();

		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.#updateAttributes();
					this.process();
				}
			});
		});

		this.#mutationObserver.observe(this.#collectionElement, {
			attributes: true,
			attributeFilter: Strapify.validStrapifyCollectionAttributes
		});

		//use the first strapi-template element as the template and remove all others
		const templateElms = this.#findTemplateElms();
		this.#templateElm = templateElms[0].cloneNode(true);
		templateElms.forEach(templateElm => templateElm.remove());
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#collectionElement.getAttribute(attribute);
		})
	}

	#findTemplateElms() {
		const templateElms = Array.from(this.#collectionElement.querySelectorAll("[strapi-template]"))
		return templateElms.filter(child => child.parentElement === this.#collectionElement);
	}

	#getQueryString() {
		const queryStringPairs = {
			"filters": this.#collectionElement.getAttribute("strapi-collection-filter"),
			"sort=": this.#collectionElement.getAttribute("strapi-collection-sort"),
			"pagination[page]=": this.#collectionElement.getAttribute("strapi-collection-page"),
			"pagination[pageSize]=": this.#collectionElement.getAttribute("strapi-collection-page-size"),
			"populate=": "*"
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

		//get the strapi data
		const collectionName = this.#attributes["strapi-collection"];
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
			const strapifyFieldElements = Array.from(templateClone.querySelectorAll(querySelectorString));
			strapifyFieldElements.forEach(fieldElement => {
				const strapifyField = new StrapifyField(fieldElement)
				this.#strapifyFields.push(strapifyField);

				strapifyField.process(strapiDataAttributes)
			});

			//put template elm into the dom
			this.#collectionElement.appendChild(templateClone);
			this.#generatedTemplateElms.push(templateClone);
		}

		//console.log(this.#generatedTemplateElms)
	}
}

export default StrapifyCollection;