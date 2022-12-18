import Strapify from "./Strapify";
import { strapiEZFormsSubmit } from "./util/strapiRequest";

class StrapifyEZFormsForm {
	#formElement;
	#formSubmitElm;
	#state = "initial";
	#stateElms;

	#attributes = {
		"strapi-ezforms-form": undefined,
		"strapi-success-redirect": undefined,
		"strapi-error-redirect": undefined,
	}

	constructor(formElement) {
		this.#formElement = formElement;
		this.#updateAttributes();

		this.#stateElms = Strapify.findStateElements(this.#formElement);
		console.log(this.#stateElms);
		this.#reflectState();

		this.#formSubmitElm = Strapify.findEZFormSubmitElms(this.#formElement)[0];
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#formElement.getAttribute(attribute);
		})
	}

	#reflectState() {
		this.#stateElms.forEach(stateElm => {
			const stateKey = stateElm.getAttribute("strapi-state-element");

			if (stateKey === this.#state) {
				stateElm.classList.remove("strapify-hide");
			} else {
				stateElm.classList.add("strapify-hide");
			}
		});
	}

	async process() {
		const ezFormsElm = this.#formElement;
		const submitElm = this.#formSubmitElm;

		submitElm.addEventListener("click", (event) => {
			event.preventDefault();

			this.#state = "loading";
			this.#reflectState();

			strapiEZFormsSubmit(ezFormsElm).then((data) => {
				this.#state = "success";
				this.#reflectState();

				//dispatch a custom event with the data
				this.#formElement.dispatchEvent(new CustomEvent("strapiEZFormsSubmitted", {
					bubbles: false,
					detail: {
						data: data
					}
				}));

				if (this.#attributes["strapi-success-redirect"]) {
					window.location.href = this.#attributes["strapi-success-redirect"];
				}
			}).catch((error) => {
				this.#state = "error";
				this.#reflectState();

				//dispatch a custom event with the error
				this.#formElement.dispatchEvent(new CustomEvent("strapiEZFormsError", {
					bubbles: false,
					detail: {
						error: error
					}
				}));

				if (this.#attributes["strapi-error-redirect"]) {
					window.location.href = this.#attributes["strapi-error-redirect"];
				}
			});
		});
	}
}

export default StrapifyEZFormsForm;