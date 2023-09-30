import Strapify from "./Strapify"
import StrapifyRelation from "./StrapifyRelation"
import StrapifyRepeatable from "./StrapifyRepeatable";
import strapiRequest from "./util/strapiRequest";
import StrapifyParse from "./StrapifyParse";
import ErrorHandler from "./StrapifyErrors";

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
		"strapi-single-type-repeatable": undefined,
		"strapi-single-type-background-image": undefined
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

		if (split.length < 2) {
			ErrorHandler.error(`Invalid strapi-single-type argument: "${argument}". Must be in the format "singleTypeName.fieldName"`);
		}

		const singleTypeName = split[0];
		const singleTypeField = split.slice(1).join(".");

		return { singleTypeName, singleTypeField };
	}

	async #processStrapiSingleTypeClassAdd() {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type-class-add"], {
			attributeName: "strapi-single-type-class-add",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: "",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "strapi_single_type_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE,
					substituteQueryStringVariables: true
				}
			]
		})

		for (let i = 0; i < args.length; i++) {
			const arg = args[i].value;

			const splitArg = this.#splitSingleTypeNameFromArgument(arg);
			const singleTypeName = splitArg.singleTypeName;
			const singleTypeField = splitArg.singleTypeField;

			const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*");

			const className = Strapify.getStrapiComponentValue(singleTypeField, strapiData.data.attributes);
			this.#singleTypeElement.classList.add(className);
			this.#managedClasses.push({ state: "added", name: className });
		}
	}

	async #processStrapiSingleTypeClassReplace() {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type-class-replace"], {
			attributeName: "strapi-single-type-class-replace",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: ",",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "existing_class_name",
					type: StrapifyParse.SUB_ARG_TYPE.STRING,
					substituteQueryStringVariables: false
				},
				{
					name: "strapi_single_type_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE,
					substituteQueryStringVariables: true
				}
			]
		})

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const oldClassName = arg.subArgs[1].value;
			const newClassFieldName = arg.subArgs[0].value;

			const splitArg = this.#splitSingleTypeNameFromArgument(newClassFieldName);
			const singleTypeName = splitArg.singleTypeName;
			const singleTypeField = splitArg.singleTypeField;

			const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*");

			const className = Strapify.getStrapiComponentValue(singleTypeField, strapiData.data.attributes);

			this.#singleTypeElement.classList.remove(oldClassName);
			this.#singleTypeElement.classList.add(className);
			this.#managedClasses.push({ state: "removed", name: oldClassName });
			this.#managedClasses.push({ state: "added", name: className });
		}
	}

	async #processStrapiSingleTypeConditionalClass() {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type-class-conditional"], {
			attributeName: "strapi-single-type-class-conditional",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: ",",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "condition",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE_CONDITION,
					substituteQueryStringVariables: false
				},
				{
					name: "strapi_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE,
					substituteQueryStringVariables: true
				}
			]
		})

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const conditionString = arg.subArgs[0].value;
			const className = arg.subArgs[1].value;

			const parsedConditionData = Strapify.parseCondition(conditionString).result;
			const conditionSatisfied = await Strapify.checkConditionSingleType(parsedConditionData);

			if (conditionSatisfied) {
				this.#singleTypeElement.classList.add(className);
				this.#managedClasses.push({ state: "added", name: className });
			}
		}
	}

	async #processStrapiSingleType() {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type"], {
			attributeName: "strapi-single-type",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: "",
			multipleArguments: false,
			subArgumentDetails: [
				{
					name: "strapi_single_type_field_name",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE,
					substituteQueryStringVariables: true
				}
			]
		})

		const newClassFieldName = args[0].subArgs[0].value;

		const split = this.#splitSingleTypeNameFromArgument(newClassFieldName);
		const singleTypeName = split.singleTypeName;
		const singleTypeFieldArg = split.singleTypeField;

		const strapiData = await strapiRequest("/api/" + singleTypeName, `?populate=${singleTypeFieldArg}`);

		if (!strapiData.data.attributes[singleTypeFieldArg.split(".")[0]] && typeof !strapiData.data.attributes[singleTypeFieldArg.split(".")[0]] !== "boolean") {
			ErrorHandler.error(`Single type attribute "${singleTypeName}.${singleTypeFieldArg}" is invalid. The field "${singleTypeFieldArg}" does not exist on the single type "${singleTypeName}".`);
		}

		const fieldValue = Strapify.getStrapiComponentValue(singleTypeFieldArg, strapiData.data.attributes)

		Strapify.modifyElmWithStrapiData(fieldValue, this.#singleTypeElement);
	}

	async #processStrapiSingleTypeCSSRule() {
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type-css-rule"], {
			attributeName: "strapi-single-type-css-rule",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: "",
			multipleArguments: true,
			subArgumentDetails: [
				{
					name: "css_rule_template",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE,
					substituteQueryStringVariables: true
				}
			]
		})

		let strapiData = null;

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			const templateString = arg.subArgs[0].value;
			const htmlAttributeName = "style"

			//strapi variables are wrapped in double curly braces
			const regex = /{{(.*?)}}/g;

			//get all strapi variables in arg and replace with value from getStrapiComponentValue
			const matches = templateString.match(regex);

			//if no matches, then no strapi variables in arg
			if (!matches) {
				const templateStringSplit = this.#splitSingleTypeNameFromArgument(templateString)
				const singleTypeName = templateStringSplit.singleTypeName;
				let singleTypeFieldString = templateStringSplit.singleTypeField;

				if (!strapiData) {
					strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
				}

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
		}
	}

	async #processStrapiSingleTypeInto() {
		const attributeValue = this.#attributes["strapi-single-type-into"]
		const args = attributeValue.split("|").map(arg => arg.trim());

		let strapiData = null;


		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

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
		}
	}

	async #processStrapiBackgroundImage() {
		console.log("hello")
		const args = StrapifyParse.parseAttribute(this.#attributes["strapi-single-type-background-image"], {
			attributeName: "strapi-single-type-background-image",
			htmlElement: this.#singleTypeElement,
			subArgumentDeliminator: "",
			multipleArguments: false,
			subArgumentDetails: [
				{
					name: "background_image_url",
					type: StrapifyParse.SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE,
					substituteQueryStringVariables: true
				}
			]
		})

		const templateString = args[0].value;
		const templateStringSplit = this.#splitSingleTypeNameFromArgument(templateString)
		const singleTypeName = templateStringSplit.singleTypeName;
		let singleTypeFieldString = templateStringSplit.singleTypeField;

		const strapiData = await strapiRequest("/api/" + singleTypeName, `?populate=${singleTypeFieldString}`);
		const fieldValue = Strapify.getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes)

		const url = fieldValue.data.attributes.url;

		 this.#singleTypeElement.style.backgroundImage = `url(${Strapify.apiURL}${url})`;
		 this.#singleTypeElement.style.backgroundSize = "cover";
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

		if (this.#attributes["strapi-single-type-class-conditional"]) {
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

		if (this.#attributes["strapi-single-type-background-image"]) {
			await this.#processStrapiBackgroundImage();
		}

		//remove strapify-hide class
		this.#singleTypeElement.classList.remove("strapify-hide");
	}
}

export default StrapifySingleType;