import Strapify from "./Strapify"

class StrapifyField {
	#fieldElement;
	#strapiDataAttributes
	#mutationObserver;

	#attributes = {
		"strapi-field": undefined,
		"strapi-class-add": undefined,
		"strapi-class-replace": undefined,
		"strapi-into": undefined,
	}

	constructor(fieldElement) {
		this.#fieldElement = fieldElement;
		this.#updateAttributes();

		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.#updateAttributes();
					this.process(this.#strapiDataAttributes);
				}
			});
		});

		this.#mutationObserver.observe(this.#fieldElement, {
			attributes: true,
			attributeFilter: Strapify.validStrapifyFieldAttributes
		});
	}

	destroy() {
		this.#mutationObserver.disconnect();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#fieldElement.getAttribute(attribute);
		})
	}

	#processStrapiFieldElms(strapiAttributes) {
		const fieldId = this.#fieldElement.getAttribute("strapi-field");
		const fieldValue = strapiAttributes[fieldId];

		Strapify.modifyElmWithStrapiData(fieldValue, this.#fieldElement);
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
		this.#strapiDataAttributes = strapiDataAttributes;

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