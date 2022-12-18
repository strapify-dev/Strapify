import Strapify from "./Strapify";
import { strapiEZFormsSubmit } from "./util/strapiRequest";

class StrapifyEZFormsForm {
	#formContainerElm;
	#formElm;
	#formSubmitElm;
	#state = "initial";
	#stateElms;

	#attributes = {
		"strapi-ezforms-form": undefined,
		"strapi-success-redirect": undefined,
		"strapi-error-redirect": undefined,
		"strapi-hide-on-success": undefined,
		"strapi-hide-on-error": undefined,
	}

	constructor(formContainerElement) {
		this.#formContainerElm = formContainerElement;
		this.#updateAttributes();

		//check if the formContainerElm is a form element
		if (this.#formContainerElm.tagName === "FORM") {
			this.#formElm = this.#formContainerElm;
		} else {
			//find the child form which is closest to the formContainerElm
			this.#formElm = this.#formContainerElm.querySelector("form");
		}

		this.#stateElms = Strapify.findStateElements(this.#formContainerElm);
		this.#reflectState();

		this.#formSubmitElm = Strapify.findEZFormSubmitElms(this.#formContainerElm)[0];
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#formContainerElm.getAttribute(attribute);
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
		const ezFormsElm = this.#formElm;
		const submitElm = this.#formSubmitElm;

		submitElm.addEventListener("click", (event) => {
			event.preventDefault();

			this.#state = "loading";
			this.#reflectState();

			strapiEZFormsSubmit(ezFormsElm).then((data) => {
				this.#state = "success";
				this.#reflectState();

				//dispatch a custom event with the data
				this.#formContainerElm.dispatchEvent(new CustomEvent("strapiEZFormsSubmitted", {
					bubbles: false,
					detail: {
						data: data
					}
				}));

				if(this.#attributes["strapi-hide-on-success"] !== null && this.#attributes["strapi-hide-on-success"] !== undefined) {
					this.#formContainerElm.classList.add("strapify-hide");
				}

				if (this.#attributes["strapi-success-redirect"]) {
					window.location.href = this.#attributes["strapi-success-redirect"];
				}
			}).catch((error) => {
				this.#state = "error";
				this.#reflectState();

				//dispatch a custom event with the error
				this.#formContainerElm.dispatchEvent(new CustomEvent("strapiEZFormsError", {
					bubbles: false,
					detail: {
						error: error
					}
				}));

				if(this.#attributes["strapi-hide-on-error"] !== null && this.#attributes["strapi-hide-on-error"] !== undefined) {
					this.#formContainerElm.classList.add("strapify-hide");
				}

				if (this.#attributes["strapi-error-redirect"]) {
					window.location.href = this.#attributes["strapi-error-redirect"];
				}
			});
		});
	}
}

export default StrapifyEZFormsForm;