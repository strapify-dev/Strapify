import Strapify from "./Strapify.js";
import StrapifyCollection from "./StrapifyCollection.js";
import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";

class StrapifyTemplate {
	#relationElement;
	#strapifyCollection;
	#mutationObserver;

	#attributes = {
		"strapi-relation": undefined,
	}

	constructor(relationElement) {
		//set the collection element and update the attributes
		this.#relationElement = relationElement;
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
		this.#mutationObserver.observe(this.#relationElement, {
			attributes: true,
			attributeFilter: ["strapi-relation", ...Strapify.validStrapifyCollectionAttributes]
		});
	}

	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyCollection.destroy();
		this.#relationElement.remove();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#relationElement.getAttribute(attribute);
		})
	}

	async process(strapiDataId, strapiDataAttributes) {
		const relationElement = this.#relationElement;

		//use the relation ids to generate a filter string
		const relationArgs = this.#attributes["strapi-relation"].split(",").map(arg => arg.trim());
		const relationFieldName = relationArgs[0];
		const relationCollectionName = relationArgs[1];

		const relationData = strapiDataAttributes[relationFieldName].data;
		let filterString
		if (Array.isArray(relationData)) {
			filterString = relationData.map(relation => `[id]=${relation.id}`).join(" | ");
		} else {
			filterString = `[id]=${relationData.id}`;
		}

		//add the filter string to the relation element
		relationElement.setAttribute("strapi-collection-filter", filterString);

		//create a strapify collection with the relationelement
		this.#strapifyCollection = new StrapifyCollection(relationElement);
		await this.#strapifyCollection.process()
	}
}

export default StrapifyTemplate;