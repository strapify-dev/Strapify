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

const validStrapifySingleTypeAttributes = ["strapi-single-type", "strapi-single-type-into"];

const validStrapifyCollectionAttributes = [
	"strapi-collection", "strapi-collection-filter", "strapi-collection-sort",
	"strapi-collection-page", "strapi-collection-page-size"
];

const validStrapifyFieldAttributes = [
	"strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-into"
];

const queryStringVariables = getQueryStringVariables();

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

function substitueQueryStringVariables(argument) {
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
			throw new Error("Strapify Error: Attempted to use an unsupported element type - " + elm.tagName);
	}
}

const Strapify = {
	apiURL: apiURL,
	validStrapifySingleTypeAttributes: validStrapifySingleTypeAttributes,
	validStrapifyCollectionAttributes: validStrapifyCollectionAttributes,
	validStrapifyFieldAttributes: validStrapifyFieldAttributes,
	queryStringVariables: queryStringVariables,
	getQueryStringVariables: getQueryStringVariables,
	substitueQueryStringVariables: substitueQueryStringVariables,
	modifyElmWithStrapiData: modifyElmWithStrapiData
}

export default Strapify
