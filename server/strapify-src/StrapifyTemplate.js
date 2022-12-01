import Strapify from "./Strapify.js";
import StrapifyRelation from "./StrapifyRelation.js";
import StrapifyField from "./StrapifyField";
import StrapifyRepeatable from "./StrapifyRepeatable.js";

class StrapifyTemplate {
	#templateElement;
	#strapiDataId
	#strapiDataAttributes
	#strapifyFields = [];
	#strapifyRelations = [];
	#strapifyRepeatables = [];

	#attributes = {
		"strapi-template": undefined,
	}

	constructor(templateElement, strapiDataId, strapiDataAttributes, strapifyCollection) {
		//set the collection element and update the attributes
		this.#templateElement = templateElement;
		this.#strapiDataId = strapiDataId;
		this.#strapiDataAttributes = strapiDataAttributes;
		this.#updateAttributes();
	}

	destroy() {
		this.#strapifyFields.forEach(field => field.destroy());
		this.#strapifyRelations.forEach(relation => relation.destroy());
		this.#strapifyRepeatables.forEach(repeatable => repeatable.destroy());
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