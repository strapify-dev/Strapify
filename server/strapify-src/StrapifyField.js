import Strapify from "./Strapify"

class StrapifyField {
	#fieldElement;
	#strapiDataAttributes
	#mutationObserver;

	#managedClasses = [];

	#attributes = {
		"strapi-field": undefined,
		"strapi-class-add": undefined,
		"strapi-class-replace": undefined,
		"strapi-class-conditional": undefined,
		"strapi-into": undefined,
		"strapi-css-rule": undefined,
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
			this.#managedClasses.push({ state: "added", name: className });
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
			this.#managedClasses.push({ state: "removed", name: classToReplace });
			this.#managedClasses.push({ state: "added", name: classReplaceValue });
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
				this.#managedClasses.push({ state: "added", name: className });
			}
		})
	}

	#processStrapiInto(strapiAttributes) {
		const attributeValue = this.#fieldElement.getAttribute("strapi-into");
		const args = attributeValue.split("|");

		args.forEach((arg) => {
			const split = arg.split("->");
			const intoAttributeName = split[1].trim();
			let intoDataValue = split[0].trim();
			console.log(intoDataValue);
			
			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;
			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = arg.match(regex);

			// if no matches, then no strapi variables in arg
			if (!matches) {
				intoDataValue = Strapify.substituteQueryStringVariables(intoDataValue);
				intoDataValue = Strapify.getStrapiComponentValue(intoDataValue, strapiAttributes);
				this.#fieldElement.setAttribute(intoAttributeName, intoDataValue);
				return;
			}
			
			// otherwise, replace strapi variables with values from getStrapiComponentValue
			matches.forEach((match) => {
				const strapiFieldName = match.substring(2, match.length - 2);
				let strapiValue = Strapify.substituteQueryStringVariables(strapiFieldName);
				strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
				intoDataValue = intoDataValue.replace(match, strapiValue);
			});

			this.#fieldElement.setAttribute(intoAttributeName, intoDataValue);
		})
	}

	#processStrapiCSSRule(strapiAttributes) {
		const attributeValue = this.#fieldElement.getAttribute("strapi-css-rule");
		const args = attributeValue.split("|").map(arg => arg.trim());

		args.forEach((arg) => {
			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = arg.match(regex);
			matches.forEach((match) => {
				const strapiFieldName = match.substring(2, match.length - 2);
				let strapiValue = Strapify.substituteQueryStringVariables(strapiFieldName);
				strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
				arg = arg.replace(match, strapiValue);
			})

			//add arg to the style attribute of the fieldElement without replacing the existing style attribute
			const existingStyleAttribute = this.#fieldElement.getAttribute("style");
			if (existingStyleAttribute !== null && existingStyleAttribute !== undefined) {
				arg = existingStyleAttribute + arg;
			}
			this.#fieldElement.setAttribute("style", arg);
		})
	}

	process(strapiDataAttributes) {
		this.#strapiDataAttributes = strapiDataAttributes;

		this.#managedClasses.forEach((managedClass) => {
			if (managedClass.state === "added") {
				this.#fieldElement.classList.remove(managedClass.name);
			} else if (managedClass.state === "removed") {
				this.#fieldElement.classList.add(managedClass.name);
			}
		})
		this.#managedClasses = [];

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

		if (this.#attributes["strapi-css-rule"]) {
			this.#processStrapiCSSRule(strapiDataAttributes);
		}
	}
}

export default StrapifyField;