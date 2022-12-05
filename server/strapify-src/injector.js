import StrapifyCollection from "./StrapifyCollection"
import StrapifySingleType from "./StrapifySingleType";
import StrapifyForm from "./StrapifyForm";
import Strapify from "./Strapify";

//wait for content to load and scripts to execute
document.addEventListener("DOMContentLoaded", () => {
	console.log("running strapify");
	strapify();
});

document.addEventListener("strapifyinitialized", () => {
	console.log("strapify finished");
});

async function strapify() {
	//create a class called strapify-hide and insert it into the head
	const strapifyHideStyle = document.createElement("style");
	strapifyHideStyle.innerHTML = ".strapify-hide { display: none !important; }";
	document.head.appendChild(strapifyHideStyle);

	//find all elements with the strapi-delete attribute
	const deleteElms = document.body.querySelectorAll("[strapi-delete]");

	//remove all delete elements
	deleteElms.forEach(deleteElm => deleteElm.remove());

	//find all elements with strapi-single-type attributes 
	const singleTypeElms = document.querySelectorAll(Strapify.validStrapifySingleTypeAttributes.map((attr) => `[${attr}]`).join(", "));

	//find all the elements with the strapi-collection attribute 
	const collectionElms = document.body.querySelectorAll("[strapi-collection]");

	//find all the elements with the strapi-form or strapi-auth attribute
	const formElms = document.body.querySelectorAll("[strapi-form], [strapi-auth]");

	const promises = []

	for (let i = 0; i < formElms.length; i++) {
		const formElm = formElms[i]
		const strapifyForm = new StrapifyForm(formElm)
		promises.push(strapifyForm.process())
	}

	for (let i = 0; i < singleTypeElms.length; i++) {
		const singleTypeElm = singleTypeElms[i]
		const strapifySingleType = new StrapifySingleType(singleTypeElm);
		promises.push(strapifySingleType.process());
	}

	for (let i = 0; i < collectionElms.length; i++) {
		const collectionElm = collectionElms[i]
		const strapifyCollection = new StrapifyCollection(collectionElm);
		promises.push(strapifyCollection.process());
	}

	await Promise.allSettled(promises)

	if (window.Webflow && window.Webflow.require) {
		console.log("reinitializing ix2 (in strapify-injector)")
		await window.Webflow.destroy();
		await window.Webflow.ready();
		await window.Webflow.require("ix2").init();
		document.dispatchEvent(new Event("readystatechange"));
	}

	//dispatch custom event with the collection data
	document.dispatchEvent(new CustomEvent("strapifyinitialized", {
		bubbles: false,
		target: document.body
	}));
}