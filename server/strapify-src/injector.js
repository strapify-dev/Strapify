import StrapifyCollection from "./StrapifyCollection"
import strapiRequest from "./util/strapiRequest";
import { marked } from "marked";

const this_script = document.currentScript;
let strapi_api_url;
if (this_script.hasAttribute("data-strapi-api-url")) {
	strapi_api_url = this_script.attributes.getNamedItem("data-strapi-api-url").value;
	//remove trailing slash
	strapi_api_url = strapi_api_url.replace(/\/$/, "");
} else {
	strapi_api_url = "http://localhost:1337";
}

console.log("HELLO")

//find all elements with strapi-single-type attributes and process them
const singleTypeElms = document.querySelectorAll(`[strapi-single-type]`);

//find all the elements with the strapi-collection attribute and process them
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

collectionElms.forEach((collectionElm) => {
	const strapifyCollection = new StrapifyCollection(collectionElm, strapi_api_url);
	strapifyCollection.process();
});

export { strapi_api_url };