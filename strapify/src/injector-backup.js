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

//an element is a strapi template element under the following conditions:
//1. the immediate parent element has a strapi-collection attribute
//2. it has at least one descendant with a strapify attribute, excluding collection type attributes
//3. the immediate parent element is the closest strapi-collection for every descendant in condition 2
//the third condition allows for nested collections
function isStrapifyTemplateElement(elm, parentElm) {
	if (!parentElm.hasAttribute("strapi-collection")) {
		console.error("parentElm must be a strapi-collection element")
	}

	const matchAttributes = ["strapi-field", "strapi-class-replace"];
	const strapifyElms = elm.querySelectorAll(matchAttributes.map((attr) => `[${attr}]`).join(", "));

	if (strapifyElms.length === 0) {
		return false;
	}

	for (let i = 0; i < strapifyElms.length; i++) {
		if (strapifyElms[i].closest("[strapi-collection]") !== parentElm) {
			return false;
		}
	}

	return true;
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

function processStrapiFieldElms(fieldElms, strapiAttributes) {
	//loop through the field elements and set their content to the field value from the collection data
	fieldElms.forEach((fieldElm) => {
		const fieldId = fieldElm.getAttribute("strapi-field");
		const fieldValue = strapiAttributes[fieldId];

		modifyElmWithStrapiData(fieldElm, fieldValue);
	});
}

function processStrapiClassAddElms(classAddElms, strapiAttributes) {
	classAddElms.forEach((classAddElm) => {
		const strapiAttributeName = classAddElm.getAttribute("strapi-class-add");
		const className = strapiAttributes[strapiAttributeName];

		classAddElm.classList.add(className);
	})
}

function processStrapiClassReplaceElms(classReplaceElms, strapiAttributes) {
	//loop through the class replace elements and replace the class with the value from the collection data
	classReplaceElms.forEach((classReplaceElm) => {
		const classReplaceData = classReplaceElm.getAttribute("strapi-class-replace");

		const split = classReplaceData.split(",");
		const classToReplace = split[0].trim();
		const classReplaceValue = strapiAttributes[split[1].trim()];

		classReplaceElm.classList.remove(classToReplace);
		classReplaceElm.classList.add(classReplaceValue);
	})
}

function processStrapiIntoElms(intoElms, strapiAttributes) {
	intoElms.forEach(async (intoElm) => {
		const intoElmData = intoElm.getAttribute("strapi-into");

		const split = intoElmData.split("->");
		const intoAttributeName = split[1].trim();
		const intoAttributeValue = strapiAttributes[split[0].trim()];

		intoElm.setAttribute(intoAttributeName, intoAttributeValue);
	})
}

function processStrapiCollectionTypeElms(collectionElms) {
	collectionElms.forEach(async (collectionElm, index) => {
		//determine template elm candidates, pick one as the template, remove them all from the dom
		const templateElms = Array.from(collectionElm.children).filter((child) => isStrapifyTemplateElement(child, collectionElm));
		const templateElm = templateElms[0].cloneNode(true)
		templateElms.forEach(templateElm => templateElm.remove());

		//look for page control elements
		const pageControlElms = collectionElm.querySelectorAll("[strapi-page-control]");
		pageControlElms.forEach(pageControlElm => {
			const pageControlType = pageControlElm.getAttribute("strapi-page-control");

			pageControlElm.addEventListener("click", () => {
				if (pageControlType === "left") {

				} else if (pageControlType === "right") {

				}
			})
		})

		//get the collection query string attributes and match them to a query string prefix
		const collectionName = collectionElm.getAttribute("strapi-collection")
		const queryStringPairs = {
			"filters": collectionElm.getAttribute("strapi-filter"),
			"sort=": collectionElm.getAttribute("strapi-sort"),
			"pagination[page]=": collectionElm.getAttribute("strapi-page"),
			"pagination[pageSize]=": collectionElm.getAttribute("strapi-page-size"),
			"populate=": "*"
		}

		//generate the query string for the collection data request. Ridiculous but elegant?
		const queryString = "?" + Object.keys(queryStringPairs).map((prefix) => {
			if (queryStringPairs[prefix]) {
				return queryStringPairs[prefix].split("|").map(arg => {
					return `${prefix}${arg.trim()}`
				}).join("&");
			}
		}).filter(item => item).join("&")

		console.log(queryString)

		//get the collection item data from strapi
		const collectionData = await strapiRequest(`/api/${collectionName}`, queryString)

		//keep our strapi element data well organized in one place
		const strapifyElmsData = {
			strapiField: { attribute: "strapi-field", elements: [], processFunction: processStrapiFieldElms },
			strapiClassAdd: { attribute: "strapi-class-add", elements: [], processFunction: processStrapiClassAddElms },
			strapiClassReplace: { attribute: "strapi-class-replace", elements: [], processFunction: processStrapiClassReplaceElms },
			strapiConditionalClass: { attribute: "strapi-conditional-class", elements: [], processFunction: () => { console.warn("not implemented") } },
			strapiInto: { attribute: "strapi-into", elements: [], processFunction: processStrapiIntoElms }
		}

		//find elms in the base template elm using strapify attributes. 
		for (let strapifyType in strapifyElmsData) {
			strapifyElmsData[strapifyType].elements = templateElm.querySelectorAll(`[${strapifyElmsData[strapifyType].attribute}]`);
		}

		//loop through the collection data and process template clone with the strapi data, add to DOM
		for (let i = 0; i < collectionData.length; i++) {
			const { id: strapiId, attributes: strapiAttributes } = collectionData[i];

			//process strapi field type elements
			for (let strapifyType in strapifyElmsData) {
				strapifyElmsData[strapifyType].processFunction(strapifyElmsData[strapifyType].elements, strapiAttributes);
			}

			//clone the base template elm and put it in the dom
			collectionElm.appendChild(templateElm.cloneNode(true));
		}
	})
}

//find all elements with strapi-single-type attributes and process them
const singleTypeElms = document.querySelectorAll(`[strapi-single-type]`);
processStrapiSingleTypeElms(singleTypeElms);

//find all the elements with the strapi-collection attribute and process them
const collectionElms = document.body.querySelectorAll("[strapi-collection]");
processStrapiCollectionTypeElms(collectionElms);

export { strapi_api_url };