import Strapify from "./Strapify";
import { strapiRegister, strapiAuthenticate } from "./util/strapiRequest";

class StrapifyForm {
	#formElement;
	#mutationObserver;

	#formInputElms;
	#formSubmitElm;

	#attributes = {
		"strapi-form": undefined,
		"strapi-auth": undefined,
	}

	constructor(formElement) {
		this.#formElement = formElement;
		this.#updateAttributes();

		// 	this.#mutationObserver = new MutationObserver((mutations) => {
		// 		mutations.forEach((mutation) => {
		// 			if (mutation.type === "attributes") {
		// 				this.#updateAttributes();
		// 				this.process();
		// 			}
		// 		});
		// 	});

		// 	this.#mutationObserver.observe(this.#singleTypeElement, {
		// 		attributes: true,
		// 		attributeFilter: ["strapi-single-type"]
		// 	});

		this.#formInputElms = Strapify.findFormInputElms(this.#formElement);
		this.#formSubmitElm = Strapify.findFormSubmitElms(this.#formElement)[0];
	}

	destroy() {
		this.#mutationObserver.disconnect();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#formElement.getAttribute(attribute);
		})
	}

	#getFormData() {
		const formData = {};

		this.#formInputElms.forEach((inputElm) => {
			let name = inputElm.getAttribute("strapi-form-input");
			if (!name) {
				name = inputElm.getAttribute("strapi-auth-input");
			}

			formData[name] = inputElm.value;
		})

		return formData;
	}

	async #onAuthSubmit(e) {
		const formData = this.#getFormData()

		if (this.#attributes["strapi-auth"] === "register") {
			const responseData = await strapiRegister(formData.username, formData.email, formData.password);
			localStorage.setItem("jwt", responseData.jwt);
			localStorage.setItem("user", JSON.stringify(responseData.user));
		} else if (this.#attributes["strapi-auth"] === "authenticate") {
			const responseData = await strapiAuthenticate(formData.identifier, formData.password);
			localStorage.setItem("jwt", responseData.jwt);
			localStorage.setItem("user", JSON.stringify(responseData.user));
		}
	}

	async #processForm() {

	}

	async #processAuth() {
		//remove any existing event listeners
		this.#formSubmitElm.removeEventListener("click", this.#onAuthSubmit.bind(this));
		this.#formSubmitElm.addEventListener("click", this.#onAuthSubmit.bind(this));
	}

	async process() {
		if (this.#attributes["strapi-form"]) {
			await this.#processForm();
		}

		if (this.#attributes["strapi-auth"]) {
			await this.#processAuth();
		}
	}
}

export default StrapifyForm;