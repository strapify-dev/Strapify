import strapiRequest from "./util/strapiRequest";
import { marked } from "marked";

const this_script = document.currentScript;
let strapi_api_url;
if (this_script.hasAttribute("data-strapi-api-url")) {
	strapi_api_url = this_script.attributes.getNamedItem("data-strapi-api-url").value;
} else {
	strapi_api_url = "http://localhost:1337";
}

//IMPORTANT!
//in here we need to figure out how to determine what strapiData represents
function modifyElmWithStrapiData(elm, strapiData) {
	switch (true) {
		case elm instanceof HTMLParagraphElement:
			elm.innerHTML = strapiData;
			break;
		case elm instanceof HTMLHeadingElement:
			elm.innerHTML = strapiData;
			break;
		case elm instanceof HTMLImageElement:
			elm.removeAttribute("srcset");
			elm.removeAttribute("sizes");
			elm.src = `${strapi_api_url}${strapiData.data.attributes.url}`;
			elm.alt = strapiData.data.attributes.alternativeText;
			break;
		case elm instanceof HTMLDivElement: //IMPORTANT! this is a hack for rich text. Need something more robust. Also need to sanitize
			elm.innerHTML = marked.parse(`${strapiData}`);
			break;
		default:
			throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
	}
}

//find all the elements with the strapi-collection attribute
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

//for each collection element 
collectionElms.forEach(async (collectionElm) => {
	//clone the template item elm
	const itemTemplateElm = collectionElm.children[0].cloneNode(true)

	//loop through collectionElm's children and delete any that themselves have children with the strapi-content attribute
	Array.from(collectionElm.children).forEach((child) => {
		let removeChild = child.querySelectorAll("[strapi-content]").length > 0

		console.log(child, removeChild)

		if (removeChild) {
			collectionElm.removeChild(child)
		}
	})
				
	//get the collection item data from strapi
	const collectionBaseURL = "/api/" + collectionElm.getAttribute("strapi-collection");
	const collectionData = await strapiRequest(collectionBaseURL, "?populate=*")

	//loop through the collection data and add it to a new clone of the template item elm
	for (let i = 0; i < collectionData.length; i++) {
		const { id, attributes } = collectionData[i];
		const itemElm = itemTemplateElm.cloneNode(true);

		//find all the field elements in the item elm
		const fieldElms = itemElm.querySelectorAll("[strapi-content]");

		//loop through the field elements and set the inner html to the field value from the collection data
		fieldElms.forEach((fieldElm) => {
			const fieldId = fieldElm.getAttribute("strapi-content");
			const fieldValue = attributes[fieldId];

			modifyElmWithStrapiData(fieldElm, fieldValue);
		});

		//add the item elm to the collection elm
		collectionElm.appendChild(itemElm);
	}
})

export { strapi_api_url };