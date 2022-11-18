import StrapifyCollection from "./StrapifyCollection"
import strapiRequest from "./util/strapiRequest";
import { marked } from "marked";
import strapi_api_url from "./util/strapi-api-url";

//find all elements with strapi-single-type attributes and process them
const singleTypeElms = document.querySelectorAll(`[strapi-single-type]`);

//find all the elements with the strapi-collection attribute and process them
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

collectionElms.forEach((collectionElm) => {
	const strapifyCollection = new StrapifyCollection(collectionElm);
	strapifyCollection.process();
});

export { strapi_api_url };