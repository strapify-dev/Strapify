import Strapify from "./Strapify.js";
import StrapifyCollection from "./StrapifyCollection.js";
import StrapifyField from "./StrapifyField";
import strapiRequest from "./util/strapiRequest";

class StrapifyTemplate {
	#relationElement;
	#strapifyCollection;
	#mutationObserver;

	#strapiDataId;
	#strapiDataAttributes;

	#attributes = {
		"strapi-relation": undefined,
		"strapi-single-type-relation": undefined,
	}

	constructor(relationElement, strapiDataId, strapiDataAttributes) {
		//set the collection element and update the attributes
		this.#relationElement = relationElement;
		this.#strapiDataId = strapiDataId;
		this.#strapiDataAttributes = strapiDataAttributes;
		this.#updateAttributes();

		//create mutation observer to watch for attribute changes
		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes") {
					this.#updateAttributes();
					this.process();
				}
			});
		});

		//observe the collection element for attribute changes
		this.#mutationObserver.observe(this.#relationElement, {
			attributes: true,
			attributeFilter: ["strapi-relation"]
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

	async process() {
		const relationElement = this.#relationElement;

		if (this.#strapifyCollection) {
			this.#strapifyCollection.destroy()
		}

		const strapiDataId = this.#strapiDataId;
		const strapiDataAttributes = this.#strapiDataAttributes;

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
			filterString = relationData.map(relation => `[id][$eq]=${relation.id}`).join(" | ");
		} else {
			filterString = `[id][$eq]=${relationData.id}`;
		}

		//when the filter string is empty, change it to filter for a non-existent id
		if (!filterString) {
			filterString = "[id][$eq]=-1";
		}

		//add the filter string to the relation element
		relationElement.setAttribute("strapi-filter", filterString);

		//create a strapify collection with the relationelement
		this.#strapifyCollection = new StrapifyCollection(relationElement);
		await this.#strapifyCollection.process()

	}
}

export default StrapifyTemplate;