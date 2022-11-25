import Strapify from "./Strapify.js";
import StrapifyCollection from "./StrapifyCollection.js";
import StrapifyRelation from "./StrapifyRelation.js";
import StrapifyField from "./StrapifyField";
import StrapifyRepeatable from "./StrapifyRepeatable.js";
import strapiRequest from "./util/strapiRequest";

class StrapifyTemplate {
	#templateElement;
	#strapiDataId
	#strapiDataAttributes
	#strapifyFields = [];
	#strapifyRelations = [];
	#strapifyRepeatables = [];
	#mutationObserver;

	#attributes = {
		"strapi-template": undefined,
	}

	constructor(templateElement, strapiDataId, strapiDataAttributes) {
		//set the collection element and update the attributes
		this.#templateElement = templateElement;
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
		this.#mutationObserver.observe(this.#templateElement, {
			attributes: true,
			attributeFilter: ["strapi-template"]
		});
	}

	destroy() {
		this.#mutationObserver.disconnect();
		this.#strapifyFields.forEach(field => field.destroy());
		this.#strapifyRelations.forEach(relation => relation.destroy());
		this.#templateElement.remove();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#templateElement.getAttribute(attribute);
		})
	}

	process() {
		const strapiDataId = this.#strapiDataId;
		const strapiDataAttributes = this.#strapiDataAttributes;

		//find strapify field elements 
		const strapifyFieldElements = Strapify.findFieldElms(this.#templateElement);
		strapifyFieldElements.forEach(fieldElement => {
			const strapifyField = new StrapifyField(fieldElement)
			this.#strapifyFields.push(strapifyField);

			strapifyField.process(strapiDataAttributes)
		});

		//find strapify repeatable elements and process them
		const strapifyRepeatableElements = Strapify.findRepeatableElms(this.#templateElement);
		strapifyRepeatableElements.forEach(repeatableElement => {
			const strapifyRepeatable = new StrapifyRepeatable(repeatableElement, strapiDataId, strapiDataAttributes)
			this.#strapifyRepeatables.push(strapifyRepeatable);

			strapifyRepeatable.process()
		});

		//find strapify relation elements and process them
		const strapifyRelationElements = Strapify.findRelationElms(this.#templateElement);
		strapifyRelationElements.forEach(relationElement => {
			const strapifyRelation = new StrapifyRelation(relationElement)
			this.#strapifyRelations.push(strapifyRelation);

			strapifyRelation.process(strapiDataId, strapiDataAttributes)
		})
	}
}

export default StrapifyTemplate;