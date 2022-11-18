import { marked } from "marked";

const this_script = document.currentScript;
let apiURL;
if (this_script.hasAttribute("data-strapi-api-url")) {
	//get the strapi api url from the script tag and remove the trailing slash
	apiURL = this_script.attributes.getNamedItem("data-strapi-api-url").value;
	apiURL = apiURL.replace(/\/$/, "");
} else {
	//default to localhost
	apiURL = "http://localhost:1337";
}

const validStrapifyCollectionAttributes = [
	"strapi-collection", "strapi-collection-filter", "strapi-collection-sort",
	"strapi-collection-page", "strapi-collection-page-size"
];

const validStrapifyFieldAttributes = [
	"strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-into"
];

function modifyElmWithStrapiData(strapiData, elm) {
	switch (true) {
		case elm instanceof HTMLParagraphElement:
			elm.innerHTML = strapiData;
			break;
		case elm instanceof HTMLHeadingElement:
			elm.innerHTML = strapiData;
			break;
		case elm instanceof HTMLSpanElement:
			elm.innerHTML = strapiData;
			break;
		case elm instanceof HTMLImageElement:
			elm.removeAttribute("srcset");
			elm.removeAttribute("sizes");
			elm.src = `${apiURL}${strapiData.data.attributes.url}`;
			elm.alt = strapiData.data.attributes.alternativeText;
			break;
		case elm instanceof HTMLDivElement: //IMPORTANT! this is a hack for rich text. Need something more robust. Also need to sanitize
			elm.innerHTML = marked.parse(`${strapiData}`);
			break;
		default:
			throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
	}
}

const Strapify = {
	apiURL: apiURL,
	validStrapifyCollectionAttributes: validStrapifyCollectionAttributes,
	validStrapifyFieldAttributes: validStrapifyFieldAttributes,
	modifyElmWithStrapiData: modifyElmWithStrapiData
}

export default Strapify
