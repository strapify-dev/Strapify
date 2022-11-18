import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";
import { marked } from "marked";
import strapi_api_url from "./util/strapi-api-url";

class StrapifyCollection {
	static validAttributes = [
		"strapi-collection", "strapi-collection-filter", "strapi-collection-sort",
		"strapi-collection-page", "strapi-collection-page-size"
	];

	#collectionElement;
	#strapi_api_url = "http://localhost:1337";
	#templateElm;
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
		this.#strapi_api_url = strapi_api_url;
		this.#updateAttributes();

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
		//get the strapi data
		const collectionName = this.#attributes["strapi-collection"];
		const queryString = this.#getQueryString();
		const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)
		this.#collectionData = collectionData

		//find strapify field elements
		const querySelectorString = StrapifyField.validAttributes.map(attribute => `[${attribute}]`).join(",");
		const strapifyFieldElements = Array.from(this.#templateElm.querySelectorAll(querySelectorString));

		//create strapifyField objects
		this.#strapifyFields = strapifyFieldElements.map(fieldElement => new StrapifyField(fieldElement, this.#strapi_api_url));

		//loop through the collection data and process template clone with the strapi data, add to DOM
		for (let i = 0; i < collectionData.length; i++) {
			const { id: strapiDataId, attributes: strapiDataAttributes } = collectionData[i];

			//process strapi field type elements
			this.#strapifyFields.forEach(strapifyField => {
				strapifyField.process(strapiDataAttributes)
			});

			//clone the base template elm and put it in the dom
			this.#collectionElement.appendChild(this.#templateElm.cloneNode(true));
		}
	}
}

export default StrapifyCollection;