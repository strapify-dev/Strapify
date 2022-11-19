import Strapify from "./Strapify"
import strapiRequest from "./util/strapiRequest";

class StrapifySingleType {
	#singleTypeElement;
	#mutationObserver;

	#attributes = {
		"strapi-single-type": undefined,
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

	async process() {
		const attributeValue = this.#attributes["strapi-single-type"]

		const split = attributeValue.split(".");
		const singleTypeName = split[0];
		const singleTypeFieldName = split[1];

		const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
		const fieldValue = strapiData.data.attributes[singleTypeFieldName];

		Strapify.modifyElmWithStrapiData(fieldValue, this.#singleTypeElement);
	}
}

export default StrapifySingleType;