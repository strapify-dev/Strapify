import strapiRequest from "./util/strapiRequest";
import { marked } from "marked";

const this_script = document.currentScript;
let strapi_api_url;
if (this_script.hasAttribute("data-strapi-api-url")) {
	strapi_api_url = this_script.attributes.getNamedItem("data-strapi-api-url").value;
} else {
	strapi_api_url = "http://localhost:1337";
}

const strapifyFieldAttributesDict = {
	strapiField: "strapi-field",
	strapiClassAdd: "strapi-class-add",
	strapiClassReplace: "strapi-class-replace",
	strapiConditionalClass: "strapi-conditional-class",
	strapiInto: "strapi-into"
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
		case elm instanceof HTMLSpanElement:
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

function processStrapiSingleTypeElms(singleTypeElms) {
	singleTypeElms.forEach(async (singleTypeElm) => {
		const attributeValue = singleTypeElm.getAttribute("strapi-single-type");

		const split = attributeValue.split(".");
		const singleTypeName = split[0];
		const singleTypeFieldName = split[1];

		const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*")
		const fieldValue = strapiData.attributes[singleTypeFieldName];

		modifyElmWithStrapiData(singleTypeElm, fieldValue);
	});
}

function processStrapiFieldTypeElms(fieldElms, strapiAttributes) {
	//loop through the field elements and set their content to the field value from the collection data
	fieldElms.forEach((fieldElm) => {
		const fieldId = fieldElm.getAttribute("strapi-field");
		const fieldValue = strapiAttributes[fieldId];

		modifyElmWithStrapiData(fieldElm, fieldValue);
	});
}

function processStrapiClassReplaceElms(classReplaceElms, strapiAttributes) {
	//loop through the class replace elements and replace the class with the value from the collection data
	classReplaceElms.forEach((classReplaceElm) => {
		const classReplaceData = classReplaceElm.getAttribute("strapi-class-replace");

		const classToReplace = classReplaceData.split(",")[0].trim();
		const classReplaceValue = strapiAttributes[classReplaceData.split(",")[1].trim()];

		classReplaceElm.classList.remove(classToReplace);
		classReplaceElm.classList.add(classReplaceValue);
	})
}

function processStrapiCollectionTypeElms(collectionElms) {
	//for each collection element 
	collectionElms.forEach(async (collectionElm) => {
		//clone the template elm
		const templateElmBase = collectionElm.children[0].cloneNode(true)

		//loop through collectionElm's children and delete any that themselves have children with the strapi-field attribute
		Array.from(collectionElm.children).forEach((child) => {
			(child.querySelectorAll("[strapi-field]").length > 0) && collectionElm.removeChild(child)
		})

		//get the collection item data from strapi
		const collectionBaseURL = "/api/" + collectionElm.getAttribute("strapi-collection");
		const collectionData = await strapiRequest(collectionBaseURL, "?populate=*")

		//loop through the collection data and add it to a new clone of the template item elm
		for (let i = 0; i < collectionData.length; i++) {
			const { id: strapiId, attributes: strapiAttributes } = collectionData[i];
			const templateElm = templateElmBase.cloneNode(true);

			//find elms using strapify attributes for each type of attribute
			let strapifyFieldElms = {}
			for (let fieldAttribute in strapifyFieldAttributesDict) {
				const fieldAttributeValue = strapifyFieldAttributesDict[fieldAttribute];
				strapifyFieldElms[fieldAttribute] = templateElm.querySelectorAll(`[${fieldAttributeValue}]`);
			}

			//process strapi field type elements
			processStrapiFieldTypeElms(strapifyFieldElms.strapiField, strapiAttributes);
			processStrapiClassReplaceElms(strapifyFieldElms.strapiClassReplace, strapiAttributes);

			//add the item elm to the collection elm
			collectionElm.appendChild(templateElm);
		}
	})
}

//find all elements with strapi-single-type attributes modify them with strapi data
const singleTypeElms = document.querySelectorAll(`[strapi-single-type]`);
processStrapiSingleTypeElms(singleTypeElms);

//find all the elements with the strapi-collection attribute
const collectionElms = document.body.querySelectorAll("[strapi-collection]");
processStrapiCollectionTypeElms(collectionElms);

export { strapi_api_url };