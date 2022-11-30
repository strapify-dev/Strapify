import Strapify from "./Strapify"

class StrapifyField {
	#fieldElement;
	#strapiDataAttributes
	#mutationObserver;

	#attributes = {
		"strapi-field": undefined,
		"strapi-class-add": undefined,
		"strapi-class-replace": undefined,
		"strapi-class-conditional": undefined,
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
		let attributeValue = this.#fieldElement.getAttribute("strapi-field");
		attributeValue = Strapify.substituteQueryStringVariables(attributeValue)
		const strapiDataValue = Strapify.getStrapiComponentValue(attributeValue, strapiAttributes);

		Strapify.modifyElmWithStrapiData(strapiDataValue, this.#fieldElement);
	}

	#processStrapiClassAddElms(strapiAttributes) {
		const attributeValue = this.#fieldElement.getAttribute("strapi-class-add");
		const strapiFieldNames = attributeValue.split("|");

		strapiFieldNames.forEach((strapiFieldName) => {
			const _strapiFieldName = Strapify.substituteQueryStringVariables(strapiFieldName.trim());
			const className = Strapify.getStrapiComponentValue(_strapiFieldName, strapiAttributes);
			this.#fieldElement.classList.add(className);
		})
	}

	#processStrapiClassReplace(strapiAttributes) {
		const attributeValue = this.#fieldElement.getAttribute("strapi-class-replace");
		const args = attributeValue.split("|");

		args.forEach((arg) => {
			const split = arg.split(",");
			const classToReplace = split[0].trim();
			let classReplaceStrapiFieldName = split[1].trim();
			classReplaceStrapiFieldName = Strapify.substituteQueryStringVariables(classReplaceStrapiFieldName);
			const classReplaceValue = Strapify.getStrapiComponentValue(classReplaceStrapiFieldName, strapiAttributes);

			this.#fieldElement.classList.remove(classToReplace);
			this.#fieldElement.classList.add(classReplaceValue);
		})
	}

	#processStrapiConditionalClass(strapiDataAttributes) {
		const attributeValue = this.#attributes["strapi-class-conditional"];

		//split attributeValue string on single occurence of "|" but not on double occurence of "||"
		const args = attributeValue.split(/(?<!\|)\|(?!\|)/).map(arg => arg.trim());

		args.forEach(arg => {
			const argSplit = arg.split(",");
			const conditionString = argSplit[0].trim();
			const className = argSplit[1].trim();

			const parsedConditionData = Strapify.parseCondition(conditionString).result;

			const conditionSatisfied = Strapify.checkCondition(parsedConditionData, strapiDataAttributes);

			if (conditionSatisfied) {
				this.#fieldElement.classList.add(className);
			}
		})
	}

	#processStrapiInto(strapiAttributes) {
		const attributeValue = this.#fieldElement.getAttribute("strapi-into");
		const args = attributeValue.split("|");

		args.forEach((arg) => {
			const split = arg.split("->");
			let strapiFieldName = split[0].trim();
			strapiFieldName = Strapify.substituteQueryStringVariables(strapiFieldName);
			const intoDataValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
			const intoAttributeName = split[1].trim();

			this.#fieldElement.setAttribute(intoAttributeName, intoDataValue);
		})
	}

	process(strapiDataAttributes) {
		this.#strapiDataAttributes = strapiDataAttributes;

		if (this.#attributes["strapi-field"] !== null && this.#attributes["strapi-field"] !== undefined) {
			this.#processStrapiFieldElms(strapiDataAttributes);
		}

		if (this.#attributes["strapi-class-add"]) {
			this.#processStrapiClassAddElms(strapiDataAttributes);
		}

		if (this.#attributes["strapi-class-replace"]) {
			this.#processStrapiClassReplace(strapiDataAttributes);
		}

		if (this.#attributes["strapi-class-conditional"]) {
			this.#processStrapiConditionalClass(strapiDataAttributes);
		}

		if (this.#attributes["strapi-into"]) {
			this.#processStrapiInto(strapiDataAttributes);
		}
	}
}

export default StrapifyField;