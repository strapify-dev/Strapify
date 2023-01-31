import Strapify from "./Strapify"
import StrapifyParse from "./StrapifyParse";

class StrapifyField {
	//the field element this class manages
	#fieldElement;
	//the strapi data attributes, to be passed from the template
	#strapiDataAttributes
	//mutation observer to watch for strapify attribute changes
	#mutationObserver;

	//the css classes that have been added to the field element (strapi-class-add, strapi-class-conditional, ...)
	#managedClasses = [];

	//the allowed strapify attributes for the field element
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

	//soft destroy that disconnects the mutation observer
	destroy() {
		this.#mutationObserver.disconnect();
	}

	//update data attributes
	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#fieldElement.getAttribute(attribute);
		})
	}

	//for strapi-field
	#processStrapiFieldElms(strapiAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-field"], {
			attributeName: "strapi-field",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: "",
			multipleArguments: false,
			subArgumentDetails: [
				{
					name: "strapi_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION,
					substituteQueryStringVariables: true
				}
			]
		})
		const fieldPath = args[0].value;

		const strapiDataValue = Strapify.getStrapiComponentValue(fieldPath, strapiAttributes);
		Strapify.modifyElmWithStrapiData(strapiDataValue, this.#fieldElement);
	}

	//for strapi-class-add
	#processStrapiClassAddElms(strapiAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-class-add"], {
			attributeName: "strapi-class-add",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: "",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "strapi_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION,
					substituteQueryStringVariables: true
				}
			]
		})

		args.forEach((arg) => {
			const strapiFieldName = arg.value
			const className = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
			this.#fieldElement.classList.add(className);
			this.#managedClasses.push({ state: "added", name: className });
		})
	}

	//for strapi-class-replace
	#processStrapiClassReplace(strapiAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-class-replace"], {
			attributeName: "strapi-class-replace",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: ",",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "existing_class_name",
					type: StrapifyParse.SUB_ARG_TYPE.STRING,
					substituteQueryStringVariables: false
				},
				{
					name: "strapi_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION,
					substituteQueryStringVariables: true
				}
			]
		})

		args.forEach((arg) => {
			const classToReplace = arg.subArgs[0].value;
			let strapiFieldName = arg.subArgs[1].value;
			const classReplaceValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);

			this.#fieldElement.classList.remove(classToReplace);
			this.#fieldElement.classList.add(classReplaceValue);
			this.#managedClasses.push({ state: "removed", name: classToReplace });
			this.#managedClasses.push({ state: "added", name: classReplaceValue });
		})
	}

	//for strapi-class-conditional
	#processStrapiConditionalClass(strapiDataAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-class-conditional"], {
			attributeName: "strapi-conditional-class",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: ",",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "condition",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION_CONDITION,
					substituteQueryStringVariables: false
				},
				{
					name: "strapi_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION,
					substituteQueryStringVariables: true
				}
			]
		})

		args.forEach(arg => {
			const conditionString = arg.subArgs[0].value;
			const className = arg.subArgs[1].value;

			const parsedConditionData = Strapify.parseCondition(conditionString).result;
			const conditionSatisfied = Strapify.checkCondition(parsedConditionData, strapiDataAttributes);

			if (conditionSatisfied) {
				this.#fieldElement.classList.add(className);
				this.#managedClasses.push({ state: "added", name: className });
			}
		})
	}

	//for strapi-into
	#processStrapiInto(strapiAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-into"], {
			attributeName: "strapi-into",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: "->",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "html_attribute_value_template",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION_TEMPLATE,
					substituteQueryStringVariables: true
				},
				{
					name: "html_attribute_name",
					type: StrapifyParse.SUB_ARG_TYPE.STRING,
					substituteQueryStringVariables: false
				}
			]
		})

		args.forEach((arg) => {
			let intoDataValue = arg.subArgs[0].value;
			const intoAttributeName = arg.subArgs[1].value;

			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = intoDataValue.match(regex);

			//if no matches, then no strapi variables in arg
			if (!matches) {
				intoDataValue = Strapify.substituteQueryStringVariables(intoDataValue);
				intoDataValue = Strapify.getStrapiComponentValue(intoDataValue, strapiAttributes);
				this.#fieldElement.setAttribute(intoAttributeName, intoDataValue);
				return;
			}

			//otherwise, replace strapi variables with values from getStrapiComponentValue
			matches.forEach((match) => {
				const strapiFieldName = match.substring(2, match.length - 2);
				let strapiValue = Strapify.substituteQueryStringVariables(strapiFieldName);
				strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
				intoDataValue = intoDataValue.replace(match, strapiValue);
			});

			this.#fieldElement.setAttribute(intoAttributeName, intoDataValue);
		})
	}

	//for strapi-css-rule
	#processStrapiCSSRule(strapiAttributes) {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-css-rule"], {
			attributeName: "strapi-css-rule",
			htmlElement: this.#fieldElement,
			subArgumentDeliminator: "",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "css_rule_template",
					type: StrapifyParse.SUB_ARG_TYPE.COLLECTION_TEMPLATE,
					substituteQueryStringVariables: true
				}
			]
		})

		args.forEach((arg) => {
			let argValue = arg.subArgs[0].value;

			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = argValue.match(regex);

			if (matches) {
				matches.forEach((match) => {
					const strapiFieldName = match.substring(2, match.length - 2);
					let strapiValue = Strapify.substituteQueryStringVariables(strapiFieldName);
					strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
					argValue = argValue.replace(match, strapiValue);
				})
			}

			//add arg to the style attribute of the fieldElement without replacing the existing style attribute
			const existingStyleAttribute = this.#fieldElement.getAttribute("style");
			if (existingStyleAttribute !== null && existingStyleAttribute !== undefined) {
				argValue = existingStyleAttribute + argValue;
			}
			this.#fieldElement.setAttribute("style", argValue);
		})
	}

	process(strapiDataAttributes) {
		this.#strapiDataAttributes = strapiDataAttributes;

		//restore the set of css classes on the fieldElement to the state it was in before Strapify was applied
		this.#managedClasses.forEach((managedClass) => {
			if (managedClass.state === "added") {
				this.#fieldElement.classList.remove(managedClass.name);
			} else if (managedClass.state === "removed") {
				this.#fieldElement.classList.add(managedClass.name);
			}
		})
		this.#managedClasses = [];

		//execute the appropriate function for each defined data attribute
		const attributeToFunctionMap = {
			"strapi-field": this.#processStrapiFieldElms,
			"strapi-class-add": this.#processStrapiClassAddElms,
			"strapi-class-replace": this.#processStrapiClassReplace,
			"strapi-class-conditional": this.#processStrapiConditionalClass,
			"strapi-into": this.#processStrapiInto,
			"strapi-css-rule": this.#processStrapiCSSRule
		}
		Object.keys(attributeToFunctionMap).forEach((attribute) => {
			if (this.#attributes[attribute]) {
				attributeToFunctionMap[attribute].call(this, strapiDataAttributes);
			}
		})
	}
}

export default StrapifyField;