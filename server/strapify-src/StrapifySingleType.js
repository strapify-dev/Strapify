import Strapify from "./Strapify"
import strapiRequest from "./util/strapiRequest";

class StrapifySingleType {
	#singleTypeElement;
	#mutationObserver;

	#attributes = {
		"strapi-single-type": undefined,
		"strapi-single-type-into": undefined
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
		const attributeValue = this.#attributes["strapi-single-type"]

		const split = attributeValue.split(".");
		const singleTypeName = split[0];
		const singleTypeFieldName = split[1];

		const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
		const fieldValue = strapiData.data.attributes[singleTypeFieldName];

		Strapify.modifyElmWithStrapiData(fieldValue, this.#singleTypeElement);
	}

	async #processStrapiSingleTypeInto() {
		const attributeValue = this.#attributes["strapi-single-type-into"]
		const args = attributeValue.split("|");

		let strapiData = null;

		await args.forEach(async (arg) => {
			const splitInto = arg.split("->").map((arg) => arg.trim());
			const singleTypeArg = splitInto[0];
			const intoAttribute = splitInto[1];

			const splitSingleTypeArg = singleTypeArg.split(".");
			const _singleTypeName = splitSingleTypeArg[0];
			const singleTypeFieldName = splitSingleTypeArg[1];

			if (!strapiData) {
				strapiData = await strapiRequest("/api/" + _singleTypeName, "?populate=*")
			}

			this.#singleTypeElement.setAttribute(intoAttribute, strapiData.data.attributes[singleTypeFieldName]);
		})
	}

	async process() {
		if (this.#attributes["strapi-single-type"]) {
			await this.#processStrapiSingleType();
		}

		if (this.#attributes["strapi-single-type-into"]) {
			await this.#processStrapiSingleTypeInto();
		}
	}
}

export default StrapifySingleType;