import StrapifyCollection from "./StrapifyCollection"
import StrapifySingleType from "./StrapifySingleType";
import StrapifyForm from "./StrapifyForm";
import Strapify from "./Strapify";

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

//create a new StrapifyForm for each form element
formElms.forEach(formElm => {
	const strapifyForm = new StrapifyForm(formElm)
	strapifyForm.process()
});

//create a StrapifySingleType object for each single type element
singleTypeElms.forEach(singleTypeElm => {
	const strapifySingleType = new StrapifySingleType(singleTypeElm);
	strapifySingleType.process();
});

//create a StrapifyCollection for each collection element
collectionElms.forEach((collectionElm) => {
	const strapifyCollection = new StrapifyCollection(collectionElm);
	strapifyCollection.process();
});


