import { marked } from "marked";
import parser from "./strapify-parser"
import strapiRequest from "./util/strapiRequest";

const this_script = document.currentScript;
let apiURL;
if (this_script?.hasAttribute("data-strapi-api-url")) {
	//get the strapi api url from the script tag and remove the trailing slash
	apiURL = this_script.attributes.getNamedItem("data-strapi-api-url").value;
	apiURL = apiURL.replace(/\/$/, "");
} else {
	//default to localhost
	warn("No Strapi API URL was provided. Please provide a Strapi API URL using the data-strapi-api-url attribute on the script tag.");
	apiURL = "http://localhost:1337";
}

let applyWebflowAnimationFix = false;
if (this_script?.hasAttribute("data-apply-webflow-animation-fix")) {
	applyWebflowAnimationFix = this_script.attributes.getNamedItem("data-apply-webflow-animation-fix").value === "true";
}

const validStrapifySingleTypeAttributes = [
	"strapi-single-type", "strapi-single-type-into", "strapi-single-type-css-rule", "strapi-single-type-relation",
	"strapi-single-type-repeatable", "strapi-single-type-class-add", "strapi-single-type-class-replace", "strapi-single-type-class-conditional",
];

const validStrapifyCollectionAttributes = [
	"strapi-collection", "strapi-filter", "strapi-sort",
	"strapi-page", "strapi-page-size",
	"strapi-filter-internal-relation", "strapi-filter-internal-control",
	"strapi-sort-internal-relation", "strapi-sort-internal-control",
	"strapi-hide-on-fail"
];

const validStrapifyFieldAttributes = [
	"strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-class-conditional",
	"strapi-into", "strapi-css-rule"
];

const validStrapifyControllAttributes = [
	"strapi-page-control", "strapi-filter-control", "strapi-sort-control",
]

let ix2Timeout;

function findCollectionElms() {
	return document.body.querySelectorAll("[strapi-collection]");
}

function findTemplateElms(containerElement) {
	const templateElms = Array.from(containerElement.querySelectorAll("[strapi-template], [strapi-template-conditional]"))
	return templateElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === containerElement);
}

function findUniqueConditionalTemplateElms(containerElm) {
	const templateElms = findTemplateElms(containerElm);

	//filter templateElms to remove any that have duplicate data attribute values for strapi-template-conditional
	const templateElmsWithConditionalAttributes = templateElms.filter(templateElm => templateElm.hasAttribute("strapi-template-conditional"));
	const templateElmsWithDuplicateConditionalAttributes = templateElmsWithConditionalAttributes.filter(templateElm => {
		const conditionalAttributes = templateElmsWithConditionalAttributes.filter(otherTemplateElm => {
			return otherTemplateElm.getAttribute("strapi-template-conditional") === templateElm.getAttribute("strapi-template-conditional");
		});

		return conditionalAttributes.length > 1;
	});

	const templateElmsWithoutDuplicateConditionalAttributes = templateElmsWithConditionalAttributes.filter(templateElm => {
		return !templateElmsWithDuplicateConditionalAttributes.includes(templateElm);
	});

	return templateElmsWithoutDuplicateConditionalAttributes;
}

function findFieldElms(containerElm) {
	const querySelectorString = Strapify.validStrapifyFieldAttributes.map(attribute => `[${attribute}]`).join(",");
	const fieldElms = Array.from(containerElm.querySelectorAll(querySelectorString));
	return fieldElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === containerElm);
}

function findRelationElms(containerElm) {
	const relationElms = Array.from(containerElm.querySelectorAll("[strapi-relation]"))
	return relationElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === containerElm);
}

function findRepeatableElms(templateElm) {
	const repeataleElms = Array.from(templateElm.querySelectorAll("[strapi-repeatable]"))
	return repeataleElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === templateElm);
}

function findPageControlElms(containerElm) {
	const pageControlElms = Array.from(containerElm.querySelectorAll("[strapi-page-control]"));
	return pageControlElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === containerElm);
}

function findFilterControlElms(containerElm) {
	const filterControlElms = Array.from(containerElm.querySelectorAll("[strapi-filter-control]"));
	return filterControlElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === containerElm);
}

function findSortControlElms(containerElm) {
	const sortControlElms = Array.from(containerElm.querySelectorAll("[strapi-sort-control]"));
	return sortControlElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === containerElm);
}

function findFormInputElms(containerElm) {
	const formInputElms = Array.from(containerElm.querySelectorAll("[strapi-form-input], [strapi-auth-input]"));
	return formInputElms.filter(child => child.closest("[strapi-form], [strapi-auth]") === containerElm);
}

function findFormSubmitElms(containerElm) {
	const formSubmitElms = Array.from(containerElm.querySelectorAll("[strapi-form-submit], [strapi-auth-submit]"));
	return formSubmitElms.filter(child => child.closest("[strapi-form], [strapi-auth]") === containerElm);
}

function findInsertBeforeElm(templateElm) {
	let curElm = templateElm.nextElementSibling;
	while (curElm) {
		if (!curElm.hasAttribute("strapi-template") && !curElm.hasAttribute("strapi-template-conditional")) {
			return curElm;
		}

		curElm = curElm.nextElementSibling;
	}

	return null;
}

function findStateElements(container) {
	const stateElms = Array.from(container.querySelectorAll("[strapi-state-element]"));
	return stateElms.filter(child => child.closest("[strapi-collection], [strapi-ezforms-form]") === container);
}

function findEZFormElms() {
	const ezFormElms = Array.from(document.querySelectorAll("[strapi-ezforms-form]"));
	return ezFormElms;
}

function findEZFormSubmitElms(containerElm) {
	const ezFormSubmitElms = Array.from(containerElm.querySelectorAll("[strapi-ezforms-submit]"));
	return ezFormSubmitElms.filter(child => child.closest("[strapi-ezforms-form]") === containerElm);
}

function getQueryStringVariables() {
	//get the query strings variables
	const queryString = window.location.search.substring(1);
	const vars = queryString.split("&").filter(v => v);

	//split the query string variables into key value pairs
	const queryStringVariables = {};
	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split("=");
		queryStringVariables[pair[0]] = pair[1];
	}

	return queryStringVariables;
}

function substituteQueryStringVariables(argument) {
	if (!argument) return argument;

	const regex = /qs\.([\w\-2]+)/gm
	const matches = argument.match(regex);

	if (!matches) {
		return argument;
	}

	const queryStringVariables = getQueryStringVariables();

	//replace first instance of match with the value of the query string variable for each match
	const reduced = matches.reduce((acc, match) => {
		const queryStringVariableValue = queryStringVariables[match.split("qs.")[1]]
		return acc.replace(new RegExp(`${match}`, "m"), queryStringVariableValue)
	}, argument)

	return reduced
}

function removeQueryStringVariableReferences(argument) {
	if (!argument) return argument;

	const regex = /qs\.([\w\-2]+)/gm
	const matches = argument.match(regex);

	if (!matches) {
		return argument;
	}

	//replace first instance of match with the empty string
	let reduced = matches.reduce((acc, match) => {
		return acc.replace(new RegExp(`${match}`, "m"), "")
	}, argument)

	//remove leading or trailing periods
	reduced = reduced.replace(/^\./gm, "")
	reduced = reduced.replace(/\.$/gm, "")

	//remove any repeated occurrences of periods
	reduced = reduced.replace(/\.{2,}/gm, ".")

	return reduced
}

function substituteStrapiDataAttributes(argument, strapiAttributes) {
	//strapi variables are wrapped in double curly braces
	const regex = /{{(.*?)}}/g;

	//find matches
	const matches = argument.match(regex);


	//if no matches, then no strapi variables in arg
	if (!matches) {
		console.log("intoDataValue", intoDataValue)
		intoDataValue = Strapify.substituteQueryStringVariables(intoDataValue);
		intoDataValue = Strapify.getStrapiComponentValue(intoDataValue, strapiAttributes);

		return intoDataValue;
	}

	//get all strapi variables in argument and replace with value from getStrapiComponentValue
	matches.forEach((match) => {
		const strapiFieldName = match.substring(2, match.length - 2);
		strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
		argument = argument.replace(match, strapiValue);
	})

	return argument;
}

function getArguments(attributeValue) {
	return attributeValue.split("|").map(arg => arg.trim());
}

function getProcessedArguments(attributeValue) {
	attributeValue = substituteQueryStringVariables(attributeValue);
	return attributeValue.split("|").map(arg => arg.trim());
}

function getStrapiComponentValue(argument, strapiAttributes) {
	const strapiAttributesNames = argument.split(".");

	let strapiDataValue = strapiAttributesNames.reduce((accumulator, currentValue) => {
		return accumulator[currentValue];
	}, strapiAttributes);

	return strapiDataValue;
}

//non destructive, you can pass non youtube links
function getEmbeddedYoutubeLink(link) {
	const youtubeUrl = link.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
	if (youtubeUrl && !youtubeUrl[0].includes("embed")) {
		const youtubeUrl = new URL(link);
		const youtubeId = youtubeUrl.searchParams.get("v");
		return `https://www.youtube.com/embed/${youtubeId}`;
	}

	return link;
}

function modifyDivWithStrapiVideoData(strapiData, elm) {
	//create a video element to replace the div
	const videoElement = document.createElement("video");
	videoElement.controls = true;
	videoElement.src = `${apiURL}${strapiData.data.attributes.url}`;
	videoElement.type = strapiData.data.attributes.mime;

	//move div attributes and classes to video element
	elm.getAttributeNames().forEach(atribName => videoElement.setAttribute(atribName, elm.getAttribute(atribName)));
	elm.classList.forEach(className => videoElement.classList.add(className));

	//replace the div with the video element
	elm.parentElement.replaceChild(videoElement, elm);
}

function modifyIFrameWithStrapiData(strapiData, iFrameElm) {
	const parentElement = iFrameElm.parentElement;
	const insertBeforeElm = iFrameElm.nextSibling;

	//remove the iframe element
	iFrameElm.remove();

	//this is also valid when the link is not a youtube link
	let embedUrl = getEmbeddedYoutubeLink(strapiData)

	//replace the iframe src with the strapi data
	iFrameElm.setAttribute("src", embedUrl);
	iFrameElm.setAttribute("title", "")

	//add the iframe element back to the div
	if (insertBeforeElm) {
		parentElement.insertBefore(iFrameElm, insertBeforeElm);
	} else {
		parentElement.appendChild(iFrameElm);
	}
}

function modifyElmWithStrapiData(strapiData, elm) {
	//look for iframe element in elm
	let iFrameElm = elm.querySelector("iframe");
	iFrameElm?.parentElement !== elm && (iFrameElm = null);

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
		case elm instanceof HTMLVideoElement:
			elm.src = `${apiURL}${strapiData.data.attributes.url}`;
			elm.type = strapiData.data.attributes.mime;
			break;
		case elm instanceof HTMLIFrameElement:
			modifyIFrameWithStrapiData(strapiData, elm);
		case elm instanceof HTMLDivElement: //for a div, we could have video or rich text
			//video
			if (strapiData.data?.attributes.mime && strapiData?.data?.attributes?.mime.includes("video")) {
				modifyDivWithStrapiVideoData(strapiData, elm);
			}
			//embedded video
			else if (iFrameElm) {
				modifyIFrameWithStrapiData(strapiData, iFrameElm);
			}
			//rich text
			else {
				elm.innerHTML = marked.parse(`${strapiData}`);
			}

			break;
		default:
			error(`The element type ${elm.tagName} is not supported`);
			throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
	}
}

function parseCondition(condition) {
	let error = null
	let result = null

	try {
		result = parser.parse(condition)
	} catch (e) {
		error = e
		throw new Error(e)
	}

	return { result: result, error: error }
}

function getLiteralValue(valueData, strapiAttributes) {
	if (valueData.type === "variable") {
		return getStrapiComponentValue(valueData.value, strapiAttributes);
	} else if (valueData.type === "string") {
		return valueData.value;
	} else if (valueData.type === "boolean") {
		if (valueData.value === "true") {
			return true;
		} else if (valueData.value === "false") {
			return false;
		}
	} else if (valueData.type === "null") {
		return null;
	}
	else if (valueData.type === "integer") {
		return parseInt(valueData.value);
	} else if (valueData.type === "float") {
		return parseFloat(valueData.value);
	}
}

function compareLiteralValues(left, right, operatorType) {
	switch (operatorType) {
		case "eq":
			return left === right;
		case "ne":
			return left !== right;
		case "gt":
			return left > right;
		case "ge":
			return left >= right;
		case "lt":
			return left < right;
		case "le":
			return left <= right;
		case "and":
			return left && right;
		case "or":
			return left || right;
		default:
			throw new Error("Attempted to use an unsupported operator type - " + operatorType);
	}
}

//strapiAttributes is the attributes data from a strapi collection fetch
function checkCondition(parsedConditionData, strapiAttributes, infiniteRecursionProtection = 0) {
	if (infiniteRecursionProtection > 5000) {
		throw new Error("Overflow protection triggered")
	}

	const left = parsedConditionData.left;
	const right = parsedConditionData.right;
	const operatorType = parsedConditionData.type;

	//we need to do an early check for a variable to substitute query string variables
	if (left.type === "variable") {
		left.value = substituteQueryStringVariables(left.value);
	}
	if (right.type === "variable") {
		right.value = substituteQueryStringVariables(right.value);
	}

	let resolvedLeft = null;
	let resolvedRight = null;

	//if left is a value
	if (left.value !== undefined) {
		resolvedLeft = getLiteralValue(left, strapiAttributes);
	}

	//if left is a condition
	if (left.left !== undefined) {
		resolvedLeft = checkCondition(left, strapiAttributes, infiniteRecursionProtection + 1);
	}

	//if right is a value
	if (right.value !== undefined) {
		resolvedRight = getLiteralValue(right, strapiAttributes);
	}

	//if right is a condition
	if (right.left !== undefined) {
		resolvedRight = checkCondition(right, strapiAttributes, infiniteRecursionProtection + 1);
	}

	const comparisonResult = compareLiteralValues(resolvedLeft, resolvedRight, operatorType);

	return comparisonResult
}

//helper function to ensure parsed single types have their data fetched
async function updateSingleTypeAttributesForConditionCheck(fieldIdentifier, curAttributes) {
	//first get the single type name from the field identifier
	const singleTypeName = fieldIdentifier.split(".")[0];

	//if curAttributes does not already have the data for the single type, fetch it and add it to curAttributes
	if (curAttributes[singleTypeName] === undefined) {
		const strapiData = await strapiRequest("/api/" + singleTypeName, "?populate=*");
		curAttributes[singleTypeName] = strapiData.data.attributes;
	}

	return curAttributes;
}

/*
	do not pass strapiAttributes, it is only used as a temp variable for recursion.
	We will fetch and  add single type data as we need it, creating a strapiAttributes 
	data structure that emulates the structure of data from a collection component, to 
	enable code reuse.
*/
async function checkConditionSingleType(parsedConditionData, infiniteRecursionProtection = 0, strapiAttributes = {}) {
	if (infiniteRecursionProtection > 5000) {
		throw new Error("Overflow protection triggered")
	}

	const left = parsedConditionData.left;
	const right = parsedConditionData.right;
	const operatorType = parsedConditionData.type;

	//we need to do an early check for a variable type value so the single type data can be fetched
	if (left.type === "variable") {
		left.value = substituteQueryStringVariables(left.value);
		strapiAttributes = await updateSingleTypeAttributesForConditionCheck(left.value, strapiAttributes);
	}
	if (right.type === "variable") {
		right.value = substituteQueryStringVariables(right.value);
		strapiAttributes = await updateSingleTypeAttributesForConditionCheck(right.value, strapiAttributes);
	}

	let resolvedLeft = null;
	let resolvedRight = null;

	//if left is a value
	if (left.value !== undefined) {
		resolvedLeft = getLiteralValue(left, strapiAttributes);
	}

	//if left is a condition
	if (left.left !== undefined) {
		resolvedLeft = checkCondition(left, strapiAttributes, infiniteRecursionProtection + 1, strapiAttributes);
	}

	//if right is a value
	if (right.value !== undefined) {
		resolvedRight = getLiteralValue(right, strapiAttributes);
	}

	//if right is a condition
	if (right.left !== undefined) {
		resolvedRight = checkCondition(right, strapiAttributes, infiniteRecursionProtection + 1, strapiAttributes);
	}

	const comparisonResult = compareLiteralValues(resolvedLeft, resolvedRight, operatorType);

	return comparisonResult
}

function reinitializeIX2() {
	if (!window.Webflow || !applyWebflowAnimationFix) {
		return
	}

	function initIX2() {
		try {
			console.log("reinitializing ix2");
			window.Webflow.destroy();
			window.Webflow.ready();
			window.Webflow.require("ix2").init();
			document.dispatchEvent(new Event("readystatechange"));
		} catch (e) {
			console.error(e);
		}

		ix2Timeout = null
	}

	//use ix2Timeout to prevent multiple calls to initIX2() from being made
	if (ix2Timeout) {
		clearTimeout(ix2Timeout);
	}

	ix2Timeout = setTimeout(initIX2, 150);
}

function log(...args) {
	console.group(
		"%cSTRAPIFY LOG",
		"background-color: #6d6d6d; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach(arg => console.log(arg));
	console.groupEnd();
}

function warn(...args) {
	console.group(
		"%cSTRAPIFY WARNING",
		"background-color: #9b9023; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach(arg => console.warn(arg));
	console.groupEnd();
}

function error(...args) {
	console.group(
		"%cSTRAPIFY ERROR",
		"background-color: #aa3d3d; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach(arg => console.error(arg));
	console.groupEnd();
}

const Strapify = {
	apiURL: apiURL,
	validStrapifySingleTypeAttributes: validStrapifySingleTypeAttributes,
	validStrapifyCollectionAttributes: validStrapifyCollectionAttributes,
	validStrapifyFieldAttributes: validStrapifyFieldAttributes,
	validStrapifyControllAttributes: validStrapifyControllAttributes,
	queryStringVariables: getQueryStringVariables(),
	findCollectionElms: findCollectionElms,
	findTemplateElms: findTemplateElms,
	findUniqueConditionalTemplateElms: findUniqueConditionalTemplateElms,
	findRelationElms: findRelationElms,
	findRepeatableElms: findRepeatableElms,
	findFieldElms: findFieldElms,
	findPageControlElms: findPageControlElms,
	findFilterControlElms: findFilterControlElms,
	findSortControlElms: findSortControlElms,
	findFormInputElms: findFormInputElms,
	findFormSubmitElms: findFormSubmitElms,
	findInsertBeforeElm: findInsertBeforeElm,
	findStateElements: findStateElements,
	findEZFormElms: findEZFormElms,
	findEZFormSubmitElms: findEZFormSubmitElms,
	getQueryStringVariables: getQueryStringVariables,
	substituteQueryStringVariables: substituteQueryStringVariables,
	removeQueryStringVariableReferences: removeQueryStringVariableReferences,
	substituteStrapiDataAttributes: substituteStrapiDataAttributes,
	getArguments: getArguments,
	getProcessedArguments: getProcessedArguments,
	getStrapiComponentValue: getStrapiComponentValue,
	modifyElmWithStrapiData: modifyElmWithStrapiData,
	parseCondition: parseCondition,
	checkCondition: checkCondition,
	checkConditionSingleType: checkConditionSingleType,
	reinitializeIX2: reinitializeIX2,
	log: log,
	warn: warn,
	error: error
}

export default Strapify
