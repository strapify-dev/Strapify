import Strapify from "./Strapify"
import StrapifyRelation from "./StrapifyRelation"
import StrapifyRepeatable from "./StrapifyRepeatable";
import strapiRequest from "./util/strapiRequest";

class StrapifySingleType {
	#singleTypeElement;
	#mutationObserver;

	//the css classes that have been added to the field element (class-add, class-conditional, ...)
	#managedClasses = [];

	#attributes = {
		"strapi-single-type": undefined,
		"strapi-single-type-into": undefined,
		"strapi-single-type-class-add": undefined,
		"strapi-single-type-class-replace": undefined,
		"strapi-single-type-class-conditional": undefined,
		"strapi-single-type-css-rule": undefined,
		"strapi-single-type-relation": undefined,
		"strapi-single-type-repeatable": undefined
	}

	constructor(singleTypeElement) {
		this.#singleTypeElement = singleTypeElement;
		this.#updateAttributes();

		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.#updateAttributes();
					this.process();
				}
			});
		});

		this.#mutationObserver.observe(this.#singleTypeElement, {
			attributes: true,
			attributeFilter: ["strapi-single-type"]
		});
	}

	destroy() {
		this.#mutationObserver.disconnect();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#singleTypeElement.getAttribute(attribute);
		})
	}

	#splitSingleTypeNameFromArgument(argument) {
		const split = argument.split(".");
		const singleTypeName = split[0];
		const singleTypeField = split.slice(1).join(".");

		return { singleTypeName, singleTypeField };
	}

	async #processStrapiSingleTypeClassAdd() {
		const attributeValue = this.#attributes["strapi-single-type-class-add"]
		const args = attributeValue.split("|").map(arg => arg.trim());

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const splitArg = this.#splitSingleTypeNameFromArgument(arg);
			const singleTypeName = splitArg.singleTypeName;
			const singleTypeField = splitArg.singleTypeField;

			const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*");

			const _strapiFieldName = Strapify.substituteQueryStringVariables(singleTypeField);
			const className = Strapify.getStrapiComponentValue(_strapiFieldName, strapiData.data.attributes);
			this.#singleTypeElement.classList.add(className);
			this.#managedClasses.push({ state: "added", name: className });
		}
	}

	async #processStrapiSingleTypeClassReplace() {
		const attributeValue = this.#attributes["strapi-single-type-class-replace"]
		const args = attributeValue.split("|").map(arg => arg.trim());

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const subArgs = arg.split(",").map(arg => arg.trim());
			const oldClassName = subArgs[1];
			const newClassFieldName = subArgs[0];

			const splitArg = this.#splitSingleTypeNameFromArgument(newClassFieldName);
			const singleTypeName = splitArg.singleTypeName;
			const singleTypeField = splitArg.singleTypeField;

			const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*");

			const _strapiFieldName = Strapify.substituteQueryStringVariables(singleTypeField);
			const className = Strapify.getStrapiComponentValue(_strapiFieldName, strapiData.data.attributes);

			this.#singleTypeElement.classList.remove(oldClassName);
			this.#singleTypeElement.classList.add(className);
			this.#managedClasses.push({ state: "removed", name: oldClassName });
			this.#managedClasses.push({ state: "added", name: className });
		}
	}

	async #processStrapiSingleTypeConditionalClass() {
		const attributeValue = this.#attributes["strapi-single-type-class-conditional"]

		//split attributeValue string on single occurence of "|" but not on double occurence of "||"
		const args = attributeValue.split(/(?<!\|)\|(?!\|)/).map(arg => arg.trim());

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const subArgs = arg.split(",").map(arg => arg.trim());
			const conditionString = subArgs[0];
			const className = subArgs[1];

			const parsedConditionData = Strapify.parseCondition(conditionString).result;
			const conditionSatisfied = await Strapify.checkConditionSingleType(parsedConditionData);

			if (conditionSatisfied) {
				this.#singleTypeElement.classList.add(className);
				this.#managedClasses.push({ state: "added", name: className });
			}
		}
	}

	async #processStrapiSingleType() {
		let attributeValue = this.#attributes["strapi-single-type"]
		attributeValue = Strapify.substituteQueryStringVariables(attributeValue);

		const split = attributeValue.split(".");
		const singleTypeName = split[0];
		const singleTypeFieldArg = split.slice(1).join(".")

		const strapiData = await strapiRequest("/api/" + singleTypeName, `?populate=*&populate=${singleTypeFieldArg}`);

		const fieldValue = Strapify.getStrapiComponentValue(singleTypeFieldArg, strapiData.data.attributes)

		Strapify.modifyElmWithStrapiData(fieldValue, this.#singleTypeElement);
	}

	async #processStrapiSingleTypeCSSRule() {
		const attributeValue = this.#attributes["strapi-single-type-css-rule"]
		const args = attributeValue.split("|").map(arg => arg.trim());

		let strapiData = null;

		await args.forEach(async (arg) => {
			const templateString = arg;
			const htmlAttributeName = "style"

			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = templateString.match(regex);

			//if no matches, then no strapi variables in arg
			if (!matches) {
				const templateStringSplit = templateString.split(".");
				const singleTypeName = templateStringSplit[0];
				let singleTypeFieldString = templateStringSplit.filter((arg) => arg !== singleTypeName).join(".");

				if (!strapiData) {
					strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
				}

				singleTypeFieldString = Strapify.substituteQueryStringVariables(singleTypeFieldString);
				singleTypeFieldString = Strapify.getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
				this.#singleTypeElement.setAttribute(htmlAttributeName, singleTypeFieldString);
				return;
			}

			let singleTypeDataValue = templateString;

			//otherwise, replace strapi variables with values from getStrapiComponentValue
			for (let i = 0; i < matches.length; i++) {
				let match = matches[i];

				const strapiFieldName = match.substring(2, match.length - 2);

				const templateStringSplit = strapiFieldName.split(".");
				const singleTypeName = templateStringSplit[0];
				let singleTypeFieldString = templateStringSplit.filter((arg) => arg !== singleTypeName).join(".");

				let strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")

				let strapiValue = Strapify.substituteQueryStringVariables(singleTypeFieldString);
				strapiValue = Strapify.getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);

				singleTypeDataValue = singleTypeDataValue.replace(match, strapiValue);
			}

			this.#singleTypeElement.setAttribute(htmlAttributeName, singleTypeDataValue);
		})
	}

	async #processStrapiSingleTypeInto() {
		const attributeValue = this.#attributes["strapi-single-type-into"]
		const args = attributeValue.split("|").map(arg => arg.trim());

		let strapiData = null;

		await args.forEach(async (arg) => {
			const argSplit = arg.split("->").map((arg) => arg.trim());
			const templateString = argSplit[0].trim();
			const htmlAttributeName = argSplit[1].trim();

			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = templateString.match(regex);

			//if no matches, then no strapi variables in arg
			if (!matches) {
				const templateStringSplit = templateString.split(".");
				const singleTypeName = templateStringSplit[0];
				let singleTypeFieldString = templateStringSplit.filter((arg) => arg !== singleTypeName).join(".");

				if (!strapiData) {
					strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
				}

				singleTypeFieldString = Strapify.substituteQueryStringVariables(singleTypeFieldString);
				singleTypeFieldString = Strapify.getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
				this.#singleTypeElement.setAttribute(htmlAttributeName, singleTypeFieldString);
				return;
			}

			let singleTypeDataValue = templateString;

			//otherwise, replace strapi variables with values from getStrapiComponentValue
			for (let i = 0; i < matches.length; i++) {
				let match = matches[i];

				const strapiFieldName = match.substring(2, match.length - 2);

				const templateStringSplit = strapiFieldName.split(".");
				const singleTypeName = templateStringSplit[0];
				let singleTypeFieldString = templateStringSplit.filter((arg) => arg !== singleTypeName).join(".");

				let strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")

				let strapiValue = Strapify.substituteQueryStringVariables(singleTypeFieldString);
				strapiValue = Strapify.getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);

				singleTypeDataValue = singleTypeDataValue.replace(match, strapiValue);
			}

			this.#singleTypeElement.setAttribute(htmlAttributeName, singleTypeDataValue);
		})
	}

	async process() {
		if (this.#attributes["strapi-single-type"]) {
			await this.#processStrapiSingleType();
		}

		if (this.#attributes["strapi-single-type-into"]) {
			await this.#processStrapiSingleTypeInto();
		}

		if (this.#attributes["strapi-single-type-css-rule"]) {
			await this.#processStrapiSingleTypeCSSRule();
		}

		if (this.#attributes["strapi-single-type-class-add"]) {
			await this.#processStrapiSingleTypeClassAdd();
		}

		if (this.#attributes["strapi-single-type-class-replace"]) {
			await this.#processStrapiSingleTypeClassReplace();
		}

		if(this.#attributes["strapi-single-type-class-conditional"]) {
			await this.#processStrapiSingleTypeConditionalClass();
		}

		if (this.#attributes["strapi-single-type-repeatable"]) {
			const splitSingleTypeArg = this.#attributes["strapi-single-type-repeatable"].split(".");
			const _singleTypeName = splitSingleTypeArg[0];
			const strapiData = await strapiRequest("/api/" + _singleTypeName, "?populate=*")

			const strapifyRepeatable = new StrapifyRepeatable(this.#singleTypeElement, strapiData.data.id, strapiData.data.attributes)

			await strapifyRepeatable.process()
		}

		if (this.#attributes["strapi-single-type-relation"]) {
			const splitSingleTypeArg = this.#attributes["strapi-single-type-relation"].split(".");
			const _singleTypeName = splitSingleTypeArg[0];
			const strapiData = await strapiRequest("/api/" + _singleTypeName, "?populate=*")

			const strapifyRelation = new StrapifyRelation(this.#singleTypeElement, strapiData.data.id, strapiData.data.attributes)

			await strapifyRelation.process()
		}
	}
}

export default StrapifySingleType;