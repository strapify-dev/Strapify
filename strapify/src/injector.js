import StrapifyCollection from "./StrapifyCollection"
import StrapifySingleType from "./StrapifySingleType";
import StrapifyForm from "./StrapifyForm";
import StrapifyEZFormsForm from "./StrapifyEZFormsForm";
import Strapify from "./Strapify";
import { strapiRequest, strapiEZFormsSubmit } from "./util/strapiRequest";

const version = "0.0.1";
const debugMode = Strapify.debugMode;

const hiddenTemplateElms = [];
const hiddenSingleTypeElms = [];

//wait for content to load and scripts to execute
document.addEventListener("DOMContentLoaded", () => {
	if (debugMode) {
		//log the version
		console.log(`running strapify version ${version}`);
	}

	//create a class called strapify-hide and insert it into the head
	const strapifyHideStyle = document.createElement("style");
	strapifyHideStyle.innerHTML = ".strapify-hide { display: none !important; }";
	document.head.appendChild(strapifyHideStyle);

	//do a preparse for any template elms and hide them
	const templateElms = document.querySelectorAll("[strapi-template]");
	templateElms.forEach((templateElm) => {
		templateElm.classList.add("strapify-hide");
		hiddenTemplateElms.push(templateElm);
	});

	//do a preparse for any single type elms and hide them
	const singleTypeElms = document.querySelectorAll("[strapi-single-type]");
	singleTypeElms.forEach((singleTypeElm) => {
		singleTypeElm.classList.add("strapify-hide");
		hiddenSingleTypeElms.push(singleTypeElm);
	});

	//try to get the user from local storage
	const user = localStorage.getItem("user");

	//if the user exists, make a request to the user endpoint to test the jwt
	if (user) {
		strapiRequest("/api/users/me").then((response) => {
			//when we succeed, dispatch a custom event with the user data
			document.dispatchEvent(new CustomEvent("strapiUserAuthenticated", {
				bubbles: false,
				detail: {
					user: response
				}
			}));
		}).catch((error) => {
			//when we fail, dispatch a custom event to indicate that the user authentication failed
			document.dispatchEvent(new CustomEvent("strapiUserAuthenticationError", {
				bubbles: false,
				detail: {
					error: error
				}
			}));

			//then remove the user and jwt from local storage
			localStorage.removeItem("user");
			localStorage.removeItem("jwt");

			//then refresh the page
			window.location.reload();
		}).finally(() => {
			//in any case, strapify!!!
			strapify();
		});
	} else {
		//if there was no user in local storage, strapify!!!
		strapify();
	}
});

//when the strapify has initialized, write a message to the console
document.addEventListener("strapifyInitialized", () => {
	if (debugMode) console.log("strapify finished");
});

//this is essentially the entry point for Strapify. It is called when the DOM is ready and user authenticated has been handled
async function strapify() {
	//find all elements with the strapi-delete attribute and remove them
	const deleteElms = document.body.querySelectorAll("[strapi-delete]");
	deleteElms.forEach(deleteElm => deleteElm.remove());

	//find all top level elements (not descendents/processed by other strapify elements)
	const singleTypeElms = document.querySelectorAll(Strapify.validStrapifySingleTypeAttributes.map((attr) => `[${attr}]`).join(", "));
	const collectionElms = document.body.querySelectorAll("[strapi-collection]");
	const formElms = document.body.querySelectorAll("[strapi-form], [strapi-auth]");
	const logoutElms = document.body.querySelectorAll("[strapi-logout]");
	const ezFormsElms = Strapify.findEZFormElms();

	//the elements will be processed asynchronously, so we store the promises in an array on which we can await
	const processPromises = []

	//instantiate the strapify objects and process them
	for (let i = 0; i < formElms.length; i++) {
		const formElm = formElms[i]
		const strapifyForm = new StrapifyForm(formElm)
		processPromises.push(strapifyForm.process())
	}
	for (let i = 0; i < singleTypeElms.length; i++) {
		const singleTypeElm = singleTypeElms[i]
		const strapifySingleType = new StrapifySingleType(singleTypeElm);
		processPromises.push(strapifySingleType.process());
	}
	for (let i = 0; i < collectionElms.length; i++) {
		const collectionElm = collectionElms[i]
		const strapifyCollection = new StrapifyCollection(collectionElm);
		processPromises.push(strapifyCollection.process());
	}
	for (let i = 0; i < ezFormsElms.length; i++) {
		const ezFormsElm = ezFormsElms[i]
		const strapifyEZFormsForm = new StrapifyEZFormsForm(ezFormsElm);
		processPromises.push(strapifyEZFormsForm.process());
	}

	//logout elements are a simple case, so we just handle them here
	for (let i = 0; i < logoutElms.length; i++) {
		const logoutElm = logoutElms[i]
		const logoutRedirect = logoutElm.getAttribute("strapi-logout-redirect");
		logoutElm.addEventListener("click", () => {
			localStorage.removeItem("user");
			localStorage.removeItem("jwt");
			if (logoutRedirect) {
				window.location = logoutRedirect;
			} else {
				window.location.reload();
			}
		});
	}

	//wait for all the strapify objects to finish processing
	await Promise.allSettled(processPromises)

	//webflow cancer treatment
	// if (window.Webflow && window.Webflow.require) {
	// 	console.log("reinitializing ix2 (in strapify-injector)")
	// 	window.Webflow.destroy();
	// 	window.Webflow.ready();
	// 	window.Webflow.require("ix2").init();
	// 	document.dispatchEvent(new Event("readystatechange"));
	// }

	//dispatch the strapifyInitialized event
	document.dispatchEvent(new CustomEvent("strapifyInitialized", {
		bubbles: false,
		detail: {
			userAuthenticated: !!localStorage.getItem("user"),
			user: JSON.parse(localStorage.getItem("user"))
		}
	}));
}