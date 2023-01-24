import Strapify from "./Strapify"
import StrapifyRelation from "./StrapifyRelation"
import StrapifyRepeatable from "./StrapifyRepeatable";
import strapiRequest from "./util/strapiRequest";

class StrapifySingleType {
	#singleTypeElement;
	#mutationObserver;

	#attributes = {
		"strapi-single-type": undefined,
		"strapi-single-type-into": undefined,
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

		if(this.#attributes["strapi-single-type-css-rule"]) {
			await this.#processStrapiSingleTypeCSSRule();
		}

		if (this.#attributes["strapi-single-type-repeatable"]) {
			const splitSingleTypeArg = this.#attributes["strapi-single-type-repeatable"].split(".");
			const _singleTypeName = splitSingleTypeArg[0];
			const strapiData = await strapiRequest("/api/" + _singleTypeName, "?populate=*")

			const strapifyRepeatable = new StrapifyRepeatable(this.#singleTypeElement, strapiData.data.id, strapiData.data.attributes)

			strapifyRepeatable.process()
		}

		if (this.#attributes["strapi-single-type-relation"]) {
			const splitSingleTypeArg = this.#attributes["strapi-single-type-relation"].split(".");
			const _singleTypeName = splitSingleTypeArg[0];
			const strapiData = await strapiRequest("/api/" + _singleTypeName, "?populate=*")

			//console.log(strapiData)

			const strapifyRelation = new StrapifyRelation(this.#singleTypeElement, strapiData.data.id, strapiData.data.attributes)

			strapifyRelation.process()
		}
	}
}

export default StrapifySingleType;