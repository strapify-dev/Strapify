import Strapify from "./Strapify.js";
import StrapifyRelation from "./StrapifyRelation.js";
import StrapifyField from "./StrapifyField";
import StrapifyRepeatable from "./StrapifyRepeatable.js";

class StrapifyTemplate {
	//the template element this class manages
	#templateElement;

	//the strapi data id and attributes
	#strapiDataId
	#strapiDataAttributes

	//the strapify field, relation, and repeatable objects which belong to this template
	#strapifyFields = [];
	#strapifyRelations = [];
	#strapifyRepeatables = [];

	//the allowed attributes for the template element
	#attributes = {
		"strapi-template": undefined,
		"strapi-template-conditional": undefined
	}

	constructor(templateElement, strapiDataId, strapiDataAttributes, strapifyCollection) {
		this.#templateElement = templateElement;
		this.#strapiDataId = strapiDataId;
		this.#strapiDataAttributes = strapiDataAttributes;
		this.#updateAttributes();
	}

	//destroy all descendant strapify objects and delete the template element
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

	async process() {
		//find strapify field elements, instatiate strapify field objects, and process them
		const strapifyFieldElements = Strapify.findFieldElms(this.#templateElement);
		strapifyFieldElements.forEach(fieldElement => {
			const strapifyField = new StrapifyField(fieldElement)
			this.#strapifyFields.push(strapifyField);

			strapifyField.process(this.#strapiDataAttributes)
		});

		//find strapify repeatable elements, instatiate strapify repeatable objects, and process them
		const strapifyRepeatableElements = Strapify.findRepeatableElms(this.#templateElement);
		strapifyRepeatableElements.forEach(repeatableElement => {
			const strapifyRepeatable = new StrapifyRepeatable(repeatableElement, this.#strapiDataId, this.#strapiDataAttributes)
			this.#strapifyRepeatables.push(strapifyRepeatable);

			strapifyRepeatable.process()
		});

		//find strapify relation elements, instatiate strapify relation objects, and process them
		const strapifyRelationElements = Strapify.findRelationElms(this.#templateElement);
		strapifyRelationElements.forEach(relationElement => {
			const strapifyRelation = new StrapifyRelation(relationElement, this.#strapiDataId, this.#strapiDataAttributes)
			this.#strapifyRelations.push(strapifyRelation);

			strapifyRelation.process()
		})
	}
}

export default StrapifyTemplate;