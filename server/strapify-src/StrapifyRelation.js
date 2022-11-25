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
		"strapi-single-type-relation": undefined,
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
			attributeFilter: ["strapi-relation", "strapi-single-type-relation", ...Strapify.validStrapifyCollectionAttributes]
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
		let relationArgs
		let relationFieldName
		let relationCollectionName
		if (this.#attributes["strapi-relation"]) {
			relationArgs = this.#attributes["strapi-relation"].split(",").map(arg => arg.trim());
			relationFieldName = relationArgs[0];
			relationCollectionName = relationArgs[1];
		}
		else if (this.#attributes["strapi-single-type-relation"]) {
			relationArgs = this.#attributes["strapi-single-type-relation"].split(",").map(arg => arg.trim());
			relationFieldName = relationArgs[0].split(".")[1];
			relationCollectionName = relationArgs[1];
		}

		const relationData = Strapify.getStrapiComponentValue(relationFieldName, strapiDataAttributes).data;
		let filterString
		if (Array.isArray(relationData)) {
			filterString = relationData.map(relation => `[id]=${relation.id}`).join(" | ");
		} else {
			filterString = `[id]=${relationData.id}`;
		}

		//when the filter string is empty, change it to filter for a non-existent id
		if (!filterString) {
			filterString = "[id]=-1";
		}

		//add the filter string to the relation element
		relationElement.setAttribute("strapi-collection-filter", filterString);

		//create a strapify collection with the relationelement
		this.#strapifyCollection = new StrapifyCollection(relationElement);
		await this.#strapifyCollection.process()

	}
}

export default StrapifyTemplate;