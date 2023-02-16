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
		"strapi-single-type-repeatable": undefined,
	}

	constructor(repeatableElement, strapiDataId, strapiDataAttributes) {
		//set the collection element and update the attributes
		this.#repeatableElement = repeatableElement;
		this.#strapiDataId = strapiDataId;
		this.#strapiDataAttributes = strapiDataAttributes;
		this.#updateAttributes();

		//create mutation observer to watch for attribute changes
		// this.#mutationObserver = new MutationObserver((mutations) => {
		// 	mutations.forEach((mutation) => {
		// 		if (mutation.type === "attributes") {
		// 			//this.#strapifyCollection.destroy();
		// 			//this.#updateAttributes();
		// 			//this.process();
		// 		}
		// 	});
		// });

		// //observe the collection element for attribute changes
		// this.#mutationObserver.observe(this.#repeatableElement, {
		// 	attributes: true,
		// 	attributeFilter: ["strapi-repeatable", "strapi-single-type-repeatable", "strapi-page", "strapi-page-size"]
		// });
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

	getOverrideData() {
		const fieldName = this.#attributes["strapi-repeatable"] ? this.#attributes["strapi-repeatable"] : this.#attributes["strapi-single-type-repeatable"].split(".")[1];

		//when the data field is null (explicitly not undefined), we have an empty media field
		//StrapifyCollection will delete the element if the data is null
		if (this.#strapiDataAttributes[fieldName].data === null) {
			Strapify.findTemplateElms(this.#repeatableElement).forEach((collectionElm) => {
				collectionElm.remove();
			})
			return null;
		}

		//if data is not null or undefined, we have a media field
		let overrideData
		if (this.#strapiDataAttributes[fieldName].data) {
			overrideData = {
				data: this.#strapiDataAttributes[fieldName].data.map((fieldData) => {
					return { attributes: { [fieldName]: { data: fieldData } } }
				}),
				meta: {}
			}
		}
		//otherwise we must have a component field
		else {
			overrideData = {
				data: this.#strapiDataAttributes[fieldName].map((fieldData) => {
					return { attributes: { [fieldName]: fieldData } }
				}),
				meta: {}
			}
		}

		//need to manually paginate since strapi doesn't support pagination on repeatable fields
		const pageSize = parseInt(this.#repeatableElement.getAttribute("strapi-page-size")) || 25;
		const page = parseInt(this.#repeatableElement.getAttribute("strapi-page")) || 1;
		const pageCount = Math.ceil(overrideData.data.length / pageSize);
		const total = overrideData.data.length;

		//split override data into pages
		const pagedOverrideData = [];
		for (let i = 0; i < overrideData.data.length; i += pageSize) {
			pagedOverrideData.push(overrideData.data.slice(i, i + pageSize));
		}

		//replace the data with the page we want
		overrideData.data = pagedOverrideData[page - 1];

		//update the meta
		overrideData.meta.pagination = {
			page,
			pageSize,
			pageCount,
			total
		}

		return overrideData;
	}

	async process() {
		const repeatableElement = this.#repeatableElement;

		//why on earth do I need to bind this to the function?
		const strapifyCollection = new StrapifyCollection(repeatableElement, this.getOverrideData.bind(this));
		this.#strapifyCollection = strapifyCollection;

		await strapifyCollection.process()
	}
}

export default StrapifyRepeatable;