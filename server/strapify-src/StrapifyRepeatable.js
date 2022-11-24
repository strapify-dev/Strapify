import Strapify from "./Strapify.js";
import StrapifyCollection from "./StrapifyCollection.js";
import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";

class StrapifyRepeatable {
	#repeatableElement;
	#strapifyCollection;
	#strapiDataId;
	#strapiDataAttributes
	#mutationObserver;

	#attributes = {
		"strapi-repeatable": undefined,
	}

	constructor(repeatableElement, strapiDataId, strapiDataAttributes) {
		//set the collection element and update the attributes
		this.#repeatableElement = repeatableElement;
		this.#strapiDataId = strapiDataId;
		this.#strapiDataAttributes = strapiDataAttributes;
		this.#updateAttributes();

		//create mutation observer to watch for attribute changes
		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					//this.#updateAttributes();
					//this.process();
				}
			});
		});

		//observe the collection element for attribute changes
		this.#mutationObserver.observe(this.#repeatableElement, {
			attributes: true,
			attributeFilter: ["strapi-relation", ...Strapify.validStrapifyCollectionAttributes]
		});
	}

	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyCollection.destroy();
		this.#repeatableElement.remove();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#repeatableElement.getAttribute(attribute);
		})
	}

	async process() {
		const fieldName = this.#attributes["strapi-repeatable"];
		const repeatableElement = this.#repeatableElement;

		//create a fake collection to pass to a new StrapifyCollection
		const overrideData = {
			data: this.#strapiDataAttributes[fieldName].data.map((fieldData) => {
				return { attributes: { [fieldName]: { data: fieldData } } }
			}),
			meta: {}
		}

		const strapifyCollection = new StrapifyCollection(repeatableElement, overrideData);
		this.#strapifyCollection = strapifyCollection;

		await strapifyCollection.process()
	}
}

export default StrapifyRepeatable;