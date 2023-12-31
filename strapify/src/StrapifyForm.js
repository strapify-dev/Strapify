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
		"strapi-success-redirect": undefined,
		"strapi-error-redirect": undefined,
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

		// set any strapi-auth forms to return false on submit
		if (this.#attributes["strapi-auth"]) {
			this.#formElement.addEventListener("submit", (e) => {
				e.preventDefault();
				return false;
			});
		}

		// this.#formElement.addEventListener("strapiAuthRegistered", (event) => {
		// 	console.log(event);
		// });

		// this.#formElement.addEventListener("strapiAuthLoggedIn", (event) => {
		// 	console.log(event);
		// });
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
			
			// split input value by | separator, with optional whitespace (e.g. "username | email")
			const names = name.split(/\s*\|\s*/);
			names.forEach((name) => {
				name = name.trim();
				formData[name] = inputElm.value;
			})
			
		})

		return formData;
	}

	async #onAuthSubmit(e) {
		const formData = this.#getFormData()

		if (this.#attributes["strapi-auth"] === "register") {
			try {
				const responseData = await strapiRegister(formData);

				localStorage.setItem("jwt", responseData.jwt);
				localStorage.setItem("user", JSON.stringify(responseData.user));

				//dispatch custom event with registered user data
				this.#formElement.dispatchEvent(new CustomEvent("strapiAuthRegistered", {
					bubbles: false,
					detail: {
						user: responseData.user
					}
				}));

				if(this.#attributes["strapi-success-redirect"]) {
					window.location.href = this.#attributes["strapi-success-redirect"];
				}
			} catch (error) {
				//dispatch custom event with error
				this.#formElement.dispatchEvent(new CustomEvent("strapiAuthRegisterError", {
					bubbles: false,
					detail: {
						error: error,
						errorMessage: error.response.data.error.message
					}
				}));

				if(this.#attributes["strapi-error-redirect"]) {
					window.location.href = this.#attributes["strapi-error-redirect"];
				}

				console.error(error);
				console.error(error.response.data.error.message);
			}


		} else if (this.#attributes["strapi-auth"] === "authenticate") {
			try {
				const responseData = await strapiAuthenticate(formData.identifier, formData.password);
				localStorage.setItem("jwt", responseData.jwt);
				localStorage.setItem("user", JSON.stringify(responseData.user));

				//dispatch custom event with authenticated user data
				this.#formElement.dispatchEvent(new CustomEvent("strapiAuthLoggedIn", {
					bubbles: false,
					detail: {
						user: responseData.user
					}
				}));

				if(this.#attributes["strapi-success-redirect"]) {
					window.location.href = this.#attributes["strapi-success-redirect"];
				}
			} catch (error) {
				//dispatch custom event with error
				this.#formElement.dispatchEvent(new CustomEvent("strapiAuthLogInError", {
					bubbles: false,
					detail: {
						error: error,
						errorMessage: error.response.data.error.message
					}
				}));

				if(this.#attributes["strapi-error-redirect"]) {
					window.location.href = this.#attributes["strapi-error-redirect"];
				}

				console.error(error);
				console.error(error.response.data.error.message);
			}

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