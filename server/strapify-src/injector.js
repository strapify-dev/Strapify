import StrapifyCollection from "./StrapifyCollection"
import StrapifySingleType from "./StrapifySingleType";
import Strapify from "./Strapify";

//find all elements with strapi-single-type attributes 
const singleTypeElms = document.querySelectorAll(`[strapi-single-type], [strapi-single-type-into]`);

//find all the elements with the strapi-collection attribute 
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

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
