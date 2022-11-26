import StrapifyCollection from "./StrapifyCollection"
import StrapifySingleType from "./StrapifySingleType";
import StrapifyForm from "./StrapifyForm";
import Strapify from "./Strapify";



async function strapify() {
	//create a class called strapify-hide and insert it into the head
	const strapifyHideStyle = document.createElement("style");
	strapifyHideStyle.innerHTML = ".strapify-hide { display: none !important; }";
	document.head.appendChild(strapifyHideStyle);

	//find all elements with strapi-single-type attributes 
	const singleTypeElms = document.querySelectorAll(Strapify.validStrapifySingleTypeAttributes.map((attr) => `[${attr}]`).join(", "));

	//find all the elements with the strapi-collection attribute 
	const collectionElms = document.body.querySelectorAll("[strapi-collection]");

	//find all the elements with the strapi-form or strapi-auth attribute
	const formElms = document.body.querySelectorAll("[strapi-form], [strapi-auth]");

	//find all elements with the strapi-delete attribute
	const deleteElms = document.body.querySelectorAll("[strapi-delete]");

	//remove all delete elements
	deleteElms.forEach(deleteElm => deleteElm.remove());

	for (let i = 0; i < formElms.length; i++) {
		const formElm = formElms[i]
		const strapifyForm = new StrapifyForm(formElm)
		await strapifyForm.process()
	}

	for (let i = 0; i < singleTypeElms.length; i++) {
		const singleTypeElm = singleTypeElms[i]
		const strapifySingleType = new StrapifySingleType(singleTypeElm);
		await strapifySingleType.process();
	}

	for (let i = 0; i < collectionElms.length; i++) {
		const collectionElm = collectionElms[i]
		const strapifyCollection = new StrapifyCollection(collectionElm);
		await strapifyCollection.process();
	}

	window.Webflow.destroy();
	window.Webflow.ready();
	window.Webflow.require("ix2").init();
	document.dispatchEvent(new Event("readystatechange"));
}

strapify();