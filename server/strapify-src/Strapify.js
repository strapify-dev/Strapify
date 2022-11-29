import { marked } from "marked";
import parser from "./strapify-parser"

const this_script = document.currentScript;
let apiURL;
if (this_script.hasAttribute("data-strapi-api-url")) {
	//get the strapi api url from the script tag and remove the trailing slash
	apiURL = this_script.attributes.getNamedItem("data-strapi-api-url").value;
	apiURL = apiURL.replace(/\/$/, "");
} else {
	//default to localhost
	warn("No Strapi API URL was provided. Please provide a Strapi API URL using the data-strapi-api-url attribute on the script tag.");
	apiURL = "http://localhost:1337";
}

const validStrapifySingleTypeAttributes = [
	"strapi-single-type", "strapi-single-type-into", "strapi-single-type-relation",
	"strapi-single-type-repeatable"
];

const validStrapifyCollectionAttributes = [
	"strapi-collection", "strapi-filter", "strapi-sort",
	"strapi-page", "strapi-page-size",
	"strapi-filter-internal-relation", "strapi-filter-internal-control",
	"strapi-sort-internal-relation", "strapi-sort-internal-control"
];

const validStrapifyFieldAttributes = [
	"strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-class-conditional", "strapi-into"
];

const validStrapifyControllAttributes = [
	"strapi-page-control", "strapi-filter-control", "strapi-sort-control",
]

const queryStringVariables = getQueryStringVariables();
let ix2Timeout;

function findTemplateElms(containerElement) {
	const templateElms = Array.from(containerElement.querySelectorAll("[strapi-template]"))
	return templateElms.filter(child => child.closest("[strapi-collection], [strapi-relation], [strapi-repeatable], [strapi-single-type-repeatable], [strapi-single-type-relation]") === containerElement);
}

function findFieldElms(containerElm) {
	const querySelectorString = Strapify.validStrapifyFieldAttributes.map(attribute => `[${attribute}]`).join(",");
	const fieldElms = Array.from(containerElm.querySelectorAll(querySelectorString));
	return fieldElms.filter(child => child.closest("[strapi-template]") === containerElm);
}

function findRelationElms(containerElm) {
	const relationElms = Array.from(containerElm.querySelectorAll("[strapi-relation]"))
	return relationElms.filter(child => child.closest("[strapi-template]") === containerElm);
}

function findRepeatableElms(templateElm) {
	const repeataleElms = Array.from(templateElm.querySelectorAll("[strapi-repeatable]"))
	return repeataleElms.filter(child => child.closest("[strapi-template]") === templateElm);
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
		if (!curElm.hasAttribute("strapi-template")) {
			return curElm;
		}

		curElm = curElm.nextElementSibling;
	}

	return null;
}

function findStateElements(container) {
	const stateElms = Array.from(container.querySelectorAll("[strapi-state-element]"));
	return stateElms.filter(child => child.closest("[strapi-collection]") === container);
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

	//replace first instance of match with the value of the query string variable for each match
	const reduced = matches.reduce((acc, match) => {
		return acc.replace(new RegExp(`${match}`, "m"), "")
	}, argument)

	return reduced
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

function modifyElmWithStrapiData(strapiData, elm) {
	//look for iframe element with embedly-embed class
	const iFrameElm = elm.querySelector("iframe");

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
		case elm instanceof HTMLDivElement: //for a div, we could have video or rich text
			//video
			if (strapiData.data?.attributes.mime && strapiData?.data?.attributes?.mime.includes("video")) {
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
			//embedded video
			else if (iFrameElm) {
				//remove the iframe element
				iFrameElm.remove();

				let embedUrl = strapiData

				/* 
					this step allows  a youtube link to be given without the embedded url 
					check if strapiData is a youtube url but not a youtube embed url 
					(copilot created these regex expressions, should test more thoroughly)
				*/
				const youtubeUrl = strapiData.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
				if (youtubeUrl && !youtubeUrl[0].includes("embed")) {
					const youtubeUrl = new URL(strapiData);
					const youtubeId = youtubeUrl.searchParams.get("v");
					embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
					console.log(embedUrl);
				}

				//replace the iframe src with the strapi data
				iFrameElm.setAttribute("src", embedUrl);
				iFrameElm.setAttribute("title", "")

				//add the iframe element back to the div
				elm.appendChild(iFrameElm);
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

function reinitializeIX2() {
	if (!window.Webflow) {
		return
	}

	function initIX2() {
		console.log("reinitializing ix2");
		window.Webflow.destroy();
		window.Webflow.ready();
		window.Webflow.require("ix2").init();
		document.dispatchEvent(new Event("readystatechange"));

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
	queryStringVariables: queryStringVariables,
	findTemplateElms: findTemplateElms,
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
	getQueryStringVariables: getQueryStringVariables,
	substituteQueryStringVariables: substituteQueryStringVariables,
	removeQueryStringVariableReferences: removeQueryStringVariableReferences,
	getArguments: getArguments,
	getProcessedArguments: getProcessedArguments,
	getStrapiComponentValue: getStrapiComponentValue,
	modifyElmWithStrapiData: modifyElmWithStrapiData,
	parseCondition: parseCondition,
	reinitializeIX2: reinitializeIX2,
	log: log,
	warn: warn,
	error: error
}

export default Strapify
