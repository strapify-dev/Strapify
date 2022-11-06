import strapiRequest from "./util/strapiRequest";

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
		default:
			throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
	}
}

//find all the elements with the strapi-collection attribute
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

//for each collection element 
collectionElms.forEach(async (collectionElm) => {
	//clone the template item elm and remove it from the dom
	const itemTemplateElm = collectionElm.children[0].cloneNode(true)
	collectionElm.children[0].remove()

	//get the collection item data from strapi
	const collectionBaseURL = "/api/" + collectionElm.getAttribute("strapi-collection");
	const collectionData = await strapiRequest(collectionBaseURL, "?populate=*")

	//loop through the collection data and add it to a new clone of the template item elm
	for (let i = 0; i < collectionData.length; i++) {
		const { id, attributes } = collectionData[i];
		const itemElm = itemTemplateElm.cloneNode(true);

		//find all the field elements in the item elm
		const fieldElms = itemElm.querySelectorAll("[field-id]");

		//loop through the field elements and set the inner html to the field value from the collection data
		fieldElms.forEach((fieldElm) => {
			const fieldId = fieldElm.getAttribute("field-id");
			const fieldValue = attributes[fieldId];
			//fieldElm.innerHTML = fieldValue;
			modifyElmWithStrapiData(fieldElm, fieldValue);
		});

		//add the item elm to the collection elm
		collectionElm.appendChild(itemElm);
	}
})

export { strapi_api_url };