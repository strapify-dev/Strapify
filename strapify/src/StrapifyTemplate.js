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
		this.#addIds();
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

	#addIds() {
		if (this.#strapiDataId) {
			this.#templateElement.setAttribute("strapi-template-id", this.#strapiDataId);
		}
	};

	async process() {
		//find strapify field elements, instatiate strapify field objects, and process them
		const strapifyFieldElements = Strapify.findFieldElms(this.#templateElement);
		strapifyFieldElements.forEach(fieldElement => {
			const strapifyField = new StrapifyField(fieldElement)
			this.#strapifyFields.push(strapifyField);

			strapifyField.process(this.#strapiDataAttributes)
		});

		const processPromises = [];

		//find strapify repeatable elements, instatiate strapify repeatable objects, and process them
		const strapifyRepeatableElements = Strapify.findRepeatableElms(this.#templateElement);
		for (const repeatableElement of strapifyRepeatableElements) {
			const strapifyRepeatable = new StrapifyRepeatable(repeatableElement, this.#strapiDataId, this.#strapiDataAttributes)
			this.#strapifyRepeatables.push(strapifyRepeatable);

			processPromises.push(strapifyRepeatable.process())
		}

		//find strapify relation elements, instatiate strapify relation objects, and process them
		const strapifyRelationElements = Strapify.findRelationElms(this.#templateElement);
		strapifyRelationElements.forEach(relationElement => {
			const strapifyRelation = new StrapifyRelation(relationElement, this.#strapiDataId, this.#strapiDataAttributes)
			this.#strapifyRelations.push(strapifyRelation);

			processPromises.push(strapifyRelation.process())
		})

		//wait for all strapify objects to process
		await Promise.allSettled(processPromises);

		//remove strapify-hide class from template element
		this.#templateElement.classList.remove("strapify-hide");
	}
}

export default StrapifyTemplate;