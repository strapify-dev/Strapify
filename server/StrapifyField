import { marked } from "marked";

class StrapifyField {
	static validAttributes = [
		"strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-into"
	];

	#fieldElement;
	#strapi_api_url = "http://localhost:1337";
	#mutationObserver;

	#attributes = {
		"strapi-field": undefined,
		"strapi-class-add": undefined,
		"strapi-class-replace": undefined,
		"strapi-into": undefined,
	}

	constructor(fieldElement, strapi_api_url) {
		this.#fieldElement = fieldElement;
		this.#strapi_api_url = strapi_api_url;
		this.#updateAttributes();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#fieldElement.getAttribute(attribute);
		})
	}

	#injectStrapiData(strapiData) {
		let elm = this.#fieldElement

		switch (true) {
			case elm instanceof HTMLParagraphElement:
				elm.innerHTML = strapiData;
				break;
			case elm instanceof HTMLHeadingElement:
				elm.innerHTML = strapiData;
				break;
			case elm instanceof HTMLSpanElement:
				elm.innerHTML = strapiData;
				break;
			case elm instanceof HTMLImageElement:
				elm.removeAttribute("srcset");
				elm.removeAttribute("sizes");
				elm.src = `${this.#strapi_api_url}${strapiData.data.attributes.url}`;
				elm.alt = strapiData.data.attributes.alternativeText;
				break;
			case elm instanceof HTMLDivElement: //IMPORTANT! this is a hack for rich text. Need something more robust. Also need to sanitize
				elm.innerHTML = marked.parse(`${strapiData}`);
				break;
			default:
				throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
		}
	}

	#processStrapiFieldElms(strapiAttributes) {
		const fieldId = this.#fieldElement.getAttribute("strapi-field");
		const fieldValue = strapiAttributes[fieldId];

		this.#injectStrapiData(fieldValue);
	}

	#processStrapiClassAddElms(strapiAttributes) {
		const strapiAttributeName = this.#fieldElement.getAttribute("strapi-class-add");
		const className = strapiAttributes[strapiAttributeName];

		this.#fieldElement.classList.add(className);
	}

	#processStrapiClassReplace(strapiAttributes) {
		const classReplaceData = this.#fieldElement.getAttribute("strapi-class-replace");

		const split = classReplaceData.split(",");
		const classToReplace = split[0].trim();
		const classReplaceValue = strapiAttributes[split[1].trim()];

		this.#fieldElement.classList.remove(classToReplace);
		this.#fieldElement.classList.add(classReplaceValue);
	}

	#processStrapiInto(strapiAttributes) {
		const intoElmData = this.#fieldElement.getAttribute("strapi-into");

		const split = intoElmData.split("->");
		const intoAttributeName = split[1].trim();
		const intoAttributeValue = strapiAttributes[split[0].trim()];

		this.#fieldElement.setAttribute(intoAttributeName, intoAttributeValue);
	}

	process(strapiDataAttributes) {
		if (this.#attributes["strapi-field"]) {
			this.#processStrapiFieldElms(strapiDataAttributes);
		}

		if (this.#attributes["strapi-class-add"]) {
			this.#processStrapiClassAddElms(strapiDataAttributes);
		}

		if (this.#attributes["strapi-class-replace"]) {
			this.#processStrapiClassReplace(strapiDataAttributes);
		}

		if (this.#attributes["strapi-into"]) {
			this.#processStrapiInto(strapiDataAttributes);
		}
	}
}

export default StrapifyField;