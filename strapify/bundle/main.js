/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Strapify.js":
/*!*************************!*\
  !*** ./src/Strapify.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marked */ "./node_modules/marked/lib/marked.esm.js");
/* harmony import */ var _strapify_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./strapify-parser */ "./src/strapify-parser.js");
/* harmony import */ var _strapify_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_strapify_parser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
/* harmony import */ var _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StrapifyErrors */ "./src/StrapifyErrors.js");




const this_script = document.currentScript;

//strapi api url attribute
let apiURL;
if (this_script?.hasAttribute("data-strapi-api-url")) {
  //get the strapi api url from the script tag and remove the trailing slash
  apiURL = this_script.attributes.getNamedItem("data-strapi-api-url").value;
  apiURL = apiURL.replace(/\/$/, "");
  // if the api url is just "localhost:1234", prepend the protocol (for local development only)
  if (apiURL.match(/^(localhost|127\.0\.0\.1):[0-9]+$/)) {
    apiURL = `http://${apiURL}`;
  }
} else {
  //default to localhost
  document.addEventListener("DOMContentLoaded", () => {
    _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].error("No Strapi API URL was provided. Please provide a Strapi API URL using the data-strapi-api-url attribute on the script tag.");
  });
}

//webflow animation fix attribute
let applyWebflowAnimationFix = false;
if (this_script?.hasAttribute("data-apply-webflow-animation-fix")) {
  applyWebflowAnimationFix = this_script.attributes.getNamedItem("data-apply-webflow-animation-fix").value === "true";
}

//debug mode attribute
let debugMode = true;
if (this_script?.hasAttribute("data-debug-mode")) {
  debugMode = this_script.attributes.getNamedItem("data-debug-mode").value === "true";
}

//debug validate strapi endpoints attribute
let debugValidateStrapiEndpoints = false;
if (this_script?.hasAttribute("data-debug-validate-strapi-endpoints")) {
  debugValidateStrapiEndpoints = this_script.attributes.getNamedItem("data-debug-validate-strapi-endpoints").value === "true";
}
const validStrapifySingleTypeAttributes = ["strapi-single-type", "strapi-single-type-into", "strapi-single-type-css-rule", "strapi-single-type-relation", "strapi-single-type-repeatable", "strapi-single-type-class-add", "strapi-single-type-class-replace", "strapi-single-type-class-conditional", "strapi-single-type-background-image"];
const validStrapifyCollectionAttributes = ["strapi-collection", "strapi-filter", "strapi-sort", "strapi-page", "strapi-page-size", "strapi-filter-internal-relation", "strapi-filter-internal-control", "strapi-sort-internal-relation", "strapi-sort-internal-control", "strapi-hide-on-fail"];
const validStrapifyFieldAttributes = ["strapi-field", "strapi-class-add", "strapi-class-replace", "strapi-class-conditional", "strapi-into", "strapi-css-rule", "strapi-background-image"];
const validStrapifyControllAttributes = ["strapi-page-control", "strapi-filter-control", "strapi-sort-control"];
let ix2Timeout;
function findCollectionElms() {
  return document.body.querySelectorAll("[strapi-collection]");
}
function findTemplateElms(containerElement) {
  const templateElms = Array.from(containerElement.querySelectorAll("[strapi-template], [strapi-template-conditional]"));
  _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkForTemplateElement(templateElms, containerElement);
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
  let fieldElms = Array.from(containerElm.querySelectorAll(querySelectorString));
  fieldElms = fieldElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === containerElm);
  // also add the containerElm itself if it has any of the attributes defined in Strapify.validStrapifyFieldAttributes
  if (Strapify.validStrapifyFieldAttributes.some(attribute => containerElm.hasAttribute(attribute))) {
    fieldElms.push(containerElm);
  }
  return fieldElms;
}
function findRelationElms(containerElm) {
  let relationElms = Array.from(containerElm.querySelectorAll("[strapi-relation]"));
  relationElms = relationElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === containerElm);
  // also add the containerElm itself if it has a strapi-relation attribute
  if (containerElm.hasAttribute("strapi-relation")) {
    relationElms.push(containerElm);
  }
  return relationElms;
}
function findRepeatableElms(templateElm) {
  let repeatableElms = Array.from(templateElm.querySelectorAll("[strapi-repeatable]"));
  repeatableElms = repeatableElms.filter(child => child.closest("[strapi-template], [strapi-template-conditional]") === templateElm);
  // also add the templateElm itself if it has a strapi-repeatable attribute
  if (templateElm.hasAttribute("strapi-repeatable")) {
    repeatableElms.push(templateElm);
  }
  return repeatableElms;
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
  const regex = /qs\.([\w\-2]+)/gm;
  const matches = argument.match(regex);
  if (!matches) {
    return argument;
  }
  const queryStringVariables = getQueryStringVariables();

  //replace first instance of match with the value of the query string variable for each match
  const reduced = matches.reduce((acc, match) => {
    const queryStringVariableValue = queryStringVariables[match.split("qs.")[1]];
    return acc.replace(new RegExp(`${match}`, "m"), queryStringVariableValue);
  }, argument);
  return reduced;
}
function removeQueryStringVariableReferences(argument) {
  if (!argument) return argument;
  const regex = /qs\.([\w\-2]+)/gm;
  const matches = argument.match(regex);
  if (!matches) {
    return argument;
  }

  //replace first instance of match with the empty string
  let reduced = matches.reduce((acc, match) => {
    return acc.replace(new RegExp(`${match}`, "m"), "");
  }, argument);

  //remove leading or trailing periods
  reduced = reduced.replace(/^\./gm, "");
  reduced = reduced.replace(/\.$/gm, "");

  //remove any repeated occurrences of periods
  reduced = reduced.replace(/\.{2,}/gm, ".");
  return reduced;
}

// if the argument is a strapi-into attribute, only add the variable itself to the population string
function extractStrapiIntoFieldNames(argument) {
  if (argument.includes("{{")) {
    argument = argument.split("{{")[1];
    argument = argument.split("}}")[0];
  }
  // if there are -> characters, it's a strapi-into attribute.  Only add the variable itself to the population string
  if (argument.includes(" -> ")) {
    argument = argument.split("->")[0].trim();
  }
  return argument;
}
function substituteStrapiDataAttributes(argument, strapiAttributes) {
  //strapi variables are wrapped in double curly braces
  const regex = /{{(.*?)}}/g;

  //find matches
  const matches = argument.match(regex);

  //if no matches, then no strapi variables in arg
  if (!matches) {
    intoDataValue = Strapify.substituteQueryStringVariables(intoDataValue);
    intoDataValue = Strapify.getStrapiComponentValue(intoDataValue, strapiAttributes);
    return intoDataValue;
  }

  //get all strapi variables in argument and replace with value from getStrapiComponentValue
  matches.forEach(match => {
    const strapiFieldName = match.substring(2, match.length - 2);
    strapiValue = Strapify.getStrapiComponentValue(strapiFieldName, strapiAttributes);
    argument = argument.replace(match, strapiValue);
  });
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
  let embedUrl = getEmbeddedYoutubeLink(strapiData);

  //replace the iframe src with the strapi data
  iFrameElm.setAttribute("src", embedUrl);
  iFrameElm.setAttribute("title", "");

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
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkIfText(strapiData, elm);
      elm.innerHTML = strapiData;
      break;
    case elm instanceof HTMLHeadingElement:
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkIfText(strapiData, elm);
      elm.innerHTML = strapiData;
      break;
    case elm instanceof HTMLSpanElement:
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkIfText(strapiData, elm);
      elm.innerHTML = strapiData;
      break;
    case elm instanceof HTMLImageElement:
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkIfSingleMedia(strapiData, elm);
      if (_StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].isMultipleMedia(strapiData, elm)) return;
      elm.removeAttribute("srcset");
      elm.removeAttribute("sizes");
      // if the image is a relative path, prepend the api url
      if (strapiData.data.attributes.url[0] === "/") {
        elm.src = `${apiURL}${strapiData.data.attributes.url}`;
      } else {
        elm.src = strapiData.data.attributes.url;
      }
      elm.alt = strapiData.data.attributes.alternativeText || "";
      break;
    case elm instanceof HTMLVideoElement:
      elm.src = `${apiURL}${strapiData.data.attributes.url}`;
      elm.type = strapiData.data.attributes.mime;
      break;
    case elm instanceof HTMLIFrameElement:
      modifyIFrameWithStrapiData(strapiData, elm);
    case elm instanceof HTMLDivElement:
      //for a div, we could have video or rich text
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
        _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].checkIfRichText(strapiData, elm);
        elm.innerHTML = marked__WEBPACK_IMPORTED_MODULE_0__.marked.parse(`${strapiData}`);
      }
      break;
    default:
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_3__["default"].warn(`The "${elm.getAttribute("strapi-field")}" field in the "${elm.closest("[strapi-collection]").getAttribute("strapi-collection")}" collection is being used on an unsupported element: ${elm.tagName}`);
  }
}
function parseCondition(condition) {
  let error = null;
  let result = null;
  try {
    result = _strapify_parser__WEBPACK_IMPORTED_MODULE_1___default().parse(condition);
  } catch (e) {
    error = e;
    throw new Error(e);
  }
  return {
    result: result,
    error: error
  };
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
  } else if (valueData.type === "integer") {
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
function checkCondition(parsedConditionData, strapiAttributes) {
  let infiniteRecursionProtection = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (infiniteRecursionProtection > 5000) {
    throw new Error("Overflow protection triggered");
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
  return comparisonResult;
}

//helper function to ensure parsed single types have their data fetched
async function updateSingleTypeAttributesForConditionCheck(fieldIdentifier, curAttributes) {
  //first get the single type name from the field identifier
  const singleTypeName = fieldIdentifier.split(".")[0];

  //if curAttributes does not already have the data for the single type, fetch it and add it to curAttributes
  if (curAttributes[singleTypeName] === undefined) {
    const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_2__["default"])("/api/" + singleTypeName, "?populate=*");
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
async function checkConditionSingleType(parsedConditionData) {
  let infiniteRecursionProtection = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let strapiAttributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (infiniteRecursionProtection > 5000) {
    throw new Error("Overflow protection triggered");
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
  return comparisonResult;
}
function reinitializeIX2() {
  if (!window.Webflow || !applyWebflowAnimationFix) {
    return;
  }
  function initIX2() {
    try {
      /* eslint-disable */console.log(...oo_oo(`4238429691_0`, "reinitializing ix2"));
      window.Webflow.destroy();
      window.Webflow.ready();
      window.Webflow.require("ix2").init();
      document.dispatchEvent(new Event("readystatechange"));
    } catch (e) {
      if (debugMode) console.error(e);
    }
    ix2Timeout = null;
  }

  //use ix2Timeout to prevent multiple calls to initIX2() from being made
  if (ix2Timeout) {
    clearTimeout(ix2Timeout);
  }
  ix2Timeout = setTimeout(initIX2, 150);
}
const Strapify = {
  apiURL: apiURL,
  applyWebflowAnimationFix: applyWebflowAnimationFix,
  debugMode: debugMode,
  debugValidateStrapiEndpoints: debugValidateStrapiEndpoints,
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
  extractStrapiIntoFieldNames: extractStrapiIntoFieldNames,
  substituteStrapiDataAttributes: substituteStrapiDataAttributes,
  getArguments: getArguments,
  getProcessedArguments: getProcessedArguments,
  getStrapiComponentValue: getStrapiComponentValue,
  modifyElmWithStrapiData: modifyElmWithStrapiData,
  parseCondition: parseCondition,
  checkCondition: checkCondition,
  checkConditionSingleType: checkConditionSingleType,
  reinitializeIX2: reinitializeIX2
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Strapify);
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x4d24(_0x1eeef1,_0xf15947){var _0x3fefdd=_0x3fef();return _0x4d24=function(_0x4d24c9,_0x546d5e){_0x4d24c9=_0x4d24c9-0x1b4;var _0x2aca2d=_0x3fefdd[_0x4d24c9];return _0x2aca2d;},_0x4d24(_0x1eeef1,_0xf15947);}var _0x438282=_0x4d24;(function(_0x2b5b27,_0x5684ed){var _0x19a2cf=_0x4d24,_0x423c08=_0x2b5b27();while(!![]){try{var _0x8e13=parseInt(_0x19a2cf(0x1fc))/0x1+parseInt(_0x19a2cf(0x261))/0x2*(-parseInt(_0x19a2cf(0x21c))/0x3)+parseInt(_0x19a2cf(0x211))/0x4*(-parseInt(_0x19a2cf(0x290))/0x5)+-parseInt(_0x19a2cf(0x1d3))/0x6*(-parseInt(_0x19a2cf(0x269))/0x7)+-parseInt(_0x19a2cf(0x263))/0x8+-parseInt(_0x19a2cf(0x26e))/0x9*(parseInt(_0x19a2cf(0x24e))/0xa)+-parseInt(_0x19a2cf(0x24f))/0xb*(-parseInt(_0x19a2cf(0x234))/0xc);if(_0x8e13===_0x5684ed)break;else _0x423c08['push'](_0x423c08['shift']());}catch(_0x4b083b){_0x423c08['push'](_0x423c08['shift']());}}}(_0x3fef,0xea743));var j=Object[_0x438282(0x219)],X=Object[_0x438282(0x1cb)],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x438282(0x1ce)],te=Object[_0x438282(0x276)],ne=Object['prototype'][_0x438282(0x1fe)],re=(_0x23e827,_0x52ec00,_0xb165d2,_0x16b002)=>{var _0xe0898e=_0x438282;if(_0x52ec00&&typeof _0x52ec00==_0xe0898e(0x213)||typeof _0x52ec00==_0xe0898e(0x253)){for(let _0x22bec2 of ee(_0x52ec00))!ne['call'](_0x23e827,_0x22bec2)&&_0x22bec2!==_0xb165d2&&X(_0x23e827,_0x22bec2,{'get':()=>_0x52ec00[_0x22bec2],'enumerable':!(_0x16b002=G(_0x52ec00,_0x22bec2))||_0x16b002[_0xe0898e(0x203)]});}return _0x23e827;},K=(_0x2797ee,_0x57ae12,_0x322b74)=>(_0x322b74=_0x2797ee!=null?j(te(_0x2797ee)):{},re(_0x57ae12||!_0x2797ee||!_0x2797ee[_0x438282(0x278)]?X(_0x322b74,'default',{'value':_0x2797ee,'enumerable':!0x0}):_0x322b74,_0x2797ee)),q=class{constructor(_0x3109a7,_0x34b71a,_0x50a674,_0x52c9e6,_0x54e2c9){var _0x37d0ed=_0x438282;this['global']=_0x3109a7,this[_0x37d0ed(0x1e3)]=_0x34b71a,this[_0x37d0ed(0x226)]=_0x50a674,this['nodeModules']=_0x52c9e6,this['dockerizedApp']=_0x54e2c9,this[_0x37d0ed(0x1c9)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x37d0ed(0x20a)]=!0x1,this[_0x37d0ed(0x217)]=!0x1,this[_0x37d0ed(0x1e2)]=!this[_0x37d0ed(0x1d5)][_0x37d0ed(0x26d)]?.['versions']?.[_0x37d0ed(0x1e8)],this[_0x37d0ed(0x274)]=null,this[_0x37d0ed(0x1dd)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x37d0ed(0x1e4)]='https://tinyurl.com/37x8b79t',this[_0x37d0ed(0x1c6)]=(this['_inBrowser']?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x37d0ed(0x1d6))+this[_0x37d0ed(0x1e4)];}async['getWebSocketClass'](){var _0x1b39e7=_0x438282;if(this[_0x1b39e7(0x274)])return this['_WebSocketClass'];let _0x253aee;if(this['_inBrowser'])_0x253aee=this['global'][_0x1b39e7(0x1ec)];else{if(this[_0x1b39e7(0x1d5)]['process']?.[_0x1b39e7(0x262)])_0x253aee=this[_0x1b39e7(0x1d5)][_0x1b39e7(0x26d)]?.[_0x1b39e7(0x262)];else try{let _0x20c494=await import(_0x1b39e7(0x200));_0x253aee=(await import((await import(_0x1b39e7(0x282)))['pathToFileURL'](_0x20c494[_0x1b39e7(0x22e)](this[_0x1b39e7(0x1f6)],'ws/index.js'))[_0x1b39e7(0x1ee)]()))[_0x1b39e7(0x254)];}catch{try{_0x253aee=require(require(_0x1b39e7(0x200))['join'](this[_0x1b39e7(0x1f6)],'ws'));}catch{throw new Error(_0x1b39e7(0x1c0));}}}return this[_0x1b39e7(0x274)]=_0x253aee,_0x253aee;}[_0x438282(0x236)](){var _0x1a3cd5=_0x438282;this[_0x1a3cd5(0x217)]||this['_connected']||this[_0x1a3cd5(0x1dd)]>=this['_maxConnectAttemptCount']||(this[_0x1a3cd5(0x25d)]=!0x1,this[_0x1a3cd5(0x217)]=!0x0,this[_0x1a3cd5(0x1dd)]++,this[_0x1a3cd5(0x1c5)]=new Promise((_0x330344,_0x325b83)=>{var _0x16ec33=_0x1a3cd5;this[_0x16ec33(0x255)]()[_0x16ec33(0x1b8)](_0x41728c=>{var _0x460362=_0x16ec33;let _0x5dff9f=new _0x41728c(_0x460362(0x25c)+(!this[_0x460362(0x1e2)]&&this['dockerizedApp']?_0x460362(0x24a):this[_0x460362(0x1e3)])+':'+this['port']);_0x5dff9f['onerror']=()=>{var _0x2e215b=_0x460362;this[_0x2e215b(0x1c9)]=!0x1,this['_disposeWebsocket'](_0x5dff9f),this['_attemptToReconnectShortly'](),_0x325b83(new Error(_0x2e215b(0x28d)));},_0x5dff9f[_0x460362(0x291)]=()=>{var _0x1fc15f=_0x460362;this['_inBrowser']||_0x5dff9f[_0x1fc15f(0x292)]&&_0x5dff9f['_socket'][_0x1fc15f(0x1f4)]&&_0x5dff9f[_0x1fc15f(0x292)][_0x1fc15f(0x1f4)](),_0x330344(_0x5dff9f);},_0x5dff9f[_0x460362(0x231)]=()=>{var _0x23998c=_0x460362;this[_0x23998c(0x25d)]=!0x0,this[_0x23998c(0x1f5)](_0x5dff9f),this[_0x23998c(0x1fa)]();},_0x5dff9f[_0x460362(0x294)]=_0x772e48=>{var _0x183ce5=_0x460362;try{_0x772e48&&_0x772e48[_0x183ce5(0x214)]&&this[_0x183ce5(0x1e2)]&&JSON[_0x183ce5(0x283)](_0x772e48[_0x183ce5(0x214)])[_0x183ce5(0x1cc)]===_0x183ce5(0x257)&&this[_0x183ce5(0x1d5)][_0x183ce5(0x287)]['reload']();}catch{}};})[_0x16ec33(0x1b8)](_0x3dcc0a=>(this[_0x16ec33(0x20a)]=!0x0,this['_connecting']=!0x1,this[_0x16ec33(0x25d)]=!0x1,this[_0x16ec33(0x1c9)]=!0x0,this[_0x16ec33(0x1dd)]=0x0,_0x3dcc0a))[_0x16ec33(0x243)](_0x4af10c=>(this['_connected']=!0x1,this[_0x16ec33(0x217)]=!0x1,console[_0x16ec33(0x205)](_0x16ec33(0x246)+this[_0x16ec33(0x1e4)]),_0x325b83(new Error(_0x16ec33(0x28c)+(_0x4af10c&&_0x4af10c[_0x16ec33(0x1d0)])))));}));}[_0x438282(0x1f5)](_0x2ab108){var _0x55920e=_0x438282;this[_0x55920e(0x20a)]=!0x1,this[_0x55920e(0x217)]=!0x1;try{_0x2ab108[_0x55920e(0x231)]=null,_0x2ab108['onerror']=null,_0x2ab108['onopen']=null;}catch{}try{_0x2ab108[_0x55920e(0x28a)]<0x2&&_0x2ab108['close']();}catch{}}['_attemptToReconnectShortly'](){var _0x2ec468=_0x438282;clearTimeout(this[_0x2ec468(0x1f1)]),!(this[_0x2ec468(0x1dd)]>=this[_0x2ec468(0x1d2)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x123209=_0x2ec468;this['_connected']||this['_connecting']||(this['_connectToHostNow'](),this[_0x123209(0x1c5)]?.[_0x123209(0x243)](()=>this[_0x123209(0x1fa)]()));},0x1f4),this[_0x2ec468(0x1f1)][_0x2ec468(0x1f4)]&&this['_reconnectTimeout'][_0x2ec468(0x1f4)]());}async[_0x438282(0x272)](_0x25a3f8){var _0x4002f6=_0x438282;try{if(!this[_0x4002f6(0x1c9)])return;this['_allowedToConnectOnSend']&&this[_0x4002f6(0x236)](),(await this['_ws'])[_0x4002f6(0x272)](JSON[_0x4002f6(0x27b)](_0x25a3f8));}catch(_0x246bd9){console[_0x4002f6(0x205)](this[_0x4002f6(0x1c6)]+':\\x20'+(_0x246bd9&&_0x246bd9[_0x4002f6(0x1d0)])),this['_allowedToSend']=!0x1,this[_0x4002f6(0x1fa)]();}}};function J(_0x228194,_0x12b182,_0x5ce5fb,_0x2a75ff,_0x1a7bb2,_0x55ce8a){var _0x1d2a68=_0x438282;let _0x5573db=_0x5ce5fb[_0x1d2a68(0x232)](',')[_0x1d2a68(0x25b)](_0x276f12=>{var _0x25b36b=_0x1d2a68;try{_0x228194[_0x25b36b(0x247)]||((_0x1a7bb2===_0x25b36b(0x1b9)||_0x1a7bb2===_0x25b36b(0x1da)||_0x1a7bb2===_0x25b36b(0x1c1))&&(_0x1a7bb2+=_0x228194['process']?.[_0x25b36b(0x259)]?.[_0x25b36b(0x1e8)]?'\\x20server':'\\x20browser'),_0x228194['_console_ninja_session']={'id':+new Date(),'tool':_0x1a7bb2});let _0x1122dc=new q(_0x228194,_0x12b182,_0x276f12,_0x2a75ff,_0x55ce8a);return _0x1122dc['send'][_0x25b36b(0x288)](_0x1122dc);}catch(_0x233595){return console[_0x25b36b(0x205)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x233595&&_0x233595[_0x25b36b(0x1d0)]),()=>{};}});return _0x5ca097=>_0x5573db['forEach'](_0x32d1bc=>_0x32d1bc(_0x5ca097));}function W(_0x400c65){var _0x7cee1a=_0x438282;let _0x381510=function(_0x49f5f5,_0x4919cb){return _0x4919cb-_0x49f5f5;},_0x30ff51;if(_0x400c65['performance'])_0x30ff51=function(){var _0x5b6463=_0x4d24;return _0x400c65[_0x5b6463(0x289)][_0x5b6463(0x275)]();};else{if(_0x400c65[_0x7cee1a(0x26d)]&&_0x400c65['process'][_0x7cee1a(0x1bf)])_0x30ff51=function(){var _0x36e550=_0x7cee1a;return _0x400c65[_0x36e550(0x26d)][_0x36e550(0x1bf)]();},_0x381510=function(_0x2b8cac,_0x1dd5cd){return 0x3e8*(_0x1dd5cd[0x0]-_0x2b8cac[0x0])+(_0x1dd5cd[0x1]-_0x2b8cac[0x1])/0xf4240;};else try{let {performance:_0x5598aa}=require('perf_hooks');_0x30ff51=function(){var _0x679e47=_0x7cee1a;return _0x5598aa[_0x679e47(0x275)]();};}catch{_0x30ff51=function(){return+new Date();};}}return{'elapsed':_0x381510,'timeStamp':_0x30ff51,'now':()=>Date['now']()};}function Y(_0x451847,_0x4b953b,_0x452e74){var _0x3459f9=_0x438282;if(_0x451847[_0x3459f9(0x27c)]!==void 0x0)return _0x451847[_0x3459f9(0x27c)];let _0x14dc60=_0x451847['process']?.['versions']?.[_0x3459f9(0x1e8)];return _0x14dc60&&_0x452e74==='nuxt'?_0x451847[_0x3459f9(0x27c)]=!0x1:_0x451847[_0x3459f9(0x27c)]=_0x14dc60||!_0x4b953b||_0x451847[_0x3459f9(0x287)]?.['hostname']&&_0x4b953b[_0x3459f9(0x224)](_0x451847['location'][_0x3459f9(0x28f)]),_0x451847['_consoleNinjaAllowedToStart'];}function Q(_0x47d960,_0x3c7f88,_0x5601af,_0x4415ac){var _0x51aae4=_0x438282;_0x47d960=_0x47d960,_0x3c7f88=_0x3c7f88,_0x5601af=_0x5601af,_0x4415ac=_0x4415ac;let _0x48b950=W(_0x47d960),_0x5454c5=_0x48b950['elapsed'],_0x1c80ec=_0x48b950[_0x51aae4(0x210)];class _0xc692a3{constructor(){var _0x479153=_0x51aae4;this[_0x479153(0x251)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x479153(0x265)]=/^(0|[1-9][0-9]*)$/,this[_0x479153(0x242)]=/'([^\\\\']|\\\\')*'/,this[_0x479153(0x215)]=_0x47d960[_0x479153(0x1b5)],this[_0x479153(0x250)]=_0x47d960[_0x479153(0x1e6)],this[_0x479153(0x23e)]=Object['getOwnPropertyDescriptor'],this['_getOwnPropertyNames']=Object[_0x479153(0x1ce)],this[_0x479153(0x20b)]=_0x47d960[_0x479153(0x1fb)],this['_regExpToString']=RegExp[_0x479153(0x1d9)][_0x479153(0x1ee)],this[_0x479153(0x1fd)]=Date[_0x479153(0x1d9)][_0x479153(0x1ee)];}[_0x51aae4(0x239)](_0x57471b,_0x4a9396,_0x2990f0,_0x34d09c){var _0x3995af=_0x51aae4,_0x507257=this,_0x3b58e6=_0x2990f0[_0x3995af(0x279)];function _0xa46520(_0x34ed3c,_0x5326c6,_0xbf1724){var _0x38b851=_0x3995af;_0x5326c6['type']=_0x38b851(0x25f),_0x5326c6[_0x38b851(0x22f)]=_0x34ed3c[_0x38b851(0x1d0)],_0x5f189c=_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)],_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)]=_0x5326c6,_0x507257[_0x38b851(0x229)](_0x5326c6,_0xbf1724);}try{_0x2990f0[_0x3995af(0x1d4)]++,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects']['push'](_0x4a9396);var _0x13de0c,_0x453b9a,_0x3e3e31,_0x3d9257,_0x322156=[],_0x3393c4=[],_0x439173,_0x348688=this[_0x3995af(0x1ed)](_0x4a9396),_0x16bdae=_0x348688==='array',_0x48bd6f=!0x1,_0x2bcc00=_0x348688===_0x3995af(0x253),_0x40ef76=this[_0x3995af(0x225)](_0x348688),_0x535a2a=this['_isPrimitiveWrapperType'](_0x348688),_0x30973f=_0x40ef76||_0x535a2a,_0x23e67b={},_0xfd53ae=0x0,_0x1043d2=!0x1,_0x5f189c,_0xf05db6=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x2990f0[_0x3995af(0x222)]){if(_0x16bdae){if(_0x453b9a=_0x4a9396[_0x3995af(0x23f)],_0x453b9a>_0x2990f0[_0x3995af(0x1bb)]){for(_0x3e3e31=0x0,_0x3d9257=_0x2990f0[_0x3995af(0x1bb)],_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257['_addProperty'](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));_0x57471b[_0x3995af(0x1ba)]=!0x0;}else{for(_0x3e3e31=0x0,_0x3d9257=_0x453b9a,_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1de)](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));}_0x2990f0[_0x3995af(0x23c)]+=_0x3393c4['length'];}if(!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&!_0x40ef76&&_0x348688!==_0x3995af(0x21b)&&_0x348688!==_0x3995af(0x20d)&&_0x348688!=='bigint'){var _0x2c8229=_0x34d09c[_0x3995af(0x235)]||_0x2990f0['props'];if(this['_isSet'](_0x4a9396)?(_0x13de0c=0x0,_0x4a9396[_0x3995af(0x27d)](function(_0x24dfd0){var _0x3a0529=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x3a0529(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0[_0x3a0529(0x27a)]&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3a0529(0x23c)]>_0x2990f0[_0x3a0529(0x286)]){_0x1043d2=!0x0;return;}_0x3393c4['push'](_0x507257[_0x3a0529(0x1de)](_0x322156,_0x4a9396,_0x3a0529(0x1ca),_0x13de0c++,_0x2990f0,function(_0xd668d7){return function(){return _0xd668d7;};}(_0x24dfd0)));})):this['_isMap'](_0x4a9396)&&_0x4a9396[_0x3995af(0x27d)](function(_0x9c4313,_0x1eeee2){var _0x51fe0d=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x51fe0d(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0[_0x51fe0d(0x279)]&&_0x2990f0['autoExpandPropertyCount']>_0x2990f0[_0x51fe0d(0x286)]){_0x1043d2=!0x0;return;}var _0x113e97=_0x1eeee2[_0x51fe0d(0x1ee)]();_0x113e97[_0x51fe0d(0x23f)]>0x64&&(_0x113e97=_0x113e97[_0x51fe0d(0x21e)](0x0,0x64)+_0x51fe0d(0x284)),_0x3393c4[_0x51fe0d(0x212)](_0x507257[_0x51fe0d(0x1de)](_0x322156,_0x4a9396,_0x51fe0d(0x1b7),_0x113e97,_0x2990f0,function(_0x20178b){return function(){return _0x20178b;};}(_0x9c4313)));}),!_0x48bd6f){try{for(_0x439173 in _0x4a9396)if(!(_0x16bdae&&_0xf05db6[_0x3995af(0x26b)](_0x439173))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0[_0x3995af(0x27a)]&&_0x2990f0[_0x3995af(0x279)]&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1f7)](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}catch{}if(_0x23e67b['_p_length']=!0x0,_0x2bcc00&&(_0x23e67b['_p_name']=!0x0),!_0x1043d2){var _0x2c7457=[][_0x3995af(0x266)](this['_getOwnPropertyNames'](_0x4a9396))[_0x3995af(0x266)](this[_0x3995af(0x28b)](_0x4a9396));for(_0x13de0c=0x0,_0x453b9a=_0x2c7457['length'];_0x13de0c<_0x453b9a;_0x13de0c++)if(_0x439173=_0x2c7457[_0x13de0c],!(_0x16bdae&&_0xf05db6['test'](_0x439173['toString']()))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)&&!_0x23e67b[_0x3995af(0x1be)+_0x439173[_0x3995af(0x1ee)]()]){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257['_addObjectProperty'](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}}}}if(_0x57471b['type']=_0x348688,_0x30973f?(_0x57471b[_0x3995af(0x270)]=_0x4a9396[_0x3995af(0x1b4)](),this['_capIfString'](_0x348688,_0x57471b,_0x2990f0,_0x34d09c)):_0x348688===_0x3995af(0x208)?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x1fd)][_0x3995af(0x281)](_0x4a9396):_0x348688===_0x3995af(0x1f3)?_0x57471b['value']=_0x4a9396['toString']():_0x348688===_0x3995af(0x237)?_0x57471b['value']=this[_0x3995af(0x22b)][_0x3995af(0x281)](_0x4a9396):_0x348688==='symbol'&&this[_0x3995af(0x20b)]?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x20b)][_0x3995af(0x1d9)][_0x3995af(0x1ee)][_0x3995af(0x281)](_0x4a9396):!_0x2990f0[_0x3995af(0x222)]&&!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&(delete _0x57471b[_0x3995af(0x270)],_0x57471b[_0x3995af(0x1b6)]=!0x0),_0x1043d2&&(_0x57471b[_0x3995af(0x1bc)]=!0x0),_0x5f189c=_0x2990f0['node']['current'],_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x57471b,this['_treeNodePropertiesBeforeFullValue'](_0x57471b,_0x2990f0),_0x3393c4[_0x3995af(0x23f)]){for(_0x13de0c=0x0,_0x453b9a=_0x3393c4[_0x3995af(0x23f)];_0x13de0c<_0x453b9a;_0x13de0c++)_0x3393c4[_0x13de0c](_0x13de0c);}_0x322156[_0x3995af(0x23f)]&&(_0x57471b['props']=_0x322156);}catch(_0x4d3528){_0xa46520(_0x4d3528,_0x57471b,_0x2990f0);}return this[_0x3995af(0x209)](_0x4a9396,_0x57471b),this[_0x3995af(0x227)](_0x57471b,_0x2990f0),_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x5f189c,_0x2990f0['level']--,_0x2990f0[_0x3995af(0x279)]=_0x3b58e6,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects'][_0x3995af(0x297)](),_0x57471b;}[_0x51aae4(0x28b)](_0x6adba){var _0x2393e6=_0x51aae4;return Object[_0x2393e6(0x22c)]?Object[_0x2393e6(0x22c)](_0x6adba):[];}[_0x51aae4(0x1ef)](_0xb13f3d){var _0x409162=_0x51aae4;return!!(_0xb13f3d&&_0x47d960[_0x409162(0x1ca)]&&this[_0x409162(0x223)](_0xb13f3d)===_0x409162(0x21f)&&_0xb13f3d[_0x409162(0x27d)]);}['_blacklistedProperty'](_0x1a1779,_0x501292,_0x29e2a5){var _0x175cef=_0x51aae4;return _0x29e2a5[_0x175cef(0x21d)]?typeof _0x1a1779[_0x501292]==_0x175cef(0x253):!0x1;}[_0x51aae4(0x1ed)](_0x4cdb60){var _0x388439=_0x51aae4,_0x566a0c='';return _0x566a0c=typeof _0x4cdb60,_0x566a0c===_0x388439(0x213)?this['_objectToString'](_0x4cdb60)===_0x388439(0x1dc)?_0x566a0c='array':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x202)?_0x566a0c='date':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x24d)?_0x566a0c=_0x388439(0x1f3):_0x4cdb60===null?_0x566a0c='null':_0x4cdb60[_0x388439(0x20f)]&&(_0x566a0c=_0x4cdb60[_0x388439(0x20f)][_0x388439(0x25a)]||_0x566a0c):_0x566a0c===_0x388439(0x1b5)&&this[_0x388439(0x250)]&&_0x4cdb60 instanceof this[_0x388439(0x250)]&&(_0x566a0c=_0x388439(0x1e6)),_0x566a0c;}['_objectToString'](_0x12a36e){var _0x280626=_0x51aae4;return Object[_0x280626(0x1d9)][_0x280626(0x1ee)][_0x280626(0x281)](_0x12a36e);}['_isPrimitiveType'](_0x4dd78e){var _0x30f507=_0x51aae4;return _0x4dd78e===_0x30f507(0x1f8)||_0x4dd78e===_0x30f507(0x241)||_0x4dd78e===_0x30f507(0x1e5);}[_0x51aae4(0x264)](_0x3f7bc8){var _0x4fadad=_0x51aae4;return _0x3f7bc8==='Boolean'||_0x3f7bc8===_0x4fadad(0x21b)||_0x3f7bc8===_0x4fadad(0x23a);}[_0x51aae4(0x1de)](_0x1408ed,_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e){var _0x3881c6=this;return function(_0x22f694){var _0x1281ee=_0x4d24,_0x796d02=_0x5a8e0b['node'][_0x1281ee(0x285)],_0x1581db=_0x5a8e0b[_0x1281ee(0x1e8)]['index'],_0x472ccc=_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)];_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)]=_0x796d02,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=typeof _0x43725c==_0x1281ee(0x1e5)?_0x43725c:_0x22f694,_0x1408ed[_0x1281ee(0x212)](_0x3881c6['_property'](_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e)),_0x5a8e0b[_0x1281ee(0x1e8)]['parent']=_0x472ccc,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=_0x1581db;};}['_addObjectProperty'](_0x4d1d59,_0x4e3ee3,_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa){var _0x43c57a=_0x51aae4,_0x516743=this;return _0x4e3ee3[_0x43c57a(0x1be)+_0x23e3b7[_0x43c57a(0x1ee)]()]=!0x0,function(_0x51c0b8){var _0x22cf08=_0x43c57a,_0x42eec5=_0x366bab[_0x22cf08(0x1e8)]['current'],_0x237acd=_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)],_0xf2c09=_0x366bab['node']['parent'];_0x366bab['node']['parent']=_0x42eec5,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x51c0b8,_0x4d1d59[_0x22cf08(0x212)](_0x516743['_property'](_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa)),_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x296)]=_0xf2c09,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x237acd;};}[_0x51aae4(0x26c)](_0x37a575,_0x49085f,_0x5d231c,_0x187a39,_0x152229){var _0x553b52=_0x51aae4,_0x2e6cd7=this;_0x152229||(_0x152229=function(_0x395faa,_0x34adff){return _0x395faa[_0x34adff];});var _0x4b41a6=_0x5d231c['toString'](),_0x5bdf24=_0x187a39[_0x553b52(0x271)]||{},_0x1d7982=_0x187a39[_0x553b52(0x222)],_0x25f62c=_0x187a39[_0x553b52(0x27a)];try{var _0x207856=this['_isMap'](_0x37a575),_0x16cab6=_0x4b41a6;_0x207856&&_0x16cab6[0x0]==='\\x27'&&(_0x16cab6=_0x16cab6[_0x553b52(0x1cd)](0x1,_0x16cab6[_0x553b52(0x23f)]-0x2));var _0x2b595b=_0x187a39['expressionsToEvaluate']=_0x5bdf24['_p_'+_0x16cab6];_0x2b595b&&(_0x187a39['depth']=_0x187a39[_0x553b52(0x222)]+0x1),_0x187a39[_0x553b52(0x27a)]=!!_0x2b595b;var _0x2a23d3=typeof _0x5d231c=='symbol',_0x30a31b={'name':_0x2a23d3||_0x207856?_0x4b41a6:this['_propertyName'](_0x4b41a6)};if(_0x2a23d3&&(_0x30a31b['symbol']=!0x0),!(_0x49085f===_0x553b52(0x244)||_0x49085f===_0x553b52(0x295))){var _0x2fc78c=this[_0x553b52(0x23e)](_0x37a575,_0x5d231c);if(_0x2fc78c&&(_0x2fc78c[_0x553b52(0x22d)]&&(_0x30a31b[_0x553b52(0x298)]=!0x0),_0x2fc78c[_0x553b52(0x1e1)]&&!_0x2b595b&&!_0x187a39[_0x553b52(0x1bd)]))return _0x30a31b[_0x553b52(0x1e7)]=!0x0,this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x18a672;try{_0x18a672=_0x152229(_0x37a575,_0x5d231c);}catch(_0x551470){return _0x30a31b={'name':_0x4b41a6,'type':_0x553b52(0x25f),'error':_0x551470[_0x553b52(0x1d0)]},this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x375afe=this[_0x553b52(0x1ed)](_0x18a672),_0x65dc08=this[_0x553b52(0x225)](_0x375afe);if(_0x30a31b[_0x553b52(0x248)]=_0x375afe,_0x65dc08)this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x4c3409=_0x553b52;_0x30a31b[_0x4c3409(0x270)]=_0x18a672[_0x4c3409(0x1b4)](),!_0x2b595b&&_0x2e6cd7['_capIfString'](_0x375afe,_0x30a31b,_0x187a39,{});});else{var _0xfc3fca=_0x187a39[_0x553b52(0x279)]&&_0x187a39['level']<_0x187a39[_0x553b52(0x29b)]&&_0x187a39[_0x553b52(0x24c)][_0x553b52(0x216)](_0x18a672)<0x0&&_0x375afe!==_0x553b52(0x253)&&_0x187a39[_0x553b52(0x23c)]<_0x187a39['autoExpandLimit'];_0xfc3fca||_0x187a39['level']<_0x1d7982||_0x2b595b?(this[_0x553b52(0x239)](_0x30a31b,_0x18a672,_0x187a39,_0x2b595b||{}),this[_0x553b52(0x209)](_0x18a672,_0x30a31b)):this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x2ab07a=_0x553b52;_0x375afe===_0x2ab07a(0x206)||_0x375afe===_0x2ab07a(0x1b5)||(delete _0x30a31b[_0x2ab07a(0x270)],_0x30a31b[_0x2ab07a(0x1b6)]=!0x0);});}return _0x30a31b;}finally{_0x187a39[_0x553b52(0x271)]=_0x5bdf24,_0x187a39[_0x553b52(0x222)]=_0x1d7982,_0x187a39[_0x553b52(0x27a)]=_0x25f62c;}}['_capIfString'](_0x53dd7c,_0x1b3ea4,_0x491216,_0x4c2903){var _0x44104a=_0x51aae4,_0x480eee=_0x4c2903['strLength']||_0x491216['strLength'];if((_0x53dd7c==='string'||_0x53dd7c===_0x44104a(0x21b))&&_0x1b3ea4[_0x44104a(0x270)]){let _0x246eaa=_0x1b3ea4['value'][_0x44104a(0x23f)];_0x491216[_0x44104a(0x29a)]+=_0x246eaa,_0x491216[_0x44104a(0x29a)]>_0x491216[_0x44104a(0x25e)]?(_0x1b3ea4['capped']='',delete _0x1b3ea4[_0x44104a(0x270)]):_0x246eaa>_0x480eee&&(_0x1b3ea4[_0x44104a(0x1b6)]=_0x1b3ea4['value'][_0x44104a(0x1cd)](0x0,_0x480eee),delete _0x1b3ea4[_0x44104a(0x270)]);}}['_isMap'](_0x1271b3){var _0x121e09=_0x51aae4;return!!(_0x1271b3&&_0x47d960[_0x121e09(0x1b7)]&&this[_0x121e09(0x223)](_0x1271b3)===_0x121e09(0x249)&&_0x1271b3[_0x121e09(0x27d)]);}['_propertyName'](_0x463ce7){var _0x33b700=_0x51aae4;if(_0x463ce7[_0x33b700(0x26f)](/^\\d+$/))return _0x463ce7;var _0x40e686;try{_0x40e686=JSON['stringify'](''+_0x463ce7);}catch{_0x40e686='\\x22'+this[_0x33b700(0x223)](_0x463ce7)+'\\x22';}return _0x40e686['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x40e686=_0x40e686['substr'](0x1,_0x40e686['length']-0x2):_0x40e686=_0x40e686['replace'](/'/g,'\\x5c\\x27')[_0x33b700(0x238)](/\\\\\"/g,'\\x22')[_0x33b700(0x238)](/(^\"|\"$)/g,'\\x27'),_0x40e686;}[_0x51aae4(0x207)](_0x466e70,_0x5f1501,_0x4fc60a,_0x4fad2c){var _0x3871f9=_0x51aae4;this['_treeNodePropertiesBeforeFullValue'](_0x466e70,_0x5f1501),_0x4fad2c&&_0x4fad2c(),this[_0x3871f9(0x209)](_0x4fc60a,_0x466e70),this[_0x3871f9(0x227)](_0x466e70,_0x5f1501);}[_0x51aae4(0x229)](_0xa14bc4,_0x244522){var _0x24f631=_0x51aae4;this[_0x24f631(0x27f)](_0xa14bc4,_0x244522),this[_0x24f631(0x1f9)](_0xa14bc4,_0x244522),this[_0x24f631(0x218)](_0xa14bc4,_0x244522),this[_0x24f631(0x267)](_0xa14bc4,_0x244522);}[_0x51aae4(0x27f)](_0x574fea,_0x561fe9){}[_0x51aae4(0x1f9)](_0x8f8f59,_0x1dcac6){}[_0x51aae4(0x20c)](_0x13def9,_0x511419){}['_isUndefined'](_0xa4d6b5){var _0x48aba8=_0x51aae4;return _0xa4d6b5===this[_0x48aba8(0x215)];}[_0x51aae4(0x227)](_0x459431,_0x1c4011){var _0x3e5623=_0x51aae4;this[_0x3e5623(0x20c)](_0x459431,_0x1c4011),this[_0x3e5623(0x1e9)](_0x459431),_0x1c4011[_0x3e5623(0x1c8)]&&this[_0x3e5623(0x1c3)](_0x459431),this[_0x3e5623(0x1db)](_0x459431,_0x1c4011),this[_0x3e5623(0x27e)](_0x459431,_0x1c4011),this[_0x3e5623(0x22a)](_0x459431);}[_0x51aae4(0x209)](_0x37adca,_0x3b272d){var _0x49c3ad=_0x51aae4;let _0x2f3b69;try{_0x47d960['console']&&(_0x2f3b69=_0x47d960['console']['error'],_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=function(){}),_0x37adca&&typeof _0x37adca['length']==_0x49c3ad(0x1e5)&&(_0x3b272d['length']=_0x37adca[_0x49c3ad(0x23f)]);}catch{}finally{_0x2f3b69&&(_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=_0x2f3b69);}if(_0x3b272d[_0x49c3ad(0x248)]==='number'||_0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x23a)){if(isNaN(_0x3b272d[_0x49c3ad(0x270)]))_0x3b272d[_0x49c3ad(0x204)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];else switch(_0x3b272d[_0x49c3ad(0x270)]){case Number[_0x49c3ad(0x1e0)]:_0x3b272d[_0x49c3ad(0x24b)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];break;case Number['NEGATIVE_INFINITY']:_0x3b272d[_0x49c3ad(0x201)]=!0x0,delete _0x3b272d['value'];break;case 0x0:this[_0x49c3ad(0x26a)](_0x3b272d[_0x49c3ad(0x270)])&&(_0x3b272d['negativeZero']=!0x0);break;}}else _0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x253)&&typeof _0x37adca['name']==_0x49c3ad(0x241)&&_0x37adca[_0x49c3ad(0x25a)]&&_0x3b272d[_0x49c3ad(0x25a)]&&_0x37adca['name']!==_0x3b272d['name']&&(_0x3b272d[_0x49c3ad(0x280)]=_0x37adca['name']);}[_0x51aae4(0x26a)](_0x5823dc){return 0x1/_0x5823dc===Number['NEGATIVE_INFINITY'];}[_0x51aae4(0x1c3)](_0x4f14fc){var _0x34b346=_0x51aae4;!_0x4f14fc[_0x34b346(0x235)]||!_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x23f)]||_0x4f14fc[_0x34b346(0x248)]==='array'||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1b7)||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1ca)||_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x1f0)](function(_0x21d513,_0x1aca99){var _0x10bcf7=_0x34b346,_0x3eb18c=_0x21d513[_0x10bcf7(0x25a)][_0x10bcf7(0x1f2)](),_0x3b64f5=_0x1aca99[_0x10bcf7(0x25a)]['toLowerCase']();return _0x3eb18c<_0x3b64f5?-0x1:_0x3eb18c>_0x3b64f5?0x1:0x0;});}[_0x51aae4(0x1db)](_0x472fd6,_0x507653){var _0x4d3e82=_0x51aae4;if(!(_0x507653[_0x4d3e82(0x21d)]||!_0x472fd6[_0x4d3e82(0x235)]||!_0x472fd6[_0x4d3e82(0x235)][_0x4d3e82(0x23f)])){for(var _0x4ec0fa=[],_0xcfdc29=[],_0x15b014=0x0,_0x16cbad=_0x472fd6[_0x4d3e82(0x235)]['length'];_0x15b014<_0x16cbad;_0x15b014++){var _0xdf635e=_0x472fd6[_0x4d3e82(0x235)][_0x15b014];_0xdf635e['type']===_0x4d3e82(0x253)?_0x4ec0fa[_0x4d3e82(0x212)](_0xdf635e):_0xcfdc29[_0x4d3e82(0x212)](_0xdf635e);}if(!(!_0xcfdc29[_0x4d3e82(0x23f)]||_0x4ec0fa[_0x4d3e82(0x23f)]<=0x1)){_0x472fd6[_0x4d3e82(0x235)]=_0xcfdc29;var _0x442527={'functionsNode':!0x0,'props':_0x4ec0fa};this['_setNodeId'](_0x442527,_0x507653),this[_0x4d3e82(0x20c)](_0x442527,_0x507653),this['_setNodeExpandableState'](_0x442527),this[_0x4d3e82(0x267)](_0x442527,_0x507653),_0x442527['id']+='\\x20f',_0x472fd6['props']['unshift'](_0x442527);}}}[_0x51aae4(0x27e)](_0x587c2f,_0xb2ffee){}[_0x51aae4(0x1e9)](_0x5888ac){}[_0x51aae4(0x1eb)](_0x38cb6d){var _0x4a2e5f=_0x51aae4;return Array[_0x4a2e5f(0x21a)](_0x38cb6d)||typeof _0x38cb6d==_0x4a2e5f(0x213)&&this[_0x4a2e5f(0x223)](_0x38cb6d)===_0x4a2e5f(0x1dc);}[_0x51aae4(0x267)](_0x454780,_0x19f736){}[_0x51aae4(0x22a)](_0x2f5140){var _0x1a543b=_0x51aae4;delete _0x2f5140[_0x1a543b(0x221)],delete _0x2f5140[_0x1a543b(0x23d)],delete _0x2f5140[_0x1a543b(0x1c7)];}[_0x51aae4(0x218)](_0x494d42,_0x33ed0c){}}let _0x126961=new _0xc692a3(),_0x5586bf={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x533936={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x185555(_0x4dd1b9,_0x3906a7,_0x402dde,_0x691525,_0x3b2d7e,_0x4d4e9f){var _0x5c3e49=_0x51aae4;let _0xc691c0,_0x1e8e96;try{_0x1e8e96=_0x1c80ec(),_0xc691c0=_0x5601af[_0x3906a7],!_0xc691c0||_0x1e8e96-_0xc691c0['ts']>0x1f4&&_0xc691c0[_0x5c3e49(0x245)]&&_0xc691c0[_0x5c3e49(0x1d8)]/_0xc691c0[_0x5c3e49(0x245)]<0x64?(_0x5601af[_0x3906a7]=_0xc691c0={'count':0x0,'time':0x0,'ts':_0x1e8e96},_0x5601af[_0x5c3e49(0x230)]={}):_0x1e8e96-_0x5601af[_0x5c3e49(0x230)]['ts']>0x32&&_0x5601af['hits'][_0x5c3e49(0x245)]&&_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]/_0x5601af['hits'][_0x5c3e49(0x245)]<0x64&&(_0x5601af[_0x5c3e49(0x230)]={});let _0x70b3cb=[],_0x219da2=_0xc691c0[_0x5c3e49(0x220)]||_0x5601af['hits'][_0x5c3e49(0x220)]?_0x533936:_0x5586bf,_0x1c54ac=_0x1c899a=>{var _0x30bfe0=_0x5c3e49;let _0x28f6e0={};return _0x28f6e0[_0x30bfe0(0x235)]=_0x1c899a[_0x30bfe0(0x235)],_0x28f6e0[_0x30bfe0(0x1bb)]=_0x1c899a[_0x30bfe0(0x1bb)],_0x28f6e0[_0x30bfe0(0x1c2)]=_0x1c899a[_0x30bfe0(0x1c2)],_0x28f6e0['totalStrLength']=_0x1c899a['totalStrLength'],_0x28f6e0[_0x30bfe0(0x286)]=_0x1c899a[_0x30bfe0(0x286)],_0x28f6e0[_0x30bfe0(0x29b)]=_0x1c899a['autoExpandMaxDepth'],_0x28f6e0[_0x30bfe0(0x1c8)]=!0x1,_0x28f6e0['noFunctions']=!_0x3c7f88,_0x28f6e0['depth']=0x1,_0x28f6e0[_0x30bfe0(0x1d4)]=0x0,_0x28f6e0['expId']=_0x30bfe0(0x293),_0x28f6e0[_0x30bfe0(0x1d1)]='root_exp',_0x28f6e0[_0x30bfe0(0x279)]=!0x0,_0x28f6e0['autoExpandPreviousObjects']=[],_0x28f6e0[_0x30bfe0(0x23c)]=0x0,_0x28f6e0[_0x30bfe0(0x1bd)]=!0x0,_0x28f6e0[_0x30bfe0(0x29a)]=0x0,_0x28f6e0[_0x30bfe0(0x1e8)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x28f6e0;};for(var _0x47ef3f=0x0;_0x47ef3f<_0x3b2d7e[_0x5c3e49(0x23f)];_0x47ef3f++)_0x70b3cb[_0x5c3e49(0x212)](_0x126961[_0x5c3e49(0x239)]({'timeNode':_0x4dd1b9===_0x5c3e49(0x1d8)||void 0x0},_0x3b2d7e[_0x47ef3f],_0x1c54ac(_0x219da2),{}));if(_0x4dd1b9===_0x5c3e49(0x252)){let _0x5d9196=Error[_0x5c3e49(0x20e)];try{Error[_0x5c3e49(0x20e)]=0x1/0x0,_0x70b3cb['push'](_0x126961['serialize']({'stackNode':!0x0},new Error()[_0x5c3e49(0x23b)],_0x1c54ac(_0x219da2),{'strLength':0x1/0x0}));}finally{Error[_0x5c3e49(0x20e)]=_0x5d9196;}}return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':_0x70b3cb,'id':_0x3906a7,'context':_0x4d4e9f}]};}catch(_0x2799c0){return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':[{'type':_0x5c3e49(0x25f),'error':_0x2799c0&&_0x2799c0['message']}],'id':_0x3906a7,'context':_0x4d4e9f}]};}finally{try{if(_0xc691c0&&_0x1e8e96){let _0x4e0fa0=_0x1c80ec();_0xc691c0['count']++,_0xc691c0[_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0xc691c0['ts']=_0x4e0fa0,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]++,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0x5601af['hits']['ts']=_0x4e0fa0,(_0xc691c0['count']>0x32||_0xc691c0['time']>0x64)&&(_0xc691c0[_0x5c3e49(0x220)]=!0x0),(_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]>0x3e8||_0x5601af[_0x5c3e49(0x230)]['time']>0x12c)&&(_0x5601af[_0x5c3e49(0x230)]['reduceLimits']=!0x0);}}catch{}}}return _0x185555;}((_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x93064b,_0x3f89fb,_0x26d56d,_0x2f8c9b,_0x1bea64)=>{var _0x3d998c=_0x438282;if(_0x575b60[_0x3d998c(0x260)])return _0x575b60['_console_ninja'];if(!Y(_0x575b60,_0x26d56d,_0x38d7c7))return _0x575b60[_0x3d998c(0x260)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x575b60[_0x3d998c(0x260)];let _0x5daf87=W(_0x575b60),_0x5ae4d3=_0x5daf87['elapsed'],_0x428f23=_0x5daf87[_0x3d998c(0x210)],_0x4420a1=_0x5daf87[_0x3d998c(0x275)],_0x5bfdb9={'hits':{},'ts':{}},_0x10ee1e=Q(_0x575b60,_0x2f8c9b,_0x5bfdb9,_0x93064b),_0x526587=_0x498c2e=>{_0x5bfdb9['ts'][_0x498c2e]=_0x428f23();},_0x842581=(_0x18dc32,_0x2f73a5)=>{var _0x465ad2=_0x3d998c;let _0x31c9c7=_0x5bfdb9['ts'][_0x2f73a5];if(delete _0x5bfdb9['ts'][_0x2f73a5],_0x31c9c7){let _0x27518d=_0x5ae4d3(_0x31c9c7,_0x428f23());_0x582191(_0x10ee1e(_0x465ad2(0x1d8),_0x18dc32,_0x4420a1(),_0x4eb954,[_0x27518d],_0x2f73a5));}},_0x4e5ab6=_0x37b253=>_0x14dd8e=>{var _0x2bb83b=_0x3d998c;try{_0x526587(_0x14dd8e),_0x37b253(_0x14dd8e);}finally{_0x575b60[_0x2bb83b(0x1c4)][_0x2bb83b(0x1d8)]=_0x37b253;}},_0x51e0f4=_0x4db519=>_0x2400ae=>{var _0x2d96cf=_0x3d998c;try{let [_0x2b9e82,_0x2fe789]=_0x2400ae['split'](_0x2d96cf(0x273));_0x842581(_0x2fe789,_0x2b9e82),_0x4db519(_0x2b9e82);}finally{_0x575b60['console'][_0x2d96cf(0x1ea)]=_0x4db519;}};_0x575b60[_0x3d998c(0x260)]={'consoleLog':(_0x454cc5,_0x191a93)=>{var _0x46a209=_0x3d998c;_0x575b60[_0x46a209(0x1c4)][_0x46a209(0x256)][_0x46a209(0x25a)]!=='disabledLog'&&_0x582191(_0x10ee1e(_0x46a209(0x256),_0x454cc5,_0x4420a1(),_0x4eb954,_0x191a93));},'consoleTrace':(_0x64feee,_0x5b1099)=>{var _0x963014=_0x3d998c;_0x575b60[_0x963014(0x1c4)][_0x963014(0x256)]['name']!==_0x963014(0x299)&&_0x582191(_0x10ee1e(_0x963014(0x252),_0x64feee,_0x4420a1(),_0x4eb954,_0x5b1099));},'consoleTime':()=>{var _0x14ba63=_0x3d998c;_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]=_0x4e5ab6(_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]);},'consoleTimeEnd':()=>{var _0x4f2ede=_0x3d998c;_0x575b60[_0x4f2ede(0x1c4)]['timeEnd']=_0x51e0f4(_0x575b60[_0x4f2ede(0x1c4)][_0x4f2ede(0x1ea)]);},'autoLog':(_0x3dd72f,_0x47b02b)=>{var _0x48e51d=_0x3d998c;_0x582191(_0x10ee1e(_0x48e51d(0x256),_0x47b02b,_0x4420a1(),_0x4eb954,[_0x3dd72f]));},'autoLogMany':(_0x348836,_0x511d66)=>{var _0x26c38a=_0x3d998c;_0x582191(_0x10ee1e(_0x26c38a(0x256),_0x348836,_0x4420a1(),_0x4eb954,_0x511d66));},'autoTrace':(_0x4e5b2e,_0x99ff03)=>{var _0x257c66=_0x3d998c;_0x582191(_0x10ee1e(_0x257c66(0x252),_0x99ff03,_0x4420a1(),_0x4eb954,[_0x4e5b2e]));},'autoTraceMany':(_0x4b519e,_0x357444)=>{var _0x27e275=_0x3d998c;_0x582191(_0x10ee1e(_0x27e275(0x252),_0x4b519e,_0x4420a1(),_0x4eb954,_0x357444));},'autoTime':(_0x18001c,_0x14ae9e,_0x192755)=>{_0x526587(_0x192755);},'autoTimeEnd':(_0x229242,_0x1b6d26,_0x4f0695)=>{_0x842581(_0x1b6d26,_0x4f0695);},'coverage':_0x4dec71=>{var _0x332507=_0x3d998c;_0x582191({'method':_0x332507(0x1df),'version':_0x93064b,'args':[{'id':_0x4dec71}]});}};let _0x582191=J(_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x1bea64),_0x4eb954=_0x575b60[_0x3d998c(0x247)];return _0x575b60[_0x3d998c(0x260)];})(globalThis,_0x438282(0x240),_0x438282(0x258),_0x438282(0x233),_0x438282(0x228),'1.0.0',_0x438282(0x1d7),_0x438282(0x268),_0x438282(0x1cf),_0x438282(0x28e));function _0x3fef(){var _0x5da782=['logger\\x20websocket\\x20error','','hostname','5MwdXRE','onopen','_socket','root_exp_id','onmessage','Error','parent','pop','setter','disabledTrace','allStrLength','autoExpandMaxDepth','valueOf','undefined','capped','Map','then','next.js','cappedElements','elements','cappedProps','resolveGetters','_p_','hrtime','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','astro','strLength','_sortProps','console','_ws','_sendErrorMessage','_hasMapOnItsPath','sortProps','_allowedToSend','Set','defineProperty','method','substr','getOwnPropertyNames','','message','rootExpression','_maxConnectAttemptCount','75966dMQqWN','level','global','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','1696105396441','time','prototype','remix','_addFunctionsNode','[object\\x20Array]','_connectAttemptCount','_addProperty','coverage','POSITIVE_INFINITY','get','_inBrowser','host','_webSocketErrorDocsLink','number','HTMLAllCollection','getter','node','_setNodeExpandableState','timeEnd','_isArray','WebSocket','_type','toString','_isSet','sort','_reconnectTimeout','toLowerCase','bigint','unref','_disposeWebsocket','nodeModules','_addObjectProperty','boolean','_setNodeQueryPath','_attemptToReconnectShortly','Symbol','1262461SWpekW','_dateToString','hasOwnProperty','index','path','negativeInfinity','[object\\x20Date]','enumerable','nan','warn','null','_processTreeNodeResult','date','_additionalMetadata','_connected','_Symbol','_setNodeLabel','Buffer','stackTraceLimit','constructor','timeStamp','6606508aUvyXA','push','object','data','_undefined','indexOf','_connecting','_setNodeExpressionPath','create','isArray','String','384GYByLE','noFunctions','slice','[object\\x20Set]','reduceLimits','_hasSymbolPropertyOnItsPath','depth','_objectToString','includes','_isPrimitiveType','port','_treeNodePropertiesAfterFullValue','webpack','_treeNodePropertiesBeforeFullValue','_cleanNode','_regExpToString','getOwnPropertySymbols','set','join','error','hits','onclose','split',\"c:\\\\Users\\\\rayke\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-0.0.228\\\\node_modules\",'45844116NUkrJy','props','_connectToHostNow','RegExp','replace','serialize','Number','stack','autoExpandPropertyCount','_hasSetOnItsPath','_getOwnPropertyDescriptor','length','127.0.0.1','string','_quotedRegExp','catch','array','count','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_console_ninja_session','type','[object\\x20Map]','gateway.docker.internal','positiveInfinity','autoExpandPreviousObjects','[object\\x20BigInt]','70FEqbsq','11EvqbgY','_HTMLAllCollection','_keyStrRegExp','trace','function','default','getWebSocketClass','log','reload','54693','versions','name','map','ws://','_allowedToConnectOnSend','totalStrLength','unknown','_console_ninja','15594mUeKWH','_WebSocket','11196264ZecJpY','_isPrimitiveWrapperType','_numberRegExp','concat','_setNodePermissions',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Ray-Win11\",\"192.168.2.32\"],'959QMymZX','_isNegativeZero','test','_property','process','2324394fQIAwR','match','value','expressionsToEvaluate','send',':logPointId:','_WebSocketClass','now','getPrototypeOf','_blacklistedProperty','__es'+'Module','autoExpand','isExpressionToEvaluate','stringify','_consoleNinjaAllowedToStart','forEach','_addLoadNode','_setNodeId','funcName','call','url','parse','...','current','autoExpandLimit','location','bind','performance','readyState','_getOwnPropertySymbols','failed\\x20to\\x20connect\\x20to\\x20host:\\x20'];_0x3fef=function(){return _0x5da782;};return _0x3fef();}");
  } catch (e) {}
}
;
function oo_oo(i) {
  for (var _len = arguments.length, v = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    v[_key - 1] = arguments[_key];
  }
  try {
    oo_cm().consoleLog(i, v);
  } catch (e) {}
  return v;
}
;
function oo_tr(i) {
  for (var _len2 = arguments.length, v = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    v[_key2 - 1] = arguments[_key2];
  }
  try {
    oo_cm().consoleTrace(i, v);
  } catch (e) {}
  return v;
}
;
function oo_ts() {
  try {
    oo_cm().consoleTime();
  } catch (e) {}
}
;
function oo_te() {
  try {
    oo_cm().consoleTimeEnd();
  } catch (e) {}
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/

/***/ }),

/***/ "./src/StrapifyCollection.js":
/*!***********************************!*\
  !*** ./src/StrapifyCollection.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify.js */ "./src/Strapify.js");
/* harmony import */ var _StrapifyControl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyControl.js */ "./src/StrapifyControl.js");
/* harmony import */ var _StrapifyTemplate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyTemplate */ "./src/StrapifyTemplate.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
/* harmony import */ var _StrapifyErrors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StrapifyErrors.js */ "./src/StrapifyErrors.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }





var _collectionElement = /*#__PURE__*/new WeakMap();
var _collectionData = /*#__PURE__*/new WeakMap();
var _state = /*#__PURE__*/new WeakMap();
var _getOverrideCollectionData = /*#__PURE__*/new WeakMap();
var _strapifyTemplates = /*#__PURE__*/new WeakMap();
var _insertionElm = /*#__PURE__*/new WeakMap();
var _insertBeforeElm = /*#__PURE__*/new WeakMap();
var _templateElm = /*#__PURE__*/new WeakMap();
var _conditionalTemplateElms = /*#__PURE__*/new WeakMap();
var _stateElms = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _minHeightCache = /*#__PURE__*/new WeakMap();
var _templateElmCache = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _holdHeight = /*#__PURE__*/new WeakSet();
var _releaseHeight = /*#__PURE__*/new WeakSet();
var _reflectState = /*#__PURE__*/new WeakSet();
var _getQueryString = /*#__PURE__*/new WeakSet();
class StrapifyCollection {
  //element that contains the strapify-collection attribute

  //collection data from strapi

  //visible state of the collectionElement

  //used repeatable elements to emulate a non existent strapi collection

  //strapify templates that are used to render the collection entries

  //element that the collection entries (cloned templates) are inserted into

  //element that the collection entries (cloned templates) are inserted before

  //holds the (first found) non conditional template element

  //holds the conditional template elements

  //holds any state elements (strapify-state-element)

  //mutation observer to watch for strapify attribute changes

  //holds the height of the collection element, used to keep the size stable when templates are added/removed

  //holds references to all template elements

  //the allowed attributes for the collection element

  constructor(collectionElement, getOverrideCollectionData) {
    _classPrivateMethodInitSpec(this, _getQueryString);
    _classPrivateMethodInitSpec(this, _reflectState);
    _classPrivateMethodInitSpec(this, _releaseHeight);
    _classPrivateMethodInitSpec(this, _holdHeight);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _collectionElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _collectionData, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _state, {
      writable: true,
      value: "initial"
    });
    _classPrivateFieldInitSpec(this, _getOverrideCollectionData, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapifyTemplates, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _insertionElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _insertBeforeElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _templateElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _conditionalTemplateElms, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _stateElms, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _minHeightCache, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _templateElmCache, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-collection": undefined,
        "strapi-relation": undefined,
        "strapi-single-type-relation": undefined,
        "strapi-filter": undefined,
        "strapi-filter-internal-relation": undefined,
        "strapi-filter-internal-control": undefined,
        "strapi-sort": undefined,
        "strapi-sort-internal-relation": undefined,
        "strapi-sort-internal-control": undefined,
        "strapi-page": undefined,
        "strapi-page-size": undefined,
        "strapi-hide-on-fail": undefined
      }
    });
    //set the collection element and update the attributes
    _classPrivateFieldSet(this, _collectionElement, collectionElement);
    _classPrivateFieldSet(this, _getOverrideCollectionData, getOverrideCollectionData);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    //create mutation observer to watch for attribute changes
    _classPrivateFieldSet(this, _mutationObserver, new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
          this.process();
        }
      });
    }));

    //observe the collection element for attribute changes
    _classPrivateFieldGet(this, _mutationObserver).observe(_classPrivateFieldGet(this, _collectionElement), {
      attributes: true,
      attributeFilter: _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].validStrapifyCollectionAttributes
    });

    //get the state elements and reflect the state
    _classPrivateFieldSet(this, _stateElms, _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findStateElements(_classPrivateFieldGet(this, _collectionElement)));
    _classPrivateFieldSet(this, _state, "loading");
    _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);

    //find the template elements
    const _templateElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findTemplateElms(_classPrivateFieldGet(this, _collectionElement));
    _classPrivateFieldSet(this, _templateElmCache, _templateElms);

    //find the conditional template elements, exlcluding any with duplicate conditions
    const conditionalTemplateElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findUniqueConditionalTemplateElms(_classPrivateFieldGet(this, _collectionElement));

    //set the templateElms and conditionalTemplateElms that will be used to render the collection entries
    if (conditionalTemplateElms.length > 0) {
      _classPrivateFieldSet(this, _conditionalTemplateElms, conditionalTemplateElms.map(conditionalTemplateElm => conditionalTemplateElm.cloneNode(true)));
      _classPrivateFieldSet(this, _templateElm, _templateElms.filter(templateElm => !templateElm.hasAttribute("strapi-template-conditional"))[0].cloneNode(true));
    } else {
      _classPrivateFieldSet(this, _templateElm, _templateElms[0].cloneNode(true));
    }

    //find the insertion element and the insert before element
    _classPrivateFieldSet(this, _insertionElm, _templateElms[0].parentElement);
    _classPrivateFieldSet(this, _insertBeforeElm, _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findInsertBeforeElm(_templateElms[0]));

    //remove all the template elements from the DOM
    _templateElms.forEach(templateElm => templateElm.remove());

    //find the control elements
    const pageControlElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findPageControlElms(_classPrivateFieldGet(this, _collectionElement));
    const filterControlElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findFilterControlElms(_classPrivateFieldGet(this, _collectionElement));
    const sortControlElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findSortControlElms(_classPrivateFieldGet(this, _collectionElement));

    //instantiate strapify control elements
    const controlElms = [...pageControlElms, ...filterControlElms, ...sortControlElms];
    controlElms.forEach(controlElm => {
      new _StrapifyControl_js__WEBPACK_IMPORTED_MODULE_1__["default"](controlElm, _classPrivateFieldGet(this, _collectionElement), this);
    });
  }

  //soft destroy that clears the templates and restores the original template elements
  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
    _classPrivateFieldGet(this, _strapifyTemplates).forEach(template => template.destroy());
    _classPrivateFieldGet(this, _templateElmCache).forEach(templateElm => {
      if (_classPrivateFieldGet(this, _insertBeforeElm)) {
        _classPrivateFieldGet(this, _insertionElm).insertBefore(templateElm, _classPrivateFieldGet(this, _insertBeforeElm));
      } else {
        _classPrivateFieldGet(this, _insertionElm).appendChild(templateElm);
      }
    });
  }

  //used by control elements to set the page, clamping value to limits
  setPage(page) {
    const pageCount = _classPrivateFieldGet(this, _collectionData).meta.pagination.pageCount;
    const newPage = Math.max(1, Math.min(page, pageCount));
    if (newPage !== _classPrivateFieldGet(this, _collectionData).meta.pagination.page) {
      _classPrivateFieldGet(this, _collectionElement).setAttribute("strapi-page", newPage);
    }
  }

  //used by control elements to get the current page
  getPage() {
    return _classPrivateFieldGet(this, _collectionData).meta.pagination.page;
  }

  //used by control elements to get the page count
  getPageCount() {
    return _classPrivateFieldGet(this, _collectionData).meta.pagination.pageCount;
  }

  //update attributes with the values from the element's data attributes

  //explicitly set the height of the insertion element (to its current height) to prevent the page from jumping around

  //remove the explicit height css rule from the insertion element, restoring the original value

  //hide/show the state elements based on the current state

  async process() {
    //wrap the entire process in a try catch block so we can reflect state and emit events on failure
    try {
      //hold the height of the collection element to prevent page from jumping
      _classPrivateMethodGet(this, _holdHeight, _holdHeight2).call(this);

      //destroy all strapify templates
      _classPrivateFieldGet(this, _strapifyTemplates).forEach(template => template.destroy());
      _classPrivateFieldSet(this, _strapifyTemplates, []);

      //since this class is used for collections, relations and repeatbles we need to determine which of those we are dealing with
      //when there is no overrideCollectionData, we are dealing with a collection or relation
      if (_classPrivateFieldGet(this, _getOverrideCollectionData) === undefined) {
        //get the collection name, how this is done depends on the type of strapify element we are dealing with
        let collectionName;
        if (_classPrivateFieldGet(this, _attributes)["strapi-collection"]) {
          collectionName = _classPrivateFieldGet(this, _attributes)["strapi-collection"];
        } else if (_classPrivateFieldGet(this, _attributes)["strapi-relation"]) {
          collectionName = _classPrivateFieldGet(this, _attributes)["strapi-relation"].split(",")[1].trim();
        } else if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"]) {
          collectionName = _classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"].split(",")[1].trim();
        } else if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"]) {
          collectionName = _classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"].split(",")[1].trim();
        }

        //get the collection data
        _classPrivateFieldSet(this, _collectionData, await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])(`/api/${collectionName}`, _classPrivateMethodGet(this, _getQueryString, _getQueryString2).call(this)));
      }
      //otherwise we are dealing with a repeatable, so we can just use the overrideCollectionData
      else {
        _classPrivateFieldSet(this, _collectionData, _classPrivateFieldGet(this, _getOverrideCollectionData).call(this));

        //hide colleciton if there is no data
        if (!_classPrivateFieldGet(this, _collectionData)) {
          this.destroy();
          _classPrivateFieldGet(this, _collectionElement).remove();
          return;
        }
      }

      //templates will be processed asynchronously, since they can have relations, repeatables
      const processPromises = [];

      // if the length of the collection data is 0, throw a warning
      if (_classPrivateFieldGet(this, _collectionData).data.length === 0) {
        _StrapifyErrors_js__WEBPACK_IMPORTED_MODULE_4__["default"].warn(`Collection "${_classPrivateFieldGet(this, _attributes)["strapi-collection"] || _classPrivateFieldGet(this, _attributes)["strapi-relation"] || _classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"] || _classPrivateFieldGet(this, _attributes)["strapi-repeatable"]}" has no entries.`);
      }

      //loop through the collection data and create a strapify template for each item
      for (let i = 0; i < _classPrivateFieldGet(this, _collectionData).data.length; i++) {
        const {
          id: strapiDataId,
          attributes: strapiDataAttributes
        } = _classPrivateFieldGet(this, _collectionData).data[i];

        //by default we use the template element
        let templateElm = _classPrivateFieldGet(this, _templateElm);

        //but if there are conditional template elements we need to check if one of them matches
        if (_classPrivateFieldGet(this, _conditionalTemplateElms)) {
          //so iteratively check each condition and break if one matches, use the matching template
          for (let conditionalTemplateElm of _classPrivateFieldGet(this, _conditionalTemplateElms)) {
            const condition = conditionalTemplateElm.getAttribute("strapi-template-conditional");
            const parsedConditionData = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].parseCondition(condition, strapiDataAttributes).result;
            if (_Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].checkCondition(parsedConditionData, strapiDataAttributes)) {
              templateElm = conditionalTemplateElm;
              break;
            }
          }
        }

        //clone the chosen template element and put it into the DOM
        let templateClone = templateElm.cloneNode(true);
        if (_classPrivateFieldGet(this, _insertBeforeElm) !== null) {
          _classPrivateFieldGet(this, _insertionElm).insertBefore(templateClone, _classPrivateFieldGet(this, _insertBeforeElm));
        } else {
          _classPrivateFieldGet(this, _insertionElm).appendChild(templateClone);
        }

        //create a strapify template for the template element clone
        const strapifyTemplate = new _StrapifyTemplate__WEBPACK_IMPORTED_MODULE_2__["default"](templateClone, strapiDataId, strapiDataAttributes);
        _classPrivateFieldGet(this, _strapifyTemplates).push(strapifyTemplate);
        processPromises.push(strapifyTemplate.process());
      }

      //wait for all templates to be processed
      await Promise.allSettled(processPromises);

      //dispatch custom event with the collection data
      _classPrivateFieldGet(this, _collectionElement).dispatchEvent(new CustomEvent("strapiCollectionChange", {
        bubbles: false,
        target: _classPrivateFieldGet(this, _collectionElement),
        detail: {
          collectionData: _classPrivateFieldGet(this, _collectionData)
        }
      }));

      //reflect the state on success
      _classPrivateFieldSet(this, _state, "success");
      if (_classPrivateFieldGet(this, _collectionElement).hasAttribute("strapi-hide-on-fail")) {
        _classPrivateFieldGet(this, _collectionElement).classList.remove("strapify-hide");
      }
      _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);

      //trigger webflow animation fix
      _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].reinitializeIX2();

      //release the height of the collection element
      _classPrivateMethodGet(this, _releaseHeight, _releaseHeight2).call(this);
    } catch (err) {
      //reflect the state on failure
      _classPrivateFieldSet(this, _state, "error");
      if (_classPrivateFieldGet(this, _collectionElement).hasAttribute("strapi-hide-on-fail")) {
        _classPrivateFieldGet(this, _collectionElement).classList.add("strapify-hide");
      }
      _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);
      if (_Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].debugMode) console.error(err);
    }
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _collectionElement).getAttribute(attribute);
  });
}
function _holdHeight2() {
  _classPrivateFieldSet(this, _minHeightCache, _classPrivateFieldGet(this, _insertionElm).style.minHeight);
  _classPrivateFieldGet(this, _insertionElm).style.minHeight = `${_classPrivateFieldGet(this, _insertionElm).offsetHeight}px`;
}
function _releaseHeight2() {
  _classPrivateFieldGet(this, _insertionElm).style.minHeight = _classPrivateFieldGet(this, _minHeightCache);
}
function _reflectState2() {
  _classPrivateFieldGet(this, _stateElms).forEach(stateElm => {
    const stateKey = stateElm.getAttribute("strapi-state-element");
    if (stateKey === _classPrivateFieldGet(this, _state)) {
      stateElm.classList.remove("strapify-hide");
    } else {
      stateElm.classList.add("strapify-hide");
    }
  });
}
function _getQueryString2() {
  //alias the substituteQueryStringVariables function for it is a long boy
  let qs = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables;

  //will contain the part of the query string that defines the population of components in the collection
  let componentPopulationString = "";

  //create an array of all usable template elements (non duplicate templates and conditional templates)
  let templateElms = [];
  _classPrivateFieldGet(this, _templateElm) && templateElms.push(_classPrivateFieldGet(this, _templateElm));
  _classPrivateFieldGet(this, _conditionalTemplateElms) && _classPrivateFieldGet(this, _conditionalTemplateElms).forEach(conditionalTemplateElm => templateElms.push(conditionalTemplateElm));

  //search each template element for any descendants that are strapify fields with components to generate the componentPopulationString
  for (let templateElm of templateElms) {
    //find all strapify elements which may contain component references
    let componentFieldElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findFieldElms(templateElm);
    let componentRelationElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findRelationElms(templateElm);
    let componentRepeatableElms = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findRepeatableElms(templateElm);
    let componentElms = componentFieldElms.concat(componentRelationElms);
    componentElms = componentElms.concat(componentRepeatableElms);

    //and for each of those elements, find the attributes that should be used to populate them
    componentElms.forEach(componentElm => {
      //we need to check all attributes that may need populating
      for (let attribute of [..._Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].validStrapifyFieldAttributes, "strapi-relation", "strapi-repeatable"]) {
        let attributeValue = componentElm.getAttribute(attribute);
        if (attributeValue) {
          //split into multiple arguments where possible, take only values before the first comma (occurs when we have a strapi-relation attribute)
          const args = attributeValue.split("|").map(arg => arg.split(",")[0].trim());
          for (let arg of args) {
            if (arg) {
              let _arg = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].removeQueryStringVariableReferences(arg);
              _arg = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].extractStrapiIntoFieldNames(_arg);
              componentPopulationString += `&populate=${_arg}`;
            }
          }
        }
      }
    });
  }

  //filter out any duplicate populate strings
  componentPopulationString = [...new Set(componentPopulationString.split("&"))].join("&");

  //join the user filter with the internal filter attributes that are set by the control elements and relation restrictions
  let filter = undefined;
  if (_classPrivateFieldGet(this, _attributes)["strapi-filter"]) {
    filter = _classPrivateFieldGet(this, _attributes)["strapi-filter"];
  }
  if (_classPrivateFieldGet(this, _attributes)["strapi-filter-internal-relation"]) {
    filter = filter ? filter + " | " + _classPrivateFieldGet(this, _attributes)["strapi-filter-internal-relation"] : _classPrivateFieldGet(this, _attributes)["strapi-filter-internal-relation"];
  }
  if (_classPrivateFieldGet(this, _attributes)["strapi-filter-internal-control"]) {
    filter = filter ? filter + " | " + _classPrivateFieldGet(this, _attributes)["strapi-filter-internal-control"] : _classPrivateFieldGet(this, _attributes)["strapi-filter-internal-control"];
  }

  //join the user sort with the internal sort attributes that are set by the control elements and relation restrictions
  let sort = undefined;
  if (_classPrivateFieldGet(this, _attributes)["strapi-sort"]) {
    sort = _classPrivateFieldGet(this, _attributes)["strapi-sort"];
  }
  if (_classPrivateFieldGet(this, _attributes)["strapi-sort-internal-relation"]) {
    sort = sort ? sort + " | " + _classPrivateFieldGet(this, _attributes)["strapi-sort-internal-relation"] : _classPrivateFieldGet(this, _attributes)["strapi-sort-internal-relation"];
  }
  if (_classPrivateFieldGet(this, _attributes)["strapi-sort-internal-control"]) {
    sort = sort ? sort + " | " + _classPrivateFieldGet(this, _attributes)["strapi-sort-internal-control"] : _classPrivateFieldGet(this, _attributes)["strapi-sort-internal-control"];
  }

  //pairs of query string variable identifiers and the data which will be transformed into their values (just for conciseness)
  const queryStringPairs = {
    "filters": qs(filter),
    "sort=": qs(sort),
    "pagination[page]=": qs(_classPrivateFieldGet(this, _collectionElement).getAttribute("strapi-page")),
    "pagination[pageSize]=": qs(_classPrivateFieldGet(this, _collectionElement).getAttribute("strapi-page-size"))
  };

  //transform the pairs into a query string
  const queryString = "?" + Object.keys(queryStringPairs).map(prefix => {
    if (queryStringPairs[prefix]) {
      return queryStringPairs[prefix].split("|").map(arg => {
        return `${prefix}${arg.trim()}`;
      }).join("&");
    }
  }).filter(item => item).join("&");
  return queryString + componentPopulationString;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyCollection);

/***/ }),

/***/ "./src/StrapifyControl.js":
/*!********************************!*\
  !*** ./src/StrapifyControl.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify.js */ "./src/Strapify.js");
/* harmony import */ var _StrapifyTemplate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyTemplate */ "./src/StrapifyTemplate.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }



var _controlElement = /*#__PURE__*/new WeakMap();
var _collectionElement = /*#__PURE__*/new WeakMap();
var _strapifyCollection = /*#__PURE__*/new WeakMap();
var _radioButtons = /*#__PURE__*/new WeakMap();
var _checkboxes = /*#__PURE__*/new WeakMap();
var _controlType = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _updateCollectionAttribute = /*#__PURE__*/new WeakSet();
var _onButtonEvent = /*#__PURE__*/new WeakSet();
var _onSelectEvent = /*#__PURE__*/new WeakSet();
var _onRadioEvent = /*#__PURE__*/new WeakSet();
var _onCheckboxEvent = /*#__PURE__*/new WeakSet();
class StrapifyControl {
  //the control element that this object manages

  //the collection element that the control element controls

  //the StrapifyCollection object that manages the collection element

  //radio buttons elements and checkboxes which are children of the control element

  //either "strapi-page", "strapi-filter", or "strapi-sort"

  //the strapify data attributes of the control element

  constructor(controlElement, collectionElement, strapifyCollection) {
    _classPrivateMethodInitSpec(this, _onCheckboxEvent);
    _classPrivateMethodInitSpec(this, _onRadioEvent);
    _classPrivateMethodInitSpec(this, _onSelectEvent);
    _classPrivateMethodInitSpec(this, _onButtonEvent);
    _classPrivateMethodInitSpec(this, _updateCollectionAttribute);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _controlElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _collectionElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapifyCollection, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _radioButtons, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _checkboxes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _controlType, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-page-control": undefined,
        "strapi-filter-control": undefined,
        "strapi-sort-control": undefined,
        "strapi-control-preserve-initial": undefined
      }
    });
    _classPrivateFieldSet(this, _controlElement, controlElement);
    _classPrivateFieldSet(this, _collectionElement, collectionElement);
    _classPrivateFieldSet(this, _strapifyCollection, strapifyCollection);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    //determine the type of control
    if (_classPrivateFieldGet(this, _controlElement).hasAttribute("strapi-page-control")) {
      _classPrivateFieldSet(this, _controlType, "strapi-page");
    } else if (_classPrivateFieldGet(this, _controlElement).hasAttribute("strapi-filter-control")) {
      _classPrivateFieldSet(this, _controlType, "strapi-filter");
    } else if (_classPrivateFieldGet(this, _controlElement).hasAttribute("strapi-sort-control")) {
      _classPrivateFieldSet(this, _controlType, "strapi-sort");
    }

    //add event listeners to trigger the correct action when the control element is interacted with
    //for button or a elements
    if (_classPrivateFieldGet(this, _controlElement).tagName === "BUTTON" || _classPrivateFieldGet(this, _controlElement).tagName === "A") {
      _classPrivateFieldGet(this, _controlElement).addEventListener("click", _classPrivateMethodGet(this, _onButtonEvent, _onButtonEvent2).bind(this));
    }
    //for select elements
    else if (_classPrivateFieldGet(this, _controlElement).tagName === "SELECT") {
      _classPrivateFieldGet(this, _controlElement).addEventListener("change", _classPrivateMethodGet(this, _onSelectEvent, _onSelectEvent2).bind(this));
    }
    //for radio or checkbox elements
    else {
      //look for radio buttons
      _classPrivateFieldSet(this, _radioButtons, Array.from(_classPrivateFieldGet(this, _controlElement).querySelectorAll("input[type='radio']")));

      //look for checkboxes
      _classPrivateFieldSet(this, _checkboxes, Array.from(_classPrivateFieldGet(this, _controlElement).querySelectorAll("input[type='checkbox']")));

      //if there are radio buttons
      if (_classPrivateFieldGet(this, _radioButtons).length > 0) {
        _classPrivateFieldGet(this, _radioButtons).forEach(radio => {
          radio.addEventListener("change", _classPrivateMethodGet(this, _onRadioEvent, _onRadioEvent2).bind(this));
        });
      }

      //if there are checkboxes
      if (_classPrivateFieldGet(this, _checkboxes).length > 0) {
        _classPrivateFieldGet(this, _checkboxes).forEach(checkbox => {
          checkbox.addEventListener("change", _classPrivateMethodGet(this, _onCheckboxEvent, _onCheckboxEvent2).bind(this));
        });
      }
    }

    // if the control type is strapi-filter or strapi-sort, we need to reset the page to 1 when the control is interacted with
    if (_classPrivateFieldGet(this, _controlType) === "strapi-filter" || _classPrivateFieldGet(this, _controlType) === "strapi-sort") {
      _classPrivateFieldGet(this, _controlElement).addEventListener("click", () => {
        _classPrivateFieldGet(this, _strapifyCollection).setPage(1);
      });
      _classPrivateFieldGet(this, _controlElement).addEventListener("change", () => {
        _classPrivateFieldGet(this, _strapifyCollection).setPage(1);
      });
    }
  }
  destroy() {}
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _controlElement).getAttribute(attribute);
  });
}
function _updateCollectionAttribute2(attributeValue) {
  let attribName = _classPrivateFieldGet(this, _controlType);
  if (_classPrivateFieldGet(this, _controlElement).hasAttribute("strapi-control-preserve-initial")) {
    attribName += "-internal-control";
  }
  _classPrivateFieldGet(this, _collectionElement).setAttribute(attribName, attributeValue);
}
function _onButtonEvent2(e) {
  if (_classPrivateFieldGet(this, _controlType) === "strapi-page") {
    const pageArg = _classPrivateFieldGet(this, _attributes)["strapi-page-control"];
    if (!pageArg.includes("+") && !pageArg.includes("-")) {
      _classPrivateFieldGet(this, _strapifyCollection).setPage(parseInt(pageArg));
      return;
    }
    const reg = /([\+-])(\d+)/;
    const match = reg.exec(pageArg);
    const operator = match[1].trim();
    const pageDiff = parseInt(match[2].trim());
    const curPage = _classPrivateFieldGet(this, _strapifyCollection).getPage();
    let newPage = curPage;
    if (operator === "+") {
      newPage += pageDiff;
    } else if (operator === "-") {
      newPage -= pageDiff;
    }
    _classPrivateFieldGet(this, _strapifyCollection).setPage(newPage);
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-filter") {
    const filter = _classPrivateFieldGet(this, _attributes)["strapi-filter-control"];
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, filter);
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-sort") {
    const sort = _classPrivateFieldGet(this, _attributes)["strapi-sort-control"];
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, sort);
  }
}
function _onSelectEvent2(e) {
  const optionElm = e.target.options[e.target.selectedIndex];
  if (_classPrivateFieldGet(this, _controlType) === "strapi-page") {
    let page = e.target.value;
    if (optionElm.hasAttribute("strapi-control-value")) {
      page = optionElm.getAttribute("strapi-control-value");
    }
    _classPrivateFieldGet(this, _strapifyCollection).setPage(parseInt(page));
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-filter") {
    let filter = e.target.value;
    if (optionElm.hasAttribute("strapi-control-value")) {
      filter = optionElm.getAttribute("strapi-control-value");
    }
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, filter);
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-sort") {
    let sort = e.target.value;
    if (optionElm.hasAttribute("strapi-control-value")) {
      sort = optionElm.getAttribute("strapi-control-value");
    }
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, sort);
  }
}
function _onRadioEvent2(e) {
  if (_classPrivateFieldGet(this, _controlType) === "strapi-page") {
    let page = e.target.value;
    if (e.target.hasAttribute("strapi-control-value")) {
      page = e.target.getAttribute("strapi-control-value");
    }
    _classPrivateFieldGet(this, _strapifyCollection).setPage(parseInt(page));
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-filter") {
    let filter = e.target.value;
    if (e.target.hasAttribute("strapi-control-value")) {
      filter = e.target.getAttribute("strapi-control-value");
    }
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, filter);
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-sort") {
    let sort = e.target.value;
    if (e.target.hasAttribute("strapi-control-value")) {
      sort = e.target.getAttribute("strapi-control-value");
    }
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, sort);
  }
}
function _onCheckboxEvent2(e) {
  if (_classPrivateFieldGet(this, _controlType) === "strapi-page") {
    if (_Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].debugMode) console.error("strapi-page-control cannot be used with checkboxes");
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-filter") {
    const filters = [];
    _classPrivateFieldGet(this, _checkboxes).forEach(checkbox => {
      if (checkbox.checked) {
        filters.push(checkbox.getAttribute("strapi-control-value"));
      }
    });
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, filters.join(" | "));
  } else if (_classPrivateFieldGet(this, _controlType) === "strapi-sort") {
    const sorts = [];
    _classPrivateFieldGet(this, _checkboxes).forEach(checkbox => {
      if (checkbox.checked) {
        sorts.push(checkbox.getAttribute("strapi-control-value"));
      }
    });
    _classPrivateMethodGet(this, _updateCollectionAttribute, _updateCollectionAttribute2).call(this, sorts.join(" | "));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyControl);

/***/ }),

/***/ "./src/StrapifyEZFormsForm.js":
/*!************************************!*\
  !*** ./src/StrapifyEZFormsForm.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }


var _formContainerElm = /*#__PURE__*/new WeakMap();
var _formElm = /*#__PURE__*/new WeakMap();
var _formSubmitElm = /*#__PURE__*/new WeakMap();
var _state = /*#__PURE__*/new WeakMap();
var _stateElms = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _reflectState = /*#__PURE__*/new WeakSet();
class StrapifyEZFormsForm {
  constructor(formContainerElement) {
    _classPrivateMethodInitSpec(this, _reflectState);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _formContainerElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _formElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _formSubmitElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _state, {
      writable: true,
      value: "initial"
    });
    _classPrivateFieldInitSpec(this, _stateElms, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-ezforms-form": undefined,
        "strapi-success-redirect": undefined,
        "strapi-error-redirect": undefined,
        "strapi-hide-on-success": undefined,
        "strapi-hide-on-error": undefined
      }
    });
    _classPrivateFieldSet(this, _formContainerElm, formContainerElement);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    //check if the formContainerElm is a form element
    if (_classPrivateFieldGet(this, _formContainerElm).tagName === "FORM") {
      _classPrivateFieldSet(this, _formElm, _classPrivateFieldGet(this, _formContainerElm));
    } else {
      //find the child form which is closest to the formContainerElm
      _classPrivateFieldSet(this, _formElm, _classPrivateFieldGet(this, _formContainerElm).querySelector("form"));
    }
    _classPrivateFieldSet(this, _stateElms, _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].findStateElements(_classPrivateFieldGet(this, _formContainerElm)));
    _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);
    _classPrivateFieldSet(this, _formSubmitElm, _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].findEZFormSubmitElms(_classPrivateFieldGet(this, _formContainerElm))[0]);
  }
  async process() {
    const ezFormsElm = _classPrivateFieldGet(this, _formElm);
    const submitElm = _classPrivateFieldGet(this, _formSubmitElm);
    submitElm.addEventListener("click", event => {
      event.preventDefault();
      _classPrivateFieldSet(this, _state, "loading");
      _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);
      (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_1__.strapiEZFormsSubmit)(ezFormsElm).then(data => {
        _classPrivateFieldSet(this, _state, "success");
        _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);

        //dispatch a custom event with the data
        _classPrivateFieldGet(this, _formContainerElm).dispatchEvent(new CustomEvent("strapiEZFormsSubmitted", {
          bubbles: false,
          detail: {
            data: data
          }
        }));
        if (_classPrivateFieldGet(this, _attributes)["strapi-hide-on-success"] !== null && _classPrivateFieldGet(this, _attributes)["strapi-hide-on-success"] !== undefined) {
          _classPrivateFieldGet(this, _formContainerElm).classList.add("strapify-hide");
        }
        if (_classPrivateFieldGet(this, _attributes)["strapi-success-redirect"]) {
          window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-success-redirect"];
        }
      }).catch(error => {
        _classPrivateFieldSet(this, _state, "error");
        _classPrivateMethodGet(this, _reflectState, _reflectState2).call(this);

        //dispatch a custom event with the error
        _classPrivateFieldGet(this, _formContainerElm).dispatchEvent(new CustomEvent("strapiEZFormsError", {
          bubbles: false,
          detail: {
            error: error
          }
        }));
        if (_classPrivateFieldGet(this, _attributes)["strapi-hide-on-error"] !== null && _classPrivateFieldGet(this, _attributes)["strapi-hide-on-error"] !== undefined) {
          _classPrivateFieldGet(this, _formContainerElm).classList.add("strapify-hide");
        }
        if (_classPrivateFieldGet(this, _attributes)["strapi-error-redirect"]) {
          window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-error-redirect"];
        }
      });
    });
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _formContainerElm).getAttribute(attribute);
  });
}
function _reflectState2() {
  _classPrivateFieldGet(this, _stateElms).forEach(stateElm => {
    const stateKey = stateElm.getAttribute("strapi-state-element");
    if (stateKey === _classPrivateFieldGet(this, _state)) {
      stateElm.classList.remove("strapify-hide");
    } else {
      stateElm.classList.add("strapify-hide");
    }
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyEZFormsForm);

/***/ }),

/***/ "./src/StrapifyErrors.js":
/*!*******************************!*\
  !*** ./src/StrapifyErrors.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// internal state that keeps track of how many errors have been logged
let errorCount = 0;
let thrownLogs = [];
function logIfUnseen(message, logType) {
  // logType can be "warn", or "error"
  if (!thrownLogs.includes(error)) {
    thrownLogs.push(error);
    console.group(`%cSTRAPIFY ${logType === "warn" ? "WARNING" : "ERROR"}`, `background-color: ${logType === "warn" ? "#9b9023" : "#aa3d3d"}; color: #ffffff; font-weight: bold; padding: 4px;`);
    console[logType](message);
    console.groupEnd();
  }
}
function toast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.classList.add("close-button");
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.color = "#fff";
  closeButton.style.fontSize = "20px";
  closeButton.style.marginLeft = "12px";
  closeButton.style.cursor = "pointer";

  // Set the toast styles
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.position = "fixed";
  toast.style.bottom = "16px";
  toast.style.left = "16px";
  toast.style.padding = "12px";
  toast.style.backgroundColor = "#333";
  toast.style.color = "#fff";
  toast.style.borderRadius = "4px";
  toast.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.3)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease-in-out";
  toast.style.zIndex = "9999";
  toast.appendChild(closeButton);
  document.body.appendChild(toast);

  // Close the toast when the close button is clicked
  closeButton.addEventListener("click", () => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  });
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100);
}
function warn(message) {
  logIfUnseen(message, "warn");
}
function error(message) {
  errorCount++;
  if (errorCount > 0) {
    toast(`${errorCount} Strapify error${errorCount > 1 ? "s" : ""} logged.  See console for details.`);
  }
  logIfUnseen(message, "error");
}
function checkForTemplateElement(templateElms, containerElement) {
  if (templateElms.length === 0) {
    if (containerElement.getAttribute("strapi-collection")) {
      error(`No template element found for collection "${containerElement.getAttribute("strapi-collection")}"`);
    }
  }
}
function checkIfText(strapiData, elm) {
  if (typeof strapiData === "object") {
    warn(`The field "${elm.getAttribute("strapi-field")}" is set on a text element (p, span, h) but does not contain text.  If you are trying to set an image or video field, set it on an img or div element instead.`);
  }
}
function checkIfSingleMedia(strapiData, elm) {
  if (typeof strapiData !== "object") {
    error(`The field "${elm.getAttribute("strapi-field")}" in the "${elm.closest("[strapi-collection]").getAttribute("strapi-collection")}" collection is not a media field, but is set on an <img /> element.`);
  }
}
function isMultipleMedia(strapiData, elm) {
  if (Array.isArray(strapiData.data)) {
    warn(`The field "${elm.getAttribute("strapi-field")}" in the "${elm.closest("[strapi-collection]").getAttribute("strapi-collection")}" collection is a multiple media field.  strapi-field only works on single media fields.  To display multiple media fields, use strapi-repeatable with a strapi-template and strapi-field inside`);
    return true;
  } else {
    return false;
  }
}
function checkIfUndefinedStrapiDataValue(strapiDataValue, fieldPath, fieldElement) {
  if (strapiDataValue === undefined) {
    error(`Error fetching strapi data for field "${fieldPath}" in collection "${fieldElement.closest("[strapi-collection]").getAttribute("strapi-collection")}.  Check that the field exists.`);
  }
}
function checkIfRichText(strapiData, elm) {
  // this is a bit of a hacky way to check if the strapiData is rich text, but it should help the webflow people stop using divs for text (text blocks)
  // if the strapiData contains a new line character or a #, it is likely rich text.  If it doesn't, it is likely a string.  Throw a warning if it is a string.
  if (typeof strapiData === "string" && !/#+/.test(strapiData) && !strapiData.includes("\n") && !strapiData.includes("\r")) {
    // if the strapiData is a youtube link, don't throw a warning
    if (strapiData.includes("http")) {
      return;
    }
    warn(`The text field "${elm.getAttribute("strapi-field")}" in the "${elm?.closest("[strapi-collection]")?.getAttribute("strapi-collection")}" collection is set on a div element rather than a p, span, or h.  This may alter the styling of the text.  If "${elm.getAttribute("strapi-field")}" is a rich text field, ignore this warning.`);
  }
}
const ErrorHandler = {
  checkForTemplateElement,
  checkIfText,
  checkIfSingleMedia,
  isMultipleMedia,
  checkIfUndefinedStrapiDataValue,
  checkIfRichText,
  warn,
  error,
  toast
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ErrorHandler);

/***/ }),

/***/ "./src/StrapifyField.js":
/*!******************************!*\
  !*** ./src/StrapifyField.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");
/* harmony import */ var _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyErrors */ "./src/StrapifyErrors.js");
/* harmony import */ var _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyParse */ "./src/StrapifyParse.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }



var _fieldElement = /*#__PURE__*/new WeakMap();
var _strapiDataAttributes = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _managedClasses = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _processStrapiFieldElms = /*#__PURE__*/new WeakSet();
var _processStrapiClassAddElms = /*#__PURE__*/new WeakSet();
var _processStrapiClassReplace = /*#__PURE__*/new WeakSet();
var _processStrapiConditionalClass = /*#__PURE__*/new WeakSet();
var _processStrapiInto = /*#__PURE__*/new WeakSet();
var _processStrapiCSSRule = /*#__PURE__*/new WeakSet();
var _processStrapiBackgroundImage = /*#__PURE__*/new WeakSet();
class StrapifyField {
  //the field element this class manages

  //the strapi data attributes, to be passed from the template

  //mutation observer to watch for strapify attribute changes

  //the css classes that have been added to the field element (strapi-class-add, strapi-class-conditional, ...)

  //the allowed strapify attributes for the field element

  constructor(fieldElement) {
    _classPrivateMethodInitSpec(this, _processStrapiBackgroundImage);
    _classPrivateMethodInitSpec(this, _processStrapiCSSRule);
    _classPrivateMethodInitSpec(this, _processStrapiInto);
    _classPrivateMethodInitSpec(this, _processStrapiConditionalClass);
    _classPrivateMethodInitSpec(this, _processStrapiClassReplace);
    _classPrivateMethodInitSpec(this, _processStrapiClassAddElms);
    _classPrivateMethodInitSpec(this, _processStrapiFieldElms);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _fieldElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataAttributes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _managedClasses, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-field": undefined,
        "strapi-class-add": undefined,
        "strapi-class-replace": undefined,
        "strapi-class-conditional": undefined,
        "strapi-into": undefined,
        "strapi-css-rule": undefined,
        "strapi-background-image": undefined
      }
    });
    _classPrivateFieldSet(this, _fieldElement, fieldElement);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
    _classPrivateFieldSet(this, _mutationObserver, new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
          this.process(_classPrivateFieldGet(this, _strapiDataAttributes));
        }
      });
    }));
    _classPrivateFieldGet(this, _mutationObserver).observe(_classPrivateFieldGet(this, _fieldElement), {
      attributes: true,
      attributeFilter: _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].validStrapifyFieldAttributes
    });
  }

  //soft destroy that disconnects the mutation observer
  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
  }

  //update data attributes

  //for strapi-field

  //for strapi-class-add

  //for strapi-class-replace

  //for strapi-class-conditional

  //for strapi-into

  //for strapi-css-rule

  process(strapiDataAttributes) {
    _classPrivateFieldSet(this, _strapiDataAttributes, strapiDataAttributes);

    //restore the set of css classes on the fieldElement to the state it was in before Strapify was applied
    _classPrivateFieldGet(this, _managedClasses).forEach(managedClass => {
      if (managedClass.state === "added") {
        _classPrivateFieldGet(this, _fieldElement).classList.remove(managedClass.name);
      } else if (managedClass.state === "removed") {
        _classPrivateFieldGet(this, _fieldElement).classList.add(managedClass.name);
      }
    });
    _classPrivateFieldSet(this, _managedClasses, []);

    //execute the appropriate function for each defined data attribute
    const attributeToFunctionMap = {
      "strapi-field": _classPrivateMethodGet(this, _processStrapiFieldElms, _processStrapiFieldElms2),
      "strapi-class-add": _classPrivateMethodGet(this, _processStrapiClassAddElms, _processStrapiClassAddElms2),
      "strapi-class-replace": _classPrivateMethodGet(this, _processStrapiClassReplace, _processStrapiClassReplace2),
      "strapi-class-conditional": _classPrivateMethodGet(this, _processStrapiConditionalClass, _processStrapiConditionalClass2),
      "strapi-into": _classPrivateMethodGet(this, _processStrapiInto, _processStrapiInto2),
      "strapi-css-rule": _classPrivateMethodGet(this, _processStrapiCSSRule, _processStrapiCSSRule2),
      "strapi-background-image": _classPrivateMethodGet(this, _processStrapiBackgroundImage, _processStrapiBackgroundImage2)
    };
    Object.keys(attributeToFunctionMap).forEach(attribute => {
      if (_classPrivateFieldGet(this, _attributes)[attribute]) {
        attributeToFunctionMap[attribute].call(this, strapiDataAttributes);
      }
    });
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _fieldElement).getAttribute(attribute);
  });
}
function _processStrapiFieldElms2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-field"], {
    attributeName: "strapi-field",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: "",
    multipleArguments: false,
    subArgumentDetails: [{
      name: "strapi_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION,
      substituteQueryStringVariables: true
    }]
  });
  const fieldPath = args[0].value;
  const strapiDataValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(fieldPath, strapiAttributes);
  _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].checkIfUndefinedStrapiDataValue(strapiDataValue, fieldPath, _classPrivateFieldGet(this, _fieldElement));
  _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].modifyElmWithStrapiData(strapiDataValue, _classPrivateFieldGet(this, _fieldElement));
}
function _processStrapiClassAddElms2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-class-add"], {
    attributeName: "strapi-class-add",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: "",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "strapi_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION,
      substituteQueryStringVariables: true
    }]
  });
  args.forEach(arg => {
    const strapiFieldName = arg.value;
    const className = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(strapiFieldName, strapiAttributes);
    _classPrivateFieldGet(this, _fieldElement).classList.add(className);
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "added",
      name: className
    });
  });
}
function _processStrapiClassReplace2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-class-replace"], {
    attributeName: "strapi-class-replace",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: ",",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "existing_class_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.STRING,
      substituteQueryStringVariables: false
    }, {
      name: "strapi_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION,
      substituteQueryStringVariables: true
    }]
  });
  args.forEach(arg => {
    const classToReplace = arg.subArgs[0].value;
    let strapiFieldName = arg.subArgs[1].value;
    const classReplaceValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(strapiFieldName, strapiAttributes);
    _classPrivateFieldGet(this, _fieldElement).classList.remove(classToReplace);
    _classPrivateFieldGet(this, _fieldElement).classList.add(classReplaceValue);
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "removed",
      name: classToReplace
    });
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "added",
      name: classReplaceValue
    });
  });
}
function _processStrapiConditionalClass2(strapiDataAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-class-conditional"], {
    attributeName: "strapi-conditional-class",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: ",",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "condition",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION_CONDITION,
      substituteQueryStringVariables: false
    }, {
      name: "strapi_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION,
      substituteQueryStringVariables: true
    }]
  });
  args.forEach(arg => {
    const conditionString = arg.subArgs[0].value;
    const className = arg.subArgs[1].value;
    const parsedConditionData = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].parseCondition(conditionString).result;
    const conditionSatisfied = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].checkCondition(parsedConditionData, strapiDataAttributes);
    if (conditionSatisfied) {
      _classPrivateFieldGet(this, _fieldElement).classList.add(className);
      _classPrivateFieldGet(this, _managedClasses).push({
        state: "added",
        name: className
      });
    }
  });
}
function _processStrapiInto2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-into"], {
    attributeName: "strapi-into",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: "->",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "html_attribute_value_template",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION_TEMPLATE,
      substituteQueryStringVariables: true
    }, {
      name: "html_attribute_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.STRING,
      substituteQueryStringVariables: false
    }]
  });
  args.forEach(arg => {
    let intoDataValue = arg.subArgs[0].value;
    const intoAttributeName = arg.subArgs[1].value;

    //strapi variables are wrapped in double curly braces
    const regex = /{{(.*?)}}/g;

    //get all strapi variables in arg and replace with value from getStrapiComponentValue
    const matches = intoDataValue.match(regex);

    //if no matches, then no strapi variables in arg
    if (!matches) {
      intoDataValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(intoDataValue);
      intoDataValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(intoDataValue, strapiAttributes);
      _classPrivateFieldGet(this, _fieldElement).setAttribute(intoAttributeName, intoDataValue);
      return;
    }

    //otherwise, replace strapi variables with values from getStrapiComponentValue
    matches.forEach(match => {
      const strapiFieldName = match.substring(2, match.length - 2);
      let strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(strapiFieldName);
      strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(strapiFieldName, strapiAttributes);
      intoDataValue = intoDataValue.replace(match, strapiValue);
    });
    _classPrivateFieldGet(this, _fieldElement).setAttribute(intoAttributeName, intoDataValue);
  });
}
function _processStrapiCSSRule2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-css-rule"], {
    attributeName: "strapi-css-rule",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: "",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "css_rule_template",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION_TEMPLATE,
      substituteQueryStringVariables: true
    }]
  });
  args.forEach(arg => {
    let argValue = arg.subArgs[0].value;

    //strapi variables are wrapped in double curly braces
    const regex = /{{(.*?)}}/g;

    //get all strapi variables in arg and replace with value from getStrapiComponentValue
    const matches = argValue.match(regex);
    if (matches) {
      matches.forEach(match => {
        const strapiFieldName = match.substring(2, match.length - 2);
        let strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(strapiFieldName);
        strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(strapiFieldName, strapiAttributes);
        argValue = argValue.replace(match, strapiValue);
      });
    }

    //add arg to the style attribute of the fieldElement without replacing the existing style attribute
    const existingStyleAttribute = _classPrivateFieldGet(this, _fieldElement).getAttribute("style");
    if (existingStyleAttribute !== null && existingStyleAttribute !== undefined) {
      argValue = existingStyleAttribute + argValue;
    }
    _classPrivateFieldGet(this, _fieldElement).setAttribute("style", argValue);
  });
}
function _processStrapiBackgroundImage2(strapiAttributes) {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-background-image"], {
    attributeName: "strapi-background-image",
    htmlElement: _classPrivateFieldGet(this, _fieldElement),
    subArgumentDeliminator: "",
    multipleArguments: false,
    subArgumentDetails: [{
      name: "background_image_url",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_2__["default"].SUB_ARG_TYPE.COLLECTION_TEMPLATE,
      substituteQueryStringVariables: true
    }]
  });
  const fieldPath = args[0].value;
  const strapiDataValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(fieldPath, strapiAttributes);
  const url = strapiDataValue.data.attributes.url;
  _classPrivateFieldGet(this, _fieldElement).style.backgroundImage = `url(${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}${url})`;
  _classPrivateFieldGet(this, _fieldElement).style.backgroundSize = "cover";
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyField);

/***/ }),

/***/ "./src/StrapifyForm.js":
/*!*****************************!*\
  !*** ./src/StrapifyForm.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }


var _formElement = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _formInputElms = /*#__PURE__*/new WeakMap();
var _formSubmitElm = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _getFormData = /*#__PURE__*/new WeakSet();
var _onAuthSubmit = /*#__PURE__*/new WeakSet();
var _processForm = /*#__PURE__*/new WeakSet();
var _processAuth = /*#__PURE__*/new WeakSet();
class StrapifyForm {
  constructor(formElement) {
    _classPrivateMethodInitSpec(this, _processAuth);
    _classPrivateMethodInitSpec(this, _processForm);
    _classPrivateMethodInitSpec(this, _onAuthSubmit);
    _classPrivateMethodInitSpec(this, _getFormData);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _formElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _formInputElms, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _formSubmitElm, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-form": undefined,
        "strapi-auth": undefined,
        "strapi-success-redirect": undefined,
        "strapi-error-redirect": undefined
      }
    });
    _classPrivateFieldSet(this, _formElement, formElement);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    // 	this.#mutationObserver = new MutationObserver((mutations) => {
    // 		mutations.forEach((mutation) => {
    // 			if (mutation.type === "attributes") {
    // 				this.#updateAttributes();
    // 				this.process();
    // 			}
    // 		});
    // 	});

    // 	this.#mutationObserver.observe(this.#singleTypeElement, {
    // 		attributes: true,
    // 		attributeFilter: ["strapi-single-type"]
    // 	});

    _classPrivateFieldSet(this, _formInputElms, _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].findFormInputElms(_classPrivateFieldGet(this, _formElement)));
    _classPrivateFieldSet(this, _formSubmitElm, _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].findFormSubmitElms(_classPrivateFieldGet(this, _formElement))[0]);

    // set any strapi-auth forms to return false on submit
    if (_classPrivateFieldGet(this, _attributes)["strapi-auth"]) {
      _classPrivateFieldGet(this, _formElement).addEventListener("submit", e => {
        e.preventDefault();
        return false;
      });
    }

    // this.#formElement.addEventListener("strapiAuthRegistered", (event) => {
    // 	console.log(event);
    // });

    // this.#formElement.addEventListener("strapiAuthLoggedIn", (event) => {
    // 	console.log(event);
    // });
  }

  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
  }
  async process() {
    if (_classPrivateFieldGet(this, _attributes)["strapi-form"]) {
      await _classPrivateMethodGet(this, _processForm, _processForm2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-auth"]) {
      await _classPrivateMethodGet(this, _processAuth, _processAuth2).call(this);
    }
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _formElement).getAttribute(attribute);
  });
}
function _getFormData2() {
  const formData = {};
  _classPrivateFieldGet(this, _formInputElms).forEach(inputElm => {
    let name = inputElm.getAttribute("strapi-form-input");
    if (!name) {
      name = inputElm.getAttribute("strapi-auth-input");
    }

    // split input value by | separator, with optional whitespace (e.g. "username | email")
    const names = name.split(/\s*\|\s*/);
    names.forEach(name => {
      name = name.trim();
      formData[name] = inputElm.value;
    });
  });
  return formData;
}
async function _onAuthSubmit2(e) {
  const formData = _classPrivateMethodGet(this, _getFormData, _getFormData2).call(this);
  if (_classPrivateFieldGet(this, _attributes)["strapi-auth"] === "register") {
    try {
      const responseData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_1__.strapiRegister)(formData);
      localStorage.setItem("jwt", responseData.jwt);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      //dispatch custom event with registered user data
      _classPrivateFieldGet(this, _formElement).dispatchEvent(new CustomEvent("strapiAuthRegistered", {
        bubbles: false,
        detail: {
          user: responseData.user
        }
      }));
      if (_classPrivateFieldGet(this, _attributes)["strapi-success-redirect"]) {
        window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-success-redirect"];
      }
    } catch (error) {
      //dispatch custom event with error
      _classPrivateFieldGet(this, _formElement).dispatchEvent(new CustomEvent("strapiAuthRegisterError", {
        bubbles: false,
        detail: {
          error: error,
          errorMessage: error.response.data.error.message
        }
      }));
      if (_classPrivateFieldGet(this, _attributes)["strapi-error-redirect"]) {
        window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-error-redirect"];
      }
      console.error(error);
      console.error(error.response.data.error.message);
    }
  } else if (_classPrivateFieldGet(this, _attributes)["strapi-auth"] === "authenticate") {
    try {
      const responseData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_1__.strapiAuthenticate)(formData.identifier, formData.password);
      localStorage.setItem("jwt", responseData.jwt);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      //dispatch custom event with authenticated user data
      _classPrivateFieldGet(this, _formElement).dispatchEvent(new CustomEvent("strapiAuthLoggedIn", {
        bubbles: false,
        detail: {
          user: responseData.user
        }
      }));
      if (_classPrivateFieldGet(this, _attributes)["strapi-success-redirect"]) {
        window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-success-redirect"];
      }
    } catch (error) {
      //dispatch custom event with error
      _classPrivateFieldGet(this, _formElement).dispatchEvent(new CustomEvent("strapiAuthLogInError", {
        bubbles: false,
        detail: {
          error: error,
          errorMessage: error.response.data.error.message
        }
      }));
      if (_classPrivateFieldGet(this, _attributes)["strapi-error-redirect"]) {
        window.location.href = _classPrivateFieldGet(this, _attributes)["strapi-error-redirect"];
      }
      console.error(error);
      console.error(error.response.data.error.message);
    }
  }
}
async function _processForm2() {}
async function _processAuth2() {
  //remove any existing event listeners
  _classPrivateFieldGet(this, _formSubmitElm).removeEventListener("click", _classPrivateMethodGet(this, _onAuthSubmit, _onAuthSubmit2).bind(this));
  _classPrivateFieldGet(this, _formSubmitElm).addEventListener("click", _classPrivateMethodGet(this, _onAuthSubmit, _onAuthSubmit2).bind(this));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyForm);

/***/ }),

/***/ "./src/StrapifyParse.js":
/*!******************************!*\
  !*** ./src/StrapifyParse.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");

const debugMode = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].debugMode;
const debugStrict = true;
const validateStrapiEndpoints = true; //Strapify.debugValidateStrapiEndpoints;

//sub argument types enum
const SUB_ARG_TYPE = Object.freeze({
  SINGLE_TYPE: "SINGLE_TYPE",
  SINGLE_TYPE_TEMPLATE: "SINGLE_TYPE_TEMPLATE",
  SINGLE_TYPE_CONDITION: "SINGLE_TYPE_CONDITION",
  COLLECTION: "COLLECTION",
  COLLECTION_TEMPLATE: "COLLECTION_TEMPLATE",
  COLLECTION_CONDITION: "COLLECTION_CONDITION",
  STRING: "STRING"
});
class StrapifyAttributeValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "StrapifyAttributeValueError";
  }
}
function emitError(message) {
  if (debugStrict) {
    throw new StrapifyAttributeValueError(message);
  } else {
    console.error(`Strapify Error\n${message}`);
  }
}
function validateStrapiEndpointsForSubArg(subArg, parseDetails) {
  if (subArg.details.type === SUB_ARG_TYPE.COLLECTION) {
    //determine collection name
    const collectionName = parseDetails.htmlElement.closest("[strapi-collection]").getAttribute("strapi-collection");

    //attempt to fetch collection
  }
}

function splitArguments(attributeValue, parseDetails) {
  //split at single occurences of pipe, but not double or more pipes

  function findSingleBars(inputString) {
    let results = [];
    let prevChar = '';
    for (let i = 0; i < inputString.length; i++) {
      let char = inputString.charAt(i);
      if (char === '|' && prevChar !== '|' && (i + 1 === inputString.length || inputString.charAt(i + 1) !== '|')) {
        results.push(i);
      }
      prevChar = char;
    }
    return results;
  }
  function splitBySingleBars(inputString) {
    let indices = findSingleBars(inputString);
    let substrings = [];
    let start = 0;
    for (let i = 0; i < indices.length; i++) {
      let end = indices[i];
      substrings.push(inputString.substring(start, end));
      start = end + 1;
    }
    substrings.push(inputString.substring(start));
    return substrings;
  }
  let argValues = splitBySingleBars(attributeValue);
  let args = argValues.map((arg, i) => {
    return {
      index: i,
      value: arg.trim()
    };
  });

  //DEBUG -- check if multiple arguments were given when not allowed
  if (debugMode) {
    if (!parseDetails.multipleArguments && args.length > 1) {
      const joinedArgs = args.map(arg => arg.value).join(", ");
      emitError(`\nThe ${parseDetails.attributeName} attribute only accepts a single argument, but multiple arguments were given: [${joinedArgs}]`);
    }
  }
  return args;
}

//assumes templatable sub arguments occur as first sub argument
function splitSubArguments(arg, parseDetails) {
  let subArgCount = parseDetails.subArgumentDetails.length;
  if (subArgCount === 1 || parseDetails.subArgumentDeliminator.trim() === "") {
    return [{
      index: 0,
      value: arg.value,
      templateMatches: null,
      details: parseDetails.subArgumentDetails[0]
    }];
  }

  //split the argument into sub arguments
  let subArgsValues = arg.value.split(parseDetails.subArgumentDeliminator);

  //remove elements at front of array until the array is the correct length, join what is removed and add it as the first element
  let removed = [];
  while (subArgsValues.length + 1 > subArgCount) {
    removed.push(subArgsValues.shift());
  }
  subArgsValues.unshift(removed.join(parseDetails.subArgumentDeliminator));
  subArgsValues = subArgsValues.map(a => a.trim());

  /* !!! this will never work because extra subargs will be assumed to be part of a possible templatable subarg !!! */
  //DEBUG -- check if the correct number of sub arguments were given
  if (debugMode) {
    if (subArgsValues.length != subArgCount) {
      emitError(`\nThe ${parseDetails.attributeName} attribute expects ${subArgCount} sub-arguments, but ${subArgsValues.length - 1} were given: [${subArgsValues.join(", ")}]`);
    }
  }
  const subArgs = subArgsValues.map((subArg, i) => {
    return {
      index: i,
      value: subArg,
      templateMatches: null,
      details: parseDetails.subArgumentDetails[i]
    };
  });

  //convert subargs array to object, with the name of the subarg as the key
  let subArgsObj = {};
  subArgs.forEach(subArg => {
    subArgsObj[subArg.details.name] = subArg;
  });
  return subArgs;
}
function parseMatchesFromTemplateSubargument(subArg) {
  //strapi variables are wrapped in double curly braces {{ }}
  const regex = /{{(.*?)}}/g;

  //get the matches
  let matches = subArg.value.match(regex);
  if (matches) {
    matches = matches.map(match => {
      return {
        value: match,
        contents: match.substring(2, match.length - 2).trim(),
        index: subArg.value.indexOf(match)
      };
    });

    //DEBUG -- check if any of the matches are empty
    if (debugMode) {
      matches.forEach(match => {
        if (match.contents === "") {
          emitError(`\nThe ${subArg.details.name} sub-argument of the ${subArg.details.attributeName} attribute contains an empty template: ${match.value}`);
        }
      });
    }
  }
  return matches;
}
function substituteSubArgWithQueryStringVariables(subArg, parseDetails) {
  const subArgValue = subArg.value;
  if (debugMode) {
    const queryStringVariables = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getQueryStringVariables();
    const matches = subArgValue.match(/qs\.([\w\-2]+)/gm);

    //DEBUG -- check if the query string variable exists
    const missingQueryStringVariables = [];
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const variableName = match.replace("qs.", "");
        if (!queryStringVariables[variableName]) {
          missingQueryStringVariables.push(variableName);
        }
      }
    }
    if (missingQueryStringVariables.length > 0) {
      emitError(`\nError for sub argument: ${subArgValue}.\nUndefined query string variables: ${missingQueryStringVariables.join(", ")}`);
    }
  }

  //replace all query string variables with their values
  const populatedSubArgValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(subArgValue);
  subArg.value = populatedSubArgValue;
}
function parseAttribute(attributeValue) {
  let parseDetails = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    //grouped for convenience
    attributeName: "strapi-attribute",
    //name of the attribute to parse
    htmlElement: undefined,
    //html element the attribute containing the attribute
    subArgumentDeliminator: ",",
    //deliminator to split subarguments by
    multipleArguments: false,
    //whether or not multiple arguments are allowed
    subArgumentDetails: [
    //array of sub argument details
    {
      name: "sub-argument",
      //human readable name for error messages
      type: SUB_ARG_TYPE.COLLECTION,
      //type of sub argument, see enum above
      substituteQueryStringVariables: true //whether or not to substitute query string variables
    }]
  };

  //set the default parseDetails
  parseDetails.attributeName == null && (parseDetails.attributeName = "missing-attribute-name");
  parseDetails.subArgumentDetails == null && (parseDetails.subArgumentDetails = []);
  parseDetails.subArgumentDeliminator == null && (parseDetails.subArgumentDeliminator = ",");
  parseDetails.multipleArguments == null && (parseDetails.multipleArguments = false);

  //DEBUG -- check if the attribute value is empty when it shouldn't be
  if (debugMode) {
    if (attributeValue.trim() === "") {
      emitError(`\nThe ${parseDetails.attributeName} attribute was given an empty value.`);
    }
  }

  //split the attribute value into multiple arguments if necessary
  let args = splitArguments(attributeValue, parseDetails);

  //parse out the subarguments of each argument
  args.forEach(arg => {
    //split argument into subarguments
    const subArgs = splitSubArguments(arg, parseDetails);

    //substitute query string variables
    for (let subArg of subArgs) {
      if (subArg.details.substituteQueryStringVariables && subArg.details.type !== SUB_ARG_TYPE.STRING) {
        substituteSubArgWithQueryStringVariables(subArg, parseDetails);
      }
    }

    //parse out the matches from templatable sub arguments
    for (let subArg of subArgs) {
      if (subArg.details.type === SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE || subArg.details.type === SUB_ARG_TYPE.COLLECTION_TEMPLATE) {
        subArg.templateMatches = parseMatchesFromTemplateSubargument(subArg);
      }
    }
    arg.subArgs = subArgs;
  });

  // //DEBUG -- validate strapi endpoints
  // if (debugMode && validateStrapiEndpoints) {
  // 	for (let arg of args) {
  // 		for (let subArg of arg.subArgs) {
  // 			validateStrapiEndpointsForSubArg(subArg, parseDetails);
  // 		}
  // 	}
  // }

  return args;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  SUB_ARG_TYPE,
  parseAttribute
});

/***/ }),

/***/ "./src/StrapifyRelation.js":
/*!*********************************!*\
  !*** ./src/StrapifyRelation.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify.js */ "./src/Strapify.js");
/* harmony import */ var _StrapifyCollection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyCollection.js */ "./src/StrapifyCollection.js");
/* harmony import */ var _StrapifyField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyField */ "./src/StrapifyField.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }




var _relationElement = /*#__PURE__*/new WeakMap();
var _strapifyCollection = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _strapiDataId = /*#__PURE__*/new WeakMap();
var _strapiDataAttributes = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
class StrapifyTemplate {
  constructor(relationElement, strapiDataId, strapiDataAttributes) {
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _relationElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapifyCollection, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataId, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataAttributes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-relation": undefined,
        "strapi-single-type-relation": undefined
      }
    });
    //set the collection element and update the attributes
    _classPrivateFieldSet(this, _relationElement, relationElement);
    _classPrivateFieldSet(this, _strapiDataId, strapiDataId);
    _classPrivateFieldSet(this, _strapiDataAttributes, strapiDataAttributes);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    //create mutation observer to watch for attribute changes
    _classPrivateFieldSet(this, _mutationObserver, new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
          this.process();
        }
      });
    }));

    //observe the collection element for attribute changes
    _classPrivateFieldGet(this, _mutationObserver).observe(_classPrivateFieldGet(this, _relationElement), {
      attributes: true,
      attributeFilter: ["strapi-relation"]
    });
  }
  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
    _classPrivateFieldGet(this, _strapifyCollection).destroy();
    _classPrivateFieldGet(this, _relationElement).remove();
  }
  async process() {
    const relationElement = _classPrivateFieldGet(this, _relationElement);
    if (_classPrivateFieldGet(this, _strapifyCollection)) {
      _classPrivateFieldGet(this, _strapifyCollection).destroy();
    }
    const strapiDataId = _classPrivateFieldGet(this, _strapiDataId);
    const strapiDataAttributes = _classPrivateFieldGet(this, _strapiDataAttributes);

    //use the relation ids to generate a filter string
    let relationArgs;
    let relationFieldName;
    let relationCollectionName;
    if (_classPrivateFieldGet(this, _attributes)["strapi-relation"]) {
      relationArgs = _classPrivateFieldGet(this, _attributes)["strapi-relation"].split(",").map(arg => arg.trim());
      relationFieldName = relationArgs[0];
      relationCollectionName = relationArgs[1];
    } else if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"]) {
      relationArgs = _classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"].split(",").map(arg => arg.trim());
      relationFieldName = relationArgs[0].split(".")[1];
      relationCollectionName = relationArgs[1];
    }

    //if the relation field is empty, delete all templates and return
    if (strapiDataAttributes[relationFieldName].data == null) {
      const templates = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findTemplateElms(relationElement);
      templates.forEach(template => template.remove());
      return;
    }

    //get the relation data
    const relationData = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(relationFieldName, strapiDataAttributes).data;

    //get the relation ids
    let relationIDs = [];
    if (Array.isArray(relationData)) {
      relationIDs = relationData.map(relation => relation.id);
    } else {
      relationIDs = [relationData.id];
    }

    //query string arg offset to allow for the first 10 relations to be used by user
    const qsOffset = 10;

    //use the relation ids to generate a filter string
    let filterString = relationIDs.reduce((acc, cur, i) => {
      let filter = `[id][$in][${qsOffset + i}]=${cur}`;
      i < relationIDs.length - 1 && (filter += " | ");
      return acc + filter;
    }, "");

    //when the filter string is empty, change it to filter for a non-existent id
    if (!filterString) {
      filterString = "[id][$eq]=-1";
    }

    // let filterString
    // if (Array.isArray(relationData)) {
    // 	filterString = relationData.map(relation => `[id][$eq]=${relation.id}`).join(" | ");
    // } else {
    // 	filterString = `[id][$eq]=${relationData.id}`;
    // }

    //add the filter string to the relation element
    relationElement.setAttribute("strapi-filter-internal-relation", filterString);

    //create a strapify collection with the relationelement
    _classPrivateFieldSet(this, _strapifyCollection, new _StrapifyCollection_js__WEBPACK_IMPORTED_MODULE_1__["default"](relationElement));
    await _classPrivateFieldGet(this, _strapifyCollection).process();
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _relationElement).getAttribute(attribute);
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyTemplate);

/***/ }),

/***/ "./src/StrapifyRepeatable.js":
/*!***********************************!*\
  !*** ./src/StrapifyRepeatable.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify.js */ "./src/Strapify.js");
/* harmony import */ var _StrapifyCollection_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyCollection.js */ "./src/StrapifyCollection.js");
/* harmony import */ var _StrapifyField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyField */ "./src/StrapifyField.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }




var _repeatableElement = /*#__PURE__*/new WeakMap();
var _strapifyCollection = /*#__PURE__*/new WeakMap();
var _strapiDataId = /*#__PURE__*/new WeakMap();
var _strapiDataAttributes = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
class StrapifyRepeatable {
  constructor(repeatableElement, strapiDataId, strapiDataAttributes) {
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _repeatableElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapifyCollection, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataId, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataAttributes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-repeatable": undefined,
        "strapi-single-type-repeatable": undefined
      }
    });
    //set the collection element and update the attributes
    _classPrivateFieldSet(this, _repeatableElement, repeatableElement);
    _classPrivateFieldSet(this, _strapiDataId, strapiDataId);
    _classPrivateFieldSet(this, _strapiDataAttributes, strapiDataAttributes);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);

    //create mutation observer to watch for attribute changes
    // this.#mutationObserver = new MutationObserver((mutations) => {
    // 	mutations.forEach((mutation) => {
    // 		if (mutation.type === "attributes") {
    // 			//this.#strapifyCollection.destroy();
    // 			//this.#updateAttributes();
    // 			//this.process();
    // 		}
    // 	});
    // });

    // //observe the collection element for attribute changes
    // this.#mutationObserver.observe(this.#repeatableElement, {
    // 	attributes: true,
    // 	attributeFilter: ["strapi-repeatable", "strapi-single-type-repeatable", "strapi-page", "strapi-page-size"]
    // });
  }

  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
    _classPrivateFieldGet(this, _strapifyCollection).destroy();
    _classPrivateFieldGet(this, _repeatableElement).remove();
  }
  getOverrideData() {
    const fieldName = _classPrivateFieldGet(this, _attributes)["strapi-repeatable"] ? _classPrivateFieldGet(this, _attributes)["strapi-repeatable"] : _classPrivateFieldGet(this, _attributes)["strapi-single-type-repeatable"].split(".")[1];

    //when the data field is null (explicitly not undefined), we have an empty media field
    //StrapifyCollection will delete the element if the data is null
    if (_classPrivateFieldGet(this, _strapiDataAttributes)[fieldName].data === null) {
      _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findTemplateElms(_classPrivateFieldGet(this, _repeatableElement)).forEach(collectionElm => {
        collectionElm.remove();
      });
      return null;
    }

    //if data is not null or undefined, we have a media field
    let overrideData;
    if (_classPrivateFieldGet(this, _strapiDataAttributes)[fieldName].data) {
      overrideData = {
        data: _classPrivateFieldGet(this, _strapiDataAttributes)[fieldName].data.map(fieldData => {
          return {
            attributes: {
              [fieldName]: {
                data: fieldData
              }
            }
          };
        }),
        meta: {}
      };
    }
    //otherwise we must have a component field
    else {
      overrideData = {
        data: _classPrivateFieldGet(this, _strapiDataAttributes)[fieldName].map(fieldData => {
          return {
            attributes: {
              [fieldName]: fieldData
            }
          };
        }),
        meta: {}
      };
    }

    //need to manually paginate since strapi doesn't support pagination on repeatable fields
    const pageSize = parseInt(_classPrivateFieldGet(this, _repeatableElement).getAttribute("strapi-page-size")) || 25;
    const page = parseInt(_classPrivateFieldGet(this, _repeatableElement).getAttribute("strapi-page")) || 1;
    const pageCount = Math.ceil(overrideData.data.length / pageSize);
    const total = overrideData.data.length;

    //split override data into pages
    const pagedOverrideData = [];
    for (let i = 0; i < overrideData.data.length; i += pageSize) {
      pagedOverrideData.push(overrideData.data.slice(i, i + pageSize));
    }

    //replace the data with the page we want
    overrideData.data = pagedOverrideData[page - 1];

    //update the meta
    overrideData.meta.pagination = {
      page,
      pageSize,
      pageCount,
      total
    };
    return overrideData;
  }
  async process() {
    const repeatableElement = _classPrivateFieldGet(this, _repeatableElement);

    //why on earth do I need to bind this to the function?
    const strapifyCollection = new _StrapifyCollection_js__WEBPACK_IMPORTED_MODULE_1__["default"](repeatableElement, this.getOverrideData.bind(this));
    _classPrivateFieldSet(this, _strapifyCollection, strapifyCollection);
    await strapifyCollection.process();
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _repeatableElement).getAttribute(attribute);
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyRepeatable);

/***/ }),

/***/ "./src/StrapifySingleType.js":
/*!***********************************!*\
  !*** ./src/StrapifySingleType.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");
/* harmony import */ var _StrapifyRelation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyRelation */ "./src/StrapifyRelation.js");
/* harmony import */ var _StrapifyRepeatable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyRepeatable */ "./src/StrapifyRepeatable.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");
/* harmony import */ var _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./StrapifyParse */ "./src/StrapifyParse.js");
/* harmony import */ var _StrapifyErrors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StrapifyErrors */ "./src/StrapifyErrors.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }






var _singleTypeElement = /*#__PURE__*/new WeakMap();
var _mutationObserver = /*#__PURE__*/new WeakMap();
var _managedClasses = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _splitSingleTypeNameFromArgument = /*#__PURE__*/new WeakSet();
var _processStrapiSingleTypeClassAdd = /*#__PURE__*/new WeakSet();
var _processStrapiSingleTypeClassReplace = /*#__PURE__*/new WeakSet();
var _processStrapiSingleTypeConditionalClass = /*#__PURE__*/new WeakSet();
var _processStrapiSingleType = /*#__PURE__*/new WeakSet();
var _processStrapiSingleTypeCSSRule = /*#__PURE__*/new WeakSet();
var _processStrapiSingleTypeInto = /*#__PURE__*/new WeakSet();
var _processStrapiBackgroundImage = /*#__PURE__*/new WeakSet();
class StrapifySingleType {
  //the css classes that have been added to the field element (class-add, class-conditional, ...)

  constructor(singleTypeElement) {
    _classPrivateMethodInitSpec(this, _processStrapiBackgroundImage);
    _classPrivateMethodInitSpec(this, _processStrapiSingleTypeInto);
    _classPrivateMethodInitSpec(this, _processStrapiSingleTypeCSSRule);
    _classPrivateMethodInitSpec(this, _processStrapiSingleType);
    _classPrivateMethodInitSpec(this, _processStrapiSingleTypeConditionalClass);
    _classPrivateMethodInitSpec(this, _processStrapiSingleTypeClassReplace);
    _classPrivateMethodInitSpec(this, _processStrapiSingleTypeClassAdd);
    _classPrivateMethodInitSpec(this, _splitSingleTypeNameFromArgument);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _singleTypeElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _mutationObserver, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _managedClasses, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-single-type": undefined,
        "strapi-single-type-into": undefined,
        "strapi-single-type-class-add": undefined,
        "strapi-single-type-class-replace": undefined,
        "strapi-single-type-class-conditional": undefined,
        "strapi-single-type-css-rule": undefined,
        "strapi-single-type-relation": undefined,
        "strapi-single-type-repeatable": undefined,
        "strapi-single-type-background-image": undefined
      }
    });
    _classPrivateFieldSet(this, _singleTypeElement, singleTypeElement);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
    _classPrivateFieldSet(this, _mutationObserver, new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
          this.process();
        }
      });
    }));
    _classPrivateFieldGet(this, _mutationObserver).observe(_classPrivateFieldGet(this, _singleTypeElement), {
      attributes: true,
      attributeFilter: ["strapi-single-type"]
    });
  }
  destroy() {
    _classPrivateFieldGet(this, _mutationObserver).disconnect();
  }
  async process() {
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleType, _processStrapiSingleType2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-into"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleTypeInto, _processStrapiSingleTypeInto2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-css-rule"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleTypeCSSRule, _processStrapiSingleTypeCSSRule2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-add"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleTypeClassAdd, _processStrapiSingleTypeClassAdd2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-replace"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleTypeClassReplace, _processStrapiSingleTypeClassReplace2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-conditional"]) {
      await _classPrivateMethodGet(this, _processStrapiSingleTypeConditionalClass, _processStrapiSingleTypeConditionalClass2).call(this);
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-repeatable"]) {
      const splitSingleTypeArg = _classPrivateFieldGet(this, _attributes)["strapi-single-type-repeatable"].split(".");
      const _singleTypeName = splitSingleTypeArg[0];
      const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + _singleTypeName, "?populate=*");
      const strapifyRepeatable = new _StrapifyRepeatable__WEBPACK_IMPORTED_MODULE_2__["default"](_classPrivateFieldGet(this, _singleTypeElement), strapiData.data.id, strapiData.data.attributes);
      await strapifyRepeatable.process();
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"]) {
      const splitSingleTypeArg = _classPrivateFieldGet(this, _attributes)["strapi-single-type-relation"].split(".");
      const _singleTypeName = splitSingleTypeArg[0];
      const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + _singleTypeName, "?populate=*");
      const strapifyRelation = new _StrapifyRelation__WEBPACK_IMPORTED_MODULE_1__["default"](_classPrivateFieldGet(this, _singleTypeElement), strapiData.data.id, strapiData.data.attributes);
      await strapifyRelation.process();
    }
    if (_classPrivateFieldGet(this, _attributes)["strapi-single-type-background-image"]) {
      await _classPrivateMethodGet(this, _processStrapiBackgroundImage, _processStrapiBackgroundImage2).call(this);
    }

    //remove strapify-hide class
    _classPrivateFieldGet(this, _singleTypeElement).classList.remove("strapify-hide");
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _singleTypeElement).getAttribute(attribute);
  });
}
function _splitSingleTypeNameFromArgument2(argument) {
  const split = argument.split(".");
  if (split.length < 2) {
    _StrapifyErrors__WEBPACK_IMPORTED_MODULE_5__["default"].error(`Invalid strapi-single-type argument: "${argument}". Must be in the format "singleTypeName.fieldName"`);
  }
  const singleTypeName = split[0];
  const singleTypeField = split.slice(1).join(".");
  return {
    singleTypeName,
    singleTypeField
  };
}
async function _processStrapiSingleTypeClassAdd2() {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-add"], {
    attributeName: "strapi-single-type-class-add",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: "",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "strapi_single_type_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE,
      substituteQueryStringVariables: true
    }]
  });
  for (let i = 0; i < args.length; i++) {
    const arg = args[i].value;
    const splitArg = _classPrivateMethodGet(this, _splitSingleTypeNameFromArgument, _splitSingleTypeNameFromArgument2).call(this, arg);
    const singleTypeName = splitArg.singleTypeName;
    const singleTypeField = splitArg.singleTypeField;
    const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
    const className = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeField, strapiData.data.attributes);
    _classPrivateFieldGet(this, _singleTypeElement).classList.add(className);
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "added",
      name: className
    });
  }
}
async function _processStrapiSingleTypeClassReplace2() {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-replace"], {
    attributeName: "strapi-single-type-class-replace",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: ",",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "existing_class_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.STRING,
      substituteQueryStringVariables: false
    }, {
      name: "strapi_single_type_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE,
      substituteQueryStringVariables: true
    }]
  });
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const oldClassName = arg.subArgs[1].value;
    const newClassFieldName = arg.subArgs[0].value;
    const splitArg = _classPrivateMethodGet(this, _splitSingleTypeNameFromArgument, _splitSingleTypeNameFromArgument2).call(this, newClassFieldName);
    const singleTypeName = splitArg.singleTypeName;
    const singleTypeField = splitArg.singleTypeField;
    const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
    const className = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeField, strapiData.data.attributes);
    _classPrivateFieldGet(this, _singleTypeElement).classList.remove(oldClassName);
    _classPrivateFieldGet(this, _singleTypeElement).classList.add(className);
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "removed",
      name: oldClassName
    });
    _classPrivateFieldGet(this, _managedClasses).push({
      state: "added",
      name: className
    });
  }
}
async function _processStrapiSingleTypeConditionalClass2() {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type-class-conditional"], {
    attributeName: "strapi-single-type-class-conditional",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: ",",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "condition",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE_CONDITION,
      substituteQueryStringVariables: false
    }, {
      name: "strapi_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE,
      substituteQueryStringVariables: true
    }]
  });
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const conditionString = arg.subArgs[0].value;
    const className = arg.subArgs[1].value;
    const parsedConditionData = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].parseCondition(conditionString).result;
    const conditionSatisfied = await _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].checkConditionSingleType(parsedConditionData);
    if (conditionSatisfied) {
      _classPrivateFieldGet(this, _singleTypeElement).classList.add(className);
      _classPrivateFieldGet(this, _managedClasses).push({
        state: "added",
        name: className
      });
    }
  }
}
async function _processStrapiSingleType2() {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type"], {
    attributeName: "strapi-single-type",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: "",
    multipleArguments: false,
    subArgumentDetails: [{
      name: "strapi_single_type_field_name",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE,
      substituteQueryStringVariables: true
    }]
  });
  const newClassFieldName = args[0].subArgs[0].value;
  const split = _classPrivateMethodGet(this, _splitSingleTypeNameFromArgument, _splitSingleTypeNameFromArgument2).call(this, newClassFieldName);
  const singleTypeName = split.singleTypeName;
  const singleTypeFieldArg = split.singleTypeField;
  const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, `?populate=${singleTypeFieldArg}`);
  if (!strapiData.data.attributes[singleTypeFieldArg.split(".")[0]] && typeof !strapiData.data.attributes[singleTypeFieldArg.split(".")[0]] !== "boolean") {
    _StrapifyErrors__WEBPACK_IMPORTED_MODULE_5__["default"].error(`Single type attribute "${singleTypeName}.${singleTypeFieldArg}" is invalid. The field "${singleTypeFieldArg}" does not exist on the single type "${singleTypeName}".`);
  }
  const fieldValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldArg, strapiData.data.attributes);
  _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].modifyElmWithStrapiData(fieldValue, _classPrivateFieldGet(this, _singleTypeElement));
}
async function _processStrapiSingleTypeCSSRule2() {
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type-css-rule"], {
    attributeName: "strapi-single-type-css-rule",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: "",
    multipleArguments: true,
    subArgumentDetails: [{
      name: "css_rule_template",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE,
      substituteQueryStringVariables: true
    }]
  });
  let strapiData = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const templateString = arg.subArgs[0].value;
    const htmlAttributeName = "style";

    //strapi variables are wrapped in double curly braces
    const regex = /{{(.*?)}}/g;

    //get all strapi variables in arg and replace with value from getStrapiComponentValue
    const matches = templateString.match(regex);

    //if no matches, then no strapi variables in arg
    if (!matches) {
      const templateStringSplit = _classPrivateMethodGet(this, _splitSingleTypeNameFromArgument, _splitSingleTypeNameFromArgument2).call(this, templateString);
      const singleTypeName = templateStringSplit.singleTypeName;
      let singleTypeFieldString = templateStringSplit.singleTypeField;
      if (!strapiData) {
        strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
      }
      singleTypeFieldString = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
      _classPrivateFieldGet(this, _singleTypeElement).setAttribute(htmlAttributeName, singleTypeFieldString);
      return;
    }
    let singleTypeDataValue = templateString;

    //otherwise, replace strapi variables with values from getStrapiComponentValue
    for (let i = 0; i < matches.length; i++) {
      let match = matches[i];
      const strapiFieldName = match.substring(2, match.length - 2);
      const templateStringSplit = strapiFieldName.split(".");
      const singleTypeName = templateStringSplit[0];
      let singleTypeFieldString = templateStringSplit.filter(arg => arg !== singleTypeName).join(".");
      let strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
      let strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(singleTypeFieldString);
      strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
      singleTypeDataValue = singleTypeDataValue.replace(match, strapiValue);
    }
    _classPrivateFieldGet(this, _singleTypeElement).setAttribute(htmlAttributeName, singleTypeDataValue);
  }
}
async function _processStrapiSingleTypeInto2() {
  const attributeValue = _classPrivateFieldGet(this, _attributes)["strapi-single-type-into"];
  const args = attributeValue.split("|").map(arg => arg.trim());
  let strapiData = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const argSplit = arg.split("->").map(arg => arg.trim());
    const templateString = argSplit[0].trim();
    const htmlAttributeName = argSplit[1].trim();

    //strapi variables are wrapped in double curly braces
    const regex = /{{(.*?)}}/g;

    //get all strapi variables in arg and replace with value from getStrapiComponentValue
    const matches = templateString.match(regex);

    //if no matches, then no strapi variables in arg
    if (!matches) {
      const templateStringSplit = templateString.split(".");
      const singleTypeName = templateStringSplit[0];
      let singleTypeFieldString = templateStringSplit.filter(arg => arg !== singleTypeName).join(".");
      if (!strapiData) {
        strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
      }
      singleTypeFieldString = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(singleTypeFieldString);
      singleTypeFieldString = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
      _classPrivateFieldGet(this, _singleTypeElement).setAttribute(htmlAttributeName, singleTypeFieldString);
      return;
    }
    let singleTypeDataValue = templateString;

    //otherwise, replace strapi variables with values from getStrapiComponentValue
    for (let i = 0; i < matches.length; i++) {
      let match = matches[i];
      const strapiFieldName = match.substring(2, match.length - 2);
      const templateStringSplit = strapiFieldName.split(".");
      const singleTypeName = templateStringSplit[0];
      let singleTypeFieldString = templateStringSplit.filter(arg => arg !== singleTypeName).join(".");
      let strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, "?populate=*");
      let strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].substituteQueryStringVariables(singleTypeFieldString);
      strapiValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
      singleTypeDataValue = singleTypeDataValue.replace(match, strapiValue);
    }
    _classPrivateFieldGet(this, _singleTypeElement).setAttribute(htmlAttributeName, singleTypeDataValue);
  }
}
async function _processStrapiBackgroundImage2() {
  /* eslint-disable */console.log(...oo_oo(`444454518_0`, "hello"));
  const args = _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].parseAttribute(_classPrivateFieldGet(this, _attributes)["strapi-single-type-background-image"], {
    attributeName: "strapi-single-type-background-image",
    htmlElement: _classPrivateFieldGet(this, _singleTypeElement),
    subArgumentDeliminator: "",
    multipleArguments: false,
    subArgumentDetails: [{
      name: "background_image_url",
      type: _StrapifyParse__WEBPACK_IMPORTED_MODULE_4__["default"].SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE,
      substituteQueryStringVariables: true
    }]
  });
  const templateString = args[0].value;
  const templateStringSplit = _classPrivateMethodGet(this, _splitSingleTypeNameFromArgument, _splitSingleTypeNameFromArgument2).call(this, templateString);
  const singleTypeName = templateStringSplit.singleTypeName;
  let singleTypeFieldString = templateStringSplit.singleTypeField;
  const strapiData = await (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_3__["default"])("/api/" + singleTypeName, `?populate=${singleTypeFieldString}`);
  const fieldValue = _Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].getStrapiComponentValue(singleTypeFieldString, strapiData.data.attributes);
  const url = fieldValue.data.attributes.url;
  _classPrivateFieldGet(this, _singleTypeElement).style.backgroundImage = `url(${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}${url})`;
  _classPrivateFieldGet(this, _singleTypeElement).style.backgroundSize = "cover";
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifySingleType);
/* eslint-disable */
;
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x4d24(_0x1eeef1,_0xf15947){var _0x3fefdd=_0x3fef();return _0x4d24=function(_0x4d24c9,_0x546d5e){_0x4d24c9=_0x4d24c9-0x1b4;var _0x2aca2d=_0x3fefdd[_0x4d24c9];return _0x2aca2d;},_0x4d24(_0x1eeef1,_0xf15947);}var _0x438282=_0x4d24;(function(_0x2b5b27,_0x5684ed){var _0x19a2cf=_0x4d24,_0x423c08=_0x2b5b27();while(!![]){try{var _0x8e13=parseInt(_0x19a2cf(0x1fc))/0x1+parseInt(_0x19a2cf(0x261))/0x2*(-parseInt(_0x19a2cf(0x21c))/0x3)+parseInt(_0x19a2cf(0x211))/0x4*(-parseInt(_0x19a2cf(0x290))/0x5)+-parseInt(_0x19a2cf(0x1d3))/0x6*(-parseInt(_0x19a2cf(0x269))/0x7)+-parseInt(_0x19a2cf(0x263))/0x8+-parseInt(_0x19a2cf(0x26e))/0x9*(parseInt(_0x19a2cf(0x24e))/0xa)+-parseInt(_0x19a2cf(0x24f))/0xb*(-parseInt(_0x19a2cf(0x234))/0xc);if(_0x8e13===_0x5684ed)break;else _0x423c08['push'](_0x423c08['shift']());}catch(_0x4b083b){_0x423c08['push'](_0x423c08['shift']());}}}(_0x3fef,0xea743));var j=Object[_0x438282(0x219)],X=Object[_0x438282(0x1cb)],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x438282(0x1ce)],te=Object[_0x438282(0x276)],ne=Object['prototype'][_0x438282(0x1fe)],re=(_0x23e827,_0x52ec00,_0xb165d2,_0x16b002)=>{var _0xe0898e=_0x438282;if(_0x52ec00&&typeof _0x52ec00==_0xe0898e(0x213)||typeof _0x52ec00==_0xe0898e(0x253)){for(let _0x22bec2 of ee(_0x52ec00))!ne['call'](_0x23e827,_0x22bec2)&&_0x22bec2!==_0xb165d2&&X(_0x23e827,_0x22bec2,{'get':()=>_0x52ec00[_0x22bec2],'enumerable':!(_0x16b002=G(_0x52ec00,_0x22bec2))||_0x16b002[_0xe0898e(0x203)]});}return _0x23e827;},K=(_0x2797ee,_0x57ae12,_0x322b74)=>(_0x322b74=_0x2797ee!=null?j(te(_0x2797ee)):{},re(_0x57ae12||!_0x2797ee||!_0x2797ee[_0x438282(0x278)]?X(_0x322b74,'default',{'value':_0x2797ee,'enumerable':!0x0}):_0x322b74,_0x2797ee)),q=class{constructor(_0x3109a7,_0x34b71a,_0x50a674,_0x52c9e6,_0x54e2c9){var _0x37d0ed=_0x438282;this['global']=_0x3109a7,this[_0x37d0ed(0x1e3)]=_0x34b71a,this[_0x37d0ed(0x226)]=_0x50a674,this['nodeModules']=_0x52c9e6,this['dockerizedApp']=_0x54e2c9,this[_0x37d0ed(0x1c9)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x37d0ed(0x20a)]=!0x1,this[_0x37d0ed(0x217)]=!0x1,this[_0x37d0ed(0x1e2)]=!this[_0x37d0ed(0x1d5)][_0x37d0ed(0x26d)]?.['versions']?.[_0x37d0ed(0x1e8)],this[_0x37d0ed(0x274)]=null,this[_0x37d0ed(0x1dd)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x37d0ed(0x1e4)]='https://tinyurl.com/37x8b79t',this[_0x37d0ed(0x1c6)]=(this['_inBrowser']?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x37d0ed(0x1d6))+this[_0x37d0ed(0x1e4)];}async['getWebSocketClass'](){var _0x1b39e7=_0x438282;if(this[_0x1b39e7(0x274)])return this['_WebSocketClass'];let _0x253aee;if(this['_inBrowser'])_0x253aee=this['global'][_0x1b39e7(0x1ec)];else{if(this[_0x1b39e7(0x1d5)]['process']?.[_0x1b39e7(0x262)])_0x253aee=this[_0x1b39e7(0x1d5)][_0x1b39e7(0x26d)]?.[_0x1b39e7(0x262)];else try{let _0x20c494=await import(_0x1b39e7(0x200));_0x253aee=(await import((await import(_0x1b39e7(0x282)))['pathToFileURL'](_0x20c494[_0x1b39e7(0x22e)](this[_0x1b39e7(0x1f6)],'ws/index.js'))[_0x1b39e7(0x1ee)]()))[_0x1b39e7(0x254)];}catch{try{_0x253aee=require(require(_0x1b39e7(0x200))['join'](this[_0x1b39e7(0x1f6)],'ws'));}catch{throw new Error(_0x1b39e7(0x1c0));}}}return this[_0x1b39e7(0x274)]=_0x253aee,_0x253aee;}[_0x438282(0x236)](){var _0x1a3cd5=_0x438282;this[_0x1a3cd5(0x217)]||this['_connected']||this[_0x1a3cd5(0x1dd)]>=this['_maxConnectAttemptCount']||(this[_0x1a3cd5(0x25d)]=!0x1,this[_0x1a3cd5(0x217)]=!0x0,this[_0x1a3cd5(0x1dd)]++,this[_0x1a3cd5(0x1c5)]=new Promise((_0x330344,_0x325b83)=>{var _0x16ec33=_0x1a3cd5;this[_0x16ec33(0x255)]()[_0x16ec33(0x1b8)](_0x41728c=>{var _0x460362=_0x16ec33;let _0x5dff9f=new _0x41728c(_0x460362(0x25c)+(!this[_0x460362(0x1e2)]&&this['dockerizedApp']?_0x460362(0x24a):this[_0x460362(0x1e3)])+':'+this['port']);_0x5dff9f['onerror']=()=>{var _0x2e215b=_0x460362;this[_0x2e215b(0x1c9)]=!0x1,this['_disposeWebsocket'](_0x5dff9f),this['_attemptToReconnectShortly'](),_0x325b83(new Error(_0x2e215b(0x28d)));},_0x5dff9f[_0x460362(0x291)]=()=>{var _0x1fc15f=_0x460362;this['_inBrowser']||_0x5dff9f[_0x1fc15f(0x292)]&&_0x5dff9f['_socket'][_0x1fc15f(0x1f4)]&&_0x5dff9f[_0x1fc15f(0x292)][_0x1fc15f(0x1f4)](),_0x330344(_0x5dff9f);},_0x5dff9f[_0x460362(0x231)]=()=>{var _0x23998c=_0x460362;this[_0x23998c(0x25d)]=!0x0,this[_0x23998c(0x1f5)](_0x5dff9f),this[_0x23998c(0x1fa)]();},_0x5dff9f[_0x460362(0x294)]=_0x772e48=>{var _0x183ce5=_0x460362;try{_0x772e48&&_0x772e48[_0x183ce5(0x214)]&&this[_0x183ce5(0x1e2)]&&JSON[_0x183ce5(0x283)](_0x772e48[_0x183ce5(0x214)])[_0x183ce5(0x1cc)]===_0x183ce5(0x257)&&this[_0x183ce5(0x1d5)][_0x183ce5(0x287)]['reload']();}catch{}};})[_0x16ec33(0x1b8)](_0x3dcc0a=>(this[_0x16ec33(0x20a)]=!0x0,this['_connecting']=!0x1,this[_0x16ec33(0x25d)]=!0x1,this[_0x16ec33(0x1c9)]=!0x0,this[_0x16ec33(0x1dd)]=0x0,_0x3dcc0a))[_0x16ec33(0x243)](_0x4af10c=>(this['_connected']=!0x1,this[_0x16ec33(0x217)]=!0x1,console[_0x16ec33(0x205)](_0x16ec33(0x246)+this[_0x16ec33(0x1e4)]),_0x325b83(new Error(_0x16ec33(0x28c)+(_0x4af10c&&_0x4af10c[_0x16ec33(0x1d0)])))));}));}[_0x438282(0x1f5)](_0x2ab108){var _0x55920e=_0x438282;this[_0x55920e(0x20a)]=!0x1,this[_0x55920e(0x217)]=!0x1;try{_0x2ab108[_0x55920e(0x231)]=null,_0x2ab108['onerror']=null,_0x2ab108['onopen']=null;}catch{}try{_0x2ab108[_0x55920e(0x28a)]<0x2&&_0x2ab108['close']();}catch{}}['_attemptToReconnectShortly'](){var _0x2ec468=_0x438282;clearTimeout(this[_0x2ec468(0x1f1)]),!(this[_0x2ec468(0x1dd)]>=this[_0x2ec468(0x1d2)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x123209=_0x2ec468;this['_connected']||this['_connecting']||(this['_connectToHostNow'](),this[_0x123209(0x1c5)]?.[_0x123209(0x243)](()=>this[_0x123209(0x1fa)]()));},0x1f4),this[_0x2ec468(0x1f1)][_0x2ec468(0x1f4)]&&this['_reconnectTimeout'][_0x2ec468(0x1f4)]());}async[_0x438282(0x272)](_0x25a3f8){var _0x4002f6=_0x438282;try{if(!this[_0x4002f6(0x1c9)])return;this['_allowedToConnectOnSend']&&this[_0x4002f6(0x236)](),(await this['_ws'])[_0x4002f6(0x272)](JSON[_0x4002f6(0x27b)](_0x25a3f8));}catch(_0x246bd9){console[_0x4002f6(0x205)](this[_0x4002f6(0x1c6)]+':\\x20'+(_0x246bd9&&_0x246bd9[_0x4002f6(0x1d0)])),this['_allowedToSend']=!0x1,this[_0x4002f6(0x1fa)]();}}};function J(_0x228194,_0x12b182,_0x5ce5fb,_0x2a75ff,_0x1a7bb2,_0x55ce8a){var _0x1d2a68=_0x438282;let _0x5573db=_0x5ce5fb[_0x1d2a68(0x232)](',')[_0x1d2a68(0x25b)](_0x276f12=>{var _0x25b36b=_0x1d2a68;try{_0x228194[_0x25b36b(0x247)]||((_0x1a7bb2===_0x25b36b(0x1b9)||_0x1a7bb2===_0x25b36b(0x1da)||_0x1a7bb2===_0x25b36b(0x1c1))&&(_0x1a7bb2+=_0x228194['process']?.[_0x25b36b(0x259)]?.[_0x25b36b(0x1e8)]?'\\x20server':'\\x20browser'),_0x228194['_console_ninja_session']={'id':+new Date(),'tool':_0x1a7bb2});let _0x1122dc=new q(_0x228194,_0x12b182,_0x276f12,_0x2a75ff,_0x55ce8a);return _0x1122dc['send'][_0x25b36b(0x288)](_0x1122dc);}catch(_0x233595){return console[_0x25b36b(0x205)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x233595&&_0x233595[_0x25b36b(0x1d0)]),()=>{};}});return _0x5ca097=>_0x5573db['forEach'](_0x32d1bc=>_0x32d1bc(_0x5ca097));}function W(_0x400c65){var _0x7cee1a=_0x438282;let _0x381510=function(_0x49f5f5,_0x4919cb){return _0x4919cb-_0x49f5f5;},_0x30ff51;if(_0x400c65['performance'])_0x30ff51=function(){var _0x5b6463=_0x4d24;return _0x400c65[_0x5b6463(0x289)][_0x5b6463(0x275)]();};else{if(_0x400c65[_0x7cee1a(0x26d)]&&_0x400c65['process'][_0x7cee1a(0x1bf)])_0x30ff51=function(){var _0x36e550=_0x7cee1a;return _0x400c65[_0x36e550(0x26d)][_0x36e550(0x1bf)]();},_0x381510=function(_0x2b8cac,_0x1dd5cd){return 0x3e8*(_0x1dd5cd[0x0]-_0x2b8cac[0x0])+(_0x1dd5cd[0x1]-_0x2b8cac[0x1])/0xf4240;};else try{let {performance:_0x5598aa}=require('perf_hooks');_0x30ff51=function(){var _0x679e47=_0x7cee1a;return _0x5598aa[_0x679e47(0x275)]();};}catch{_0x30ff51=function(){return+new Date();};}}return{'elapsed':_0x381510,'timeStamp':_0x30ff51,'now':()=>Date['now']()};}function Y(_0x451847,_0x4b953b,_0x452e74){var _0x3459f9=_0x438282;if(_0x451847[_0x3459f9(0x27c)]!==void 0x0)return _0x451847[_0x3459f9(0x27c)];let _0x14dc60=_0x451847['process']?.['versions']?.[_0x3459f9(0x1e8)];return _0x14dc60&&_0x452e74==='nuxt'?_0x451847[_0x3459f9(0x27c)]=!0x1:_0x451847[_0x3459f9(0x27c)]=_0x14dc60||!_0x4b953b||_0x451847[_0x3459f9(0x287)]?.['hostname']&&_0x4b953b[_0x3459f9(0x224)](_0x451847['location'][_0x3459f9(0x28f)]),_0x451847['_consoleNinjaAllowedToStart'];}function Q(_0x47d960,_0x3c7f88,_0x5601af,_0x4415ac){var _0x51aae4=_0x438282;_0x47d960=_0x47d960,_0x3c7f88=_0x3c7f88,_0x5601af=_0x5601af,_0x4415ac=_0x4415ac;let _0x48b950=W(_0x47d960),_0x5454c5=_0x48b950['elapsed'],_0x1c80ec=_0x48b950[_0x51aae4(0x210)];class _0xc692a3{constructor(){var _0x479153=_0x51aae4;this[_0x479153(0x251)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x479153(0x265)]=/^(0|[1-9][0-9]*)$/,this[_0x479153(0x242)]=/'([^\\\\']|\\\\')*'/,this[_0x479153(0x215)]=_0x47d960[_0x479153(0x1b5)],this[_0x479153(0x250)]=_0x47d960[_0x479153(0x1e6)],this[_0x479153(0x23e)]=Object['getOwnPropertyDescriptor'],this['_getOwnPropertyNames']=Object[_0x479153(0x1ce)],this[_0x479153(0x20b)]=_0x47d960[_0x479153(0x1fb)],this['_regExpToString']=RegExp[_0x479153(0x1d9)][_0x479153(0x1ee)],this[_0x479153(0x1fd)]=Date[_0x479153(0x1d9)][_0x479153(0x1ee)];}[_0x51aae4(0x239)](_0x57471b,_0x4a9396,_0x2990f0,_0x34d09c){var _0x3995af=_0x51aae4,_0x507257=this,_0x3b58e6=_0x2990f0[_0x3995af(0x279)];function _0xa46520(_0x34ed3c,_0x5326c6,_0xbf1724){var _0x38b851=_0x3995af;_0x5326c6['type']=_0x38b851(0x25f),_0x5326c6[_0x38b851(0x22f)]=_0x34ed3c[_0x38b851(0x1d0)],_0x5f189c=_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)],_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)]=_0x5326c6,_0x507257[_0x38b851(0x229)](_0x5326c6,_0xbf1724);}try{_0x2990f0[_0x3995af(0x1d4)]++,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects']['push'](_0x4a9396);var _0x13de0c,_0x453b9a,_0x3e3e31,_0x3d9257,_0x322156=[],_0x3393c4=[],_0x439173,_0x348688=this[_0x3995af(0x1ed)](_0x4a9396),_0x16bdae=_0x348688==='array',_0x48bd6f=!0x1,_0x2bcc00=_0x348688===_0x3995af(0x253),_0x40ef76=this[_0x3995af(0x225)](_0x348688),_0x535a2a=this['_isPrimitiveWrapperType'](_0x348688),_0x30973f=_0x40ef76||_0x535a2a,_0x23e67b={},_0xfd53ae=0x0,_0x1043d2=!0x1,_0x5f189c,_0xf05db6=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x2990f0[_0x3995af(0x222)]){if(_0x16bdae){if(_0x453b9a=_0x4a9396[_0x3995af(0x23f)],_0x453b9a>_0x2990f0[_0x3995af(0x1bb)]){for(_0x3e3e31=0x0,_0x3d9257=_0x2990f0[_0x3995af(0x1bb)],_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257['_addProperty'](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));_0x57471b[_0x3995af(0x1ba)]=!0x0;}else{for(_0x3e3e31=0x0,_0x3d9257=_0x453b9a,_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1de)](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));}_0x2990f0[_0x3995af(0x23c)]+=_0x3393c4['length'];}if(!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&!_0x40ef76&&_0x348688!==_0x3995af(0x21b)&&_0x348688!==_0x3995af(0x20d)&&_0x348688!=='bigint'){var _0x2c8229=_0x34d09c[_0x3995af(0x235)]||_0x2990f0['props'];if(this['_isSet'](_0x4a9396)?(_0x13de0c=0x0,_0x4a9396[_0x3995af(0x27d)](function(_0x24dfd0){var _0x3a0529=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x3a0529(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0[_0x3a0529(0x27a)]&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3a0529(0x23c)]>_0x2990f0[_0x3a0529(0x286)]){_0x1043d2=!0x0;return;}_0x3393c4['push'](_0x507257[_0x3a0529(0x1de)](_0x322156,_0x4a9396,_0x3a0529(0x1ca),_0x13de0c++,_0x2990f0,function(_0xd668d7){return function(){return _0xd668d7;};}(_0x24dfd0)));})):this['_isMap'](_0x4a9396)&&_0x4a9396[_0x3995af(0x27d)](function(_0x9c4313,_0x1eeee2){var _0x51fe0d=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x51fe0d(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0[_0x51fe0d(0x279)]&&_0x2990f0['autoExpandPropertyCount']>_0x2990f0[_0x51fe0d(0x286)]){_0x1043d2=!0x0;return;}var _0x113e97=_0x1eeee2[_0x51fe0d(0x1ee)]();_0x113e97[_0x51fe0d(0x23f)]>0x64&&(_0x113e97=_0x113e97[_0x51fe0d(0x21e)](0x0,0x64)+_0x51fe0d(0x284)),_0x3393c4[_0x51fe0d(0x212)](_0x507257[_0x51fe0d(0x1de)](_0x322156,_0x4a9396,_0x51fe0d(0x1b7),_0x113e97,_0x2990f0,function(_0x20178b){return function(){return _0x20178b;};}(_0x9c4313)));}),!_0x48bd6f){try{for(_0x439173 in _0x4a9396)if(!(_0x16bdae&&_0xf05db6[_0x3995af(0x26b)](_0x439173))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0[_0x3995af(0x27a)]&&_0x2990f0[_0x3995af(0x279)]&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1f7)](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}catch{}if(_0x23e67b['_p_length']=!0x0,_0x2bcc00&&(_0x23e67b['_p_name']=!0x0),!_0x1043d2){var _0x2c7457=[][_0x3995af(0x266)](this['_getOwnPropertyNames'](_0x4a9396))[_0x3995af(0x266)](this[_0x3995af(0x28b)](_0x4a9396));for(_0x13de0c=0x0,_0x453b9a=_0x2c7457['length'];_0x13de0c<_0x453b9a;_0x13de0c++)if(_0x439173=_0x2c7457[_0x13de0c],!(_0x16bdae&&_0xf05db6['test'](_0x439173['toString']()))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)&&!_0x23e67b[_0x3995af(0x1be)+_0x439173[_0x3995af(0x1ee)]()]){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257['_addObjectProperty'](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}}}}if(_0x57471b['type']=_0x348688,_0x30973f?(_0x57471b[_0x3995af(0x270)]=_0x4a9396[_0x3995af(0x1b4)](),this['_capIfString'](_0x348688,_0x57471b,_0x2990f0,_0x34d09c)):_0x348688===_0x3995af(0x208)?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x1fd)][_0x3995af(0x281)](_0x4a9396):_0x348688===_0x3995af(0x1f3)?_0x57471b['value']=_0x4a9396['toString']():_0x348688===_0x3995af(0x237)?_0x57471b['value']=this[_0x3995af(0x22b)][_0x3995af(0x281)](_0x4a9396):_0x348688==='symbol'&&this[_0x3995af(0x20b)]?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x20b)][_0x3995af(0x1d9)][_0x3995af(0x1ee)][_0x3995af(0x281)](_0x4a9396):!_0x2990f0[_0x3995af(0x222)]&&!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&(delete _0x57471b[_0x3995af(0x270)],_0x57471b[_0x3995af(0x1b6)]=!0x0),_0x1043d2&&(_0x57471b[_0x3995af(0x1bc)]=!0x0),_0x5f189c=_0x2990f0['node']['current'],_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x57471b,this['_treeNodePropertiesBeforeFullValue'](_0x57471b,_0x2990f0),_0x3393c4[_0x3995af(0x23f)]){for(_0x13de0c=0x0,_0x453b9a=_0x3393c4[_0x3995af(0x23f)];_0x13de0c<_0x453b9a;_0x13de0c++)_0x3393c4[_0x13de0c](_0x13de0c);}_0x322156[_0x3995af(0x23f)]&&(_0x57471b['props']=_0x322156);}catch(_0x4d3528){_0xa46520(_0x4d3528,_0x57471b,_0x2990f0);}return this[_0x3995af(0x209)](_0x4a9396,_0x57471b),this[_0x3995af(0x227)](_0x57471b,_0x2990f0),_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x5f189c,_0x2990f0['level']--,_0x2990f0[_0x3995af(0x279)]=_0x3b58e6,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects'][_0x3995af(0x297)](),_0x57471b;}[_0x51aae4(0x28b)](_0x6adba){var _0x2393e6=_0x51aae4;return Object[_0x2393e6(0x22c)]?Object[_0x2393e6(0x22c)](_0x6adba):[];}[_0x51aae4(0x1ef)](_0xb13f3d){var _0x409162=_0x51aae4;return!!(_0xb13f3d&&_0x47d960[_0x409162(0x1ca)]&&this[_0x409162(0x223)](_0xb13f3d)===_0x409162(0x21f)&&_0xb13f3d[_0x409162(0x27d)]);}['_blacklistedProperty'](_0x1a1779,_0x501292,_0x29e2a5){var _0x175cef=_0x51aae4;return _0x29e2a5[_0x175cef(0x21d)]?typeof _0x1a1779[_0x501292]==_0x175cef(0x253):!0x1;}[_0x51aae4(0x1ed)](_0x4cdb60){var _0x388439=_0x51aae4,_0x566a0c='';return _0x566a0c=typeof _0x4cdb60,_0x566a0c===_0x388439(0x213)?this['_objectToString'](_0x4cdb60)===_0x388439(0x1dc)?_0x566a0c='array':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x202)?_0x566a0c='date':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x24d)?_0x566a0c=_0x388439(0x1f3):_0x4cdb60===null?_0x566a0c='null':_0x4cdb60[_0x388439(0x20f)]&&(_0x566a0c=_0x4cdb60[_0x388439(0x20f)][_0x388439(0x25a)]||_0x566a0c):_0x566a0c===_0x388439(0x1b5)&&this[_0x388439(0x250)]&&_0x4cdb60 instanceof this[_0x388439(0x250)]&&(_0x566a0c=_0x388439(0x1e6)),_0x566a0c;}['_objectToString'](_0x12a36e){var _0x280626=_0x51aae4;return Object[_0x280626(0x1d9)][_0x280626(0x1ee)][_0x280626(0x281)](_0x12a36e);}['_isPrimitiveType'](_0x4dd78e){var _0x30f507=_0x51aae4;return _0x4dd78e===_0x30f507(0x1f8)||_0x4dd78e===_0x30f507(0x241)||_0x4dd78e===_0x30f507(0x1e5);}[_0x51aae4(0x264)](_0x3f7bc8){var _0x4fadad=_0x51aae4;return _0x3f7bc8==='Boolean'||_0x3f7bc8===_0x4fadad(0x21b)||_0x3f7bc8===_0x4fadad(0x23a);}[_0x51aae4(0x1de)](_0x1408ed,_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e){var _0x3881c6=this;return function(_0x22f694){var _0x1281ee=_0x4d24,_0x796d02=_0x5a8e0b['node'][_0x1281ee(0x285)],_0x1581db=_0x5a8e0b[_0x1281ee(0x1e8)]['index'],_0x472ccc=_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)];_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)]=_0x796d02,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=typeof _0x43725c==_0x1281ee(0x1e5)?_0x43725c:_0x22f694,_0x1408ed[_0x1281ee(0x212)](_0x3881c6['_property'](_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e)),_0x5a8e0b[_0x1281ee(0x1e8)]['parent']=_0x472ccc,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=_0x1581db;};}['_addObjectProperty'](_0x4d1d59,_0x4e3ee3,_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa){var _0x43c57a=_0x51aae4,_0x516743=this;return _0x4e3ee3[_0x43c57a(0x1be)+_0x23e3b7[_0x43c57a(0x1ee)]()]=!0x0,function(_0x51c0b8){var _0x22cf08=_0x43c57a,_0x42eec5=_0x366bab[_0x22cf08(0x1e8)]['current'],_0x237acd=_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)],_0xf2c09=_0x366bab['node']['parent'];_0x366bab['node']['parent']=_0x42eec5,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x51c0b8,_0x4d1d59[_0x22cf08(0x212)](_0x516743['_property'](_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa)),_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x296)]=_0xf2c09,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x237acd;};}[_0x51aae4(0x26c)](_0x37a575,_0x49085f,_0x5d231c,_0x187a39,_0x152229){var _0x553b52=_0x51aae4,_0x2e6cd7=this;_0x152229||(_0x152229=function(_0x395faa,_0x34adff){return _0x395faa[_0x34adff];});var _0x4b41a6=_0x5d231c['toString'](),_0x5bdf24=_0x187a39[_0x553b52(0x271)]||{},_0x1d7982=_0x187a39[_0x553b52(0x222)],_0x25f62c=_0x187a39[_0x553b52(0x27a)];try{var _0x207856=this['_isMap'](_0x37a575),_0x16cab6=_0x4b41a6;_0x207856&&_0x16cab6[0x0]==='\\x27'&&(_0x16cab6=_0x16cab6[_0x553b52(0x1cd)](0x1,_0x16cab6[_0x553b52(0x23f)]-0x2));var _0x2b595b=_0x187a39['expressionsToEvaluate']=_0x5bdf24['_p_'+_0x16cab6];_0x2b595b&&(_0x187a39['depth']=_0x187a39[_0x553b52(0x222)]+0x1),_0x187a39[_0x553b52(0x27a)]=!!_0x2b595b;var _0x2a23d3=typeof _0x5d231c=='symbol',_0x30a31b={'name':_0x2a23d3||_0x207856?_0x4b41a6:this['_propertyName'](_0x4b41a6)};if(_0x2a23d3&&(_0x30a31b['symbol']=!0x0),!(_0x49085f===_0x553b52(0x244)||_0x49085f===_0x553b52(0x295))){var _0x2fc78c=this[_0x553b52(0x23e)](_0x37a575,_0x5d231c);if(_0x2fc78c&&(_0x2fc78c[_0x553b52(0x22d)]&&(_0x30a31b[_0x553b52(0x298)]=!0x0),_0x2fc78c[_0x553b52(0x1e1)]&&!_0x2b595b&&!_0x187a39[_0x553b52(0x1bd)]))return _0x30a31b[_0x553b52(0x1e7)]=!0x0,this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x18a672;try{_0x18a672=_0x152229(_0x37a575,_0x5d231c);}catch(_0x551470){return _0x30a31b={'name':_0x4b41a6,'type':_0x553b52(0x25f),'error':_0x551470[_0x553b52(0x1d0)]},this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x375afe=this[_0x553b52(0x1ed)](_0x18a672),_0x65dc08=this[_0x553b52(0x225)](_0x375afe);if(_0x30a31b[_0x553b52(0x248)]=_0x375afe,_0x65dc08)this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x4c3409=_0x553b52;_0x30a31b[_0x4c3409(0x270)]=_0x18a672[_0x4c3409(0x1b4)](),!_0x2b595b&&_0x2e6cd7['_capIfString'](_0x375afe,_0x30a31b,_0x187a39,{});});else{var _0xfc3fca=_0x187a39[_0x553b52(0x279)]&&_0x187a39['level']<_0x187a39[_0x553b52(0x29b)]&&_0x187a39[_0x553b52(0x24c)][_0x553b52(0x216)](_0x18a672)<0x0&&_0x375afe!==_0x553b52(0x253)&&_0x187a39[_0x553b52(0x23c)]<_0x187a39['autoExpandLimit'];_0xfc3fca||_0x187a39['level']<_0x1d7982||_0x2b595b?(this[_0x553b52(0x239)](_0x30a31b,_0x18a672,_0x187a39,_0x2b595b||{}),this[_0x553b52(0x209)](_0x18a672,_0x30a31b)):this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x2ab07a=_0x553b52;_0x375afe===_0x2ab07a(0x206)||_0x375afe===_0x2ab07a(0x1b5)||(delete _0x30a31b[_0x2ab07a(0x270)],_0x30a31b[_0x2ab07a(0x1b6)]=!0x0);});}return _0x30a31b;}finally{_0x187a39[_0x553b52(0x271)]=_0x5bdf24,_0x187a39[_0x553b52(0x222)]=_0x1d7982,_0x187a39[_0x553b52(0x27a)]=_0x25f62c;}}['_capIfString'](_0x53dd7c,_0x1b3ea4,_0x491216,_0x4c2903){var _0x44104a=_0x51aae4,_0x480eee=_0x4c2903['strLength']||_0x491216['strLength'];if((_0x53dd7c==='string'||_0x53dd7c===_0x44104a(0x21b))&&_0x1b3ea4[_0x44104a(0x270)]){let _0x246eaa=_0x1b3ea4['value'][_0x44104a(0x23f)];_0x491216[_0x44104a(0x29a)]+=_0x246eaa,_0x491216[_0x44104a(0x29a)]>_0x491216[_0x44104a(0x25e)]?(_0x1b3ea4['capped']='',delete _0x1b3ea4[_0x44104a(0x270)]):_0x246eaa>_0x480eee&&(_0x1b3ea4[_0x44104a(0x1b6)]=_0x1b3ea4['value'][_0x44104a(0x1cd)](0x0,_0x480eee),delete _0x1b3ea4[_0x44104a(0x270)]);}}['_isMap'](_0x1271b3){var _0x121e09=_0x51aae4;return!!(_0x1271b3&&_0x47d960[_0x121e09(0x1b7)]&&this[_0x121e09(0x223)](_0x1271b3)===_0x121e09(0x249)&&_0x1271b3[_0x121e09(0x27d)]);}['_propertyName'](_0x463ce7){var _0x33b700=_0x51aae4;if(_0x463ce7[_0x33b700(0x26f)](/^\\d+$/))return _0x463ce7;var _0x40e686;try{_0x40e686=JSON['stringify'](''+_0x463ce7);}catch{_0x40e686='\\x22'+this[_0x33b700(0x223)](_0x463ce7)+'\\x22';}return _0x40e686['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x40e686=_0x40e686['substr'](0x1,_0x40e686['length']-0x2):_0x40e686=_0x40e686['replace'](/'/g,'\\x5c\\x27')[_0x33b700(0x238)](/\\\\\"/g,'\\x22')[_0x33b700(0x238)](/(^\"|\"$)/g,'\\x27'),_0x40e686;}[_0x51aae4(0x207)](_0x466e70,_0x5f1501,_0x4fc60a,_0x4fad2c){var _0x3871f9=_0x51aae4;this['_treeNodePropertiesBeforeFullValue'](_0x466e70,_0x5f1501),_0x4fad2c&&_0x4fad2c(),this[_0x3871f9(0x209)](_0x4fc60a,_0x466e70),this[_0x3871f9(0x227)](_0x466e70,_0x5f1501);}[_0x51aae4(0x229)](_0xa14bc4,_0x244522){var _0x24f631=_0x51aae4;this[_0x24f631(0x27f)](_0xa14bc4,_0x244522),this[_0x24f631(0x1f9)](_0xa14bc4,_0x244522),this[_0x24f631(0x218)](_0xa14bc4,_0x244522),this[_0x24f631(0x267)](_0xa14bc4,_0x244522);}[_0x51aae4(0x27f)](_0x574fea,_0x561fe9){}[_0x51aae4(0x1f9)](_0x8f8f59,_0x1dcac6){}[_0x51aae4(0x20c)](_0x13def9,_0x511419){}['_isUndefined'](_0xa4d6b5){var _0x48aba8=_0x51aae4;return _0xa4d6b5===this[_0x48aba8(0x215)];}[_0x51aae4(0x227)](_0x459431,_0x1c4011){var _0x3e5623=_0x51aae4;this[_0x3e5623(0x20c)](_0x459431,_0x1c4011),this[_0x3e5623(0x1e9)](_0x459431),_0x1c4011[_0x3e5623(0x1c8)]&&this[_0x3e5623(0x1c3)](_0x459431),this[_0x3e5623(0x1db)](_0x459431,_0x1c4011),this[_0x3e5623(0x27e)](_0x459431,_0x1c4011),this[_0x3e5623(0x22a)](_0x459431);}[_0x51aae4(0x209)](_0x37adca,_0x3b272d){var _0x49c3ad=_0x51aae4;let _0x2f3b69;try{_0x47d960['console']&&(_0x2f3b69=_0x47d960['console']['error'],_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=function(){}),_0x37adca&&typeof _0x37adca['length']==_0x49c3ad(0x1e5)&&(_0x3b272d['length']=_0x37adca[_0x49c3ad(0x23f)]);}catch{}finally{_0x2f3b69&&(_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=_0x2f3b69);}if(_0x3b272d[_0x49c3ad(0x248)]==='number'||_0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x23a)){if(isNaN(_0x3b272d[_0x49c3ad(0x270)]))_0x3b272d[_0x49c3ad(0x204)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];else switch(_0x3b272d[_0x49c3ad(0x270)]){case Number[_0x49c3ad(0x1e0)]:_0x3b272d[_0x49c3ad(0x24b)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];break;case Number['NEGATIVE_INFINITY']:_0x3b272d[_0x49c3ad(0x201)]=!0x0,delete _0x3b272d['value'];break;case 0x0:this[_0x49c3ad(0x26a)](_0x3b272d[_0x49c3ad(0x270)])&&(_0x3b272d['negativeZero']=!0x0);break;}}else _0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x253)&&typeof _0x37adca['name']==_0x49c3ad(0x241)&&_0x37adca[_0x49c3ad(0x25a)]&&_0x3b272d[_0x49c3ad(0x25a)]&&_0x37adca['name']!==_0x3b272d['name']&&(_0x3b272d[_0x49c3ad(0x280)]=_0x37adca['name']);}[_0x51aae4(0x26a)](_0x5823dc){return 0x1/_0x5823dc===Number['NEGATIVE_INFINITY'];}[_0x51aae4(0x1c3)](_0x4f14fc){var _0x34b346=_0x51aae4;!_0x4f14fc[_0x34b346(0x235)]||!_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x23f)]||_0x4f14fc[_0x34b346(0x248)]==='array'||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1b7)||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1ca)||_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x1f0)](function(_0x21d513,_0x1aca99){var _0x10bcf7=_0x34b346,_0x3eb18c=_0x21d513[_0x10bcf7(0x25a)][_0x10bcf7(0x1f2)](),_0x3b64f5=_0x1aca99[_0x10bcf7(0x25a)]['toLowerCase']();return _0x3eb18c<_0x3b64f5?-0x1:_0x3eb18c>_0x3b64f5?0x1:0x0;});}[_0x51aae4(0x1db)](_0x472fd6,_0x507653){var _0x4d3e82=_0x51aae4;if(!(_0x507653[_0x4d3e82(0x21d)]||!_0x472fd6[_0x4d3e82(0x235)]||!_0x472fd6[_0x4d3e82(0x235)][_0x4d3e82(0x23f)])){for(var _0x4ec0fa=[],_0xcfdc29=[],_0x15b014=0x0,_0x16cbad=_0x472fd6[_0x4d3e82(0x235)]['length'];_0x15b014<_0x16cbad;_0x15b014++){var _0xdf635e=_0x472fd6[_0x4d3e82(0x235)][_0x15b014];_0xdf635e['type']===_0x4d3e82(0x253)?_0x4ec0fa[_0x4d3e82(0x212)](_0xdf635e):_0xcfdc29[_0x4d3e82(0x212)](_0xdf635e);}if(!(!_0xcfdc29[_0x4d3e82(0x23f)]||_0x4ec0fa[_0x4d3e82(0x23f)]<=0x1)){_0x472fd6[_0x4d3e82(0x235)]=_0xcfdc29;var _0x442527={'functionsNode':!0x0,'props':_0x4ec0fa};this['_setNodeId'](_0x442527,_0x507653),this[_0x4d3e82(0x20c)](_0x442527,_0x507653),this['_setNodeExpandableState'](_0x442527),this[_0x4d3e82(0x267)](_0x442527,_0x507653),_0x442527['id']+='\\x20f',_0x472fd6['props']['unshift'](_0x442527);}}}[_0x51aae4(0x27e)](_0x587c2f,_0xb2ffee){}[_0x51aae4(0x1e9)](_0x5888ac){}[_0x51aae4(0x1eb)](_0x38cb6d){var _0x4a2e5f=_0x51aae4;return Array[_0x4a2e5f(0x21a)](_0x38cb6d)||typeof _0x38cb6d==_0x4a2e5f(0x213)&&this[_0x4a2e5f(0x223)](_0x38cb6d)===_0x4a2e5f(0x1dc);}[_0x51aae4(0x267)](_0x454780,_0x19f736){}[_0x51aae4(0x22a)](_0x2f5140){var _0x1a543b=_0x51aae4;delete _0x2f5140[_0x1a543b(0x221)],delete _0x2f5140[_0x1a543b(0x23d)],delete _0x2f5140[_0x1a543b(0x1c7)];}[_0x51aae4(0x218)](_0x494d42,_0x33ed0c){}}let _0x126961=new _0xc692a3(),_0x5586bf={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x533936={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x185555(_0x4dd1b9,_0x3906a7,_0x402dde,_0x691525,_0x3b2d7e,_0x4d4e9f){var _0x5c3e49=_0x51aae4;let _0xc691c0,_0x1e8e96;try{_0x1e8e96=_0x1c80ec(),_0xc691c0=_0x5601af[_0x3906a7],!_0xc691c0||_0x1e8e96-_0xc691c0['ts']>0x1f4&&_0xc691c0[_0x5c3e49(0x245)]&&_0xc691c0[_0x5c3e49(0x1d8)]/_0xc691c0[_0x5c3e49(0x245)]<0x64?(_0x5601af[_0x3906a7]=_0xc691c0={'count':0x0,'time':0x0,'ts':_0x1e8e96},_0x5601af[_0x5c3e49(0x230)]={}):_0x1e8e96-_0x5601af[_0x5c3e49(0x230)]['ts']>0x32&&_0x5601af['hits'][_0x5c3e49(0x245)]&&_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]/_0x5601af['hits'][_0x5c3e49(0x245)]<0x64&&(_0x5601af[_0x5c3e49(0x230)]={});let _0x70b3cb=[],_0x219da2=_0xc691c0[_0x5c3e49(0x220)]||_0x5601af['hits'][_0x5c3e49(0x220)]?_0x533936:_0x5586bf,_0x1c54ac=_0x1c899a=>{var _0x30bfe0=_0x5c3e49;let _0x28f6e0={};return _0x28f6e0[_0x30bfe0(0x235)]=_0x1c899a[_0x30bfe0(0x235)],_0x28f6e0[_0x30bfe0(0x1bb)]=_0x1c899a[_0x30bfe0(0x1bb)],_0x28f6e0[_0x30bfe0(0x1c2)]=_0x1c899a[_0x30bfe0(0x1c2)],_0x28f6e0['totalStrLength']=_0x1c899a['totalStrLength'],_0x28f6e0[_0x30bfe0(0x286)]=_0x1c899a[_0x30bfe0(0x286)],_0x28f6e0[_0x30bfe0(0x29b)]=_0x1c899a['autoExpandMaxDepth'],_0x28f6e0[_0x30bfe0(0x1c8)]=!0x1,_0x28f6e0['noFunctions']=!_0x3c7f88,_0x28f6e0['depth']=0x1,_0x28f6e0[_0x30bfe0(0x1d4)]=0x0,_0x28f6e0['expId']=_0x30bfe0(0x293),_0x28f6e0[_0x30bfe0(0x1d1)]='root_exp',_0x28f6e0[_0x30bfe0(0x279)]=!0x0,_0x28f6e0['autoExpandPreviousObjects']=[],_0x28f6e0[_0x30bfe0(0x23c)]=0x0,_0x28f6e0[_0x30bfe0(0x1bd)]=!0x0,_0x28f6e0[_0x30bfe0(0x29a)]=0x0,_0x28f6e0[_0x30bfe0(0x1e8)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x28f6e0;};for(var _0x47ef3f=0x0;_0x47ef3f<_0x3b2d7e[_0x5c3e49(0x23f)];_0x47ef3f++)_0x70b3cb[_0x5c3e49(0x212)](_0x126961[_0x5c3e49(0x239)]({'timeNode':_0x4dd1b9===_0x5c3e49(0x1d8)||void 0x0},_0x3b2d7e[_0x47ef3f],_0x1c54ac(_0x219da2),{}));if(_0x4dd1b9===_0x5c3e49(0x252)){let _0x5d9196=Error[_0x5c3e49(0x20e)];try{Error[_0x5c3e49(0x20e)]=0x1/0x0,_0x70b3cb['push'](_0x126961['serialize']({'stackNode':!0x0},new Error()[_0x5c3e49(0x23b)],_0x1c54ac(_0x219da2),{'strLength':0x1/0x0}));}finally{Error[_0x5c3e49(0x20e)]=_0x5d9196;}}return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':_0x70b3cb,'id':_0x3906a7,'context':_0x4d4e9f}]};}catch(_0x2799c0){return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':[{'type':_0x5c3e49(0x25f),'error':_0x2799c0&&_0x2799c0['message']}],'id':_0x3906a7,'context':_0x4d4e9f}]};}finally{try{if(_0xc691c0&&_0x1e8e96){let _0x4e0fa0=_0x1c80ec();_0xc691c0['count']++,_0xc691c0[_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0xc691c0['ts']=_0x4e0fa0,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]++,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0x5601af['hits']['ts']=_0x4e0fa0,(_0xc691c0['count']>0x32||_0xc691c0['time']>0x64)&&(_0xc691c0[_0x5c3e49(0x220)]=!0x0),(_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]>0x3e8||_0x5601af[_0x5c3e49(0x230)]['time']>0x12c)&&(_0x5601af[_0x5c3e49(0x230)]['reduceLimits']=!0x0);}}catch{}}}return _0x185555;}((_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x93064b,_0x3f89fb,_0x26d56d,_0x2f8c9b,_0x1bea64)=>{var _0x3d998c=_0x438282;if(_0x575b60[_0x3d998c(0x260)])return _0x575b60['_console_ninja'];if(!Y(_0x575b60,_0x26d56d,_0x38d7c7))return _0x575b60[_0x3d998c(0x260)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x575b60[_0x3d998c(0x260)];let _0x5daf87=W(_0x575b60),_0x5ae4d3=_0x5daf87['elapsed'],_0x428f23=_0x5daf87[_0x3d998c(0x210)],_0x4420a1=_0x5daf87[_0x3d998c(0x275)],_0x5bfdb9={'hits':{},'ts':{}},_0x10ee1e=Q(_0x575b60,_0x2f8c9b,_0x5bfdb9,_0x93064b),_0x526587=_0x498c2e=>{_0x5bfdb9['ts'][_0x498c2e]=_0x428f23();},_0x842581=(_0x18dc32,_0x2f73a5)=>{var _0x465ad2=_0x3d998c;let _0x31c9c7=_0x5bfdb9['ts'][_0x2f73a5];if(delete _0x5bfdb9['ts'][_0x2f73a5],_0x31c9c7){let _0x27518d=_0x5ae4d3(_0x31c9c7,_0x428f23());_0x582191(_0x10ee1e(_0x465ad2(0x1d8),_0x18dc32,_0x4420a1(),_0x4eb954,[_0x27518d],_0x2f73a5));}},_0x4e5ab6=_0x37b253=>_0x14dd8e=>{var _0x2bb83b=_0x3d998c;try{_0x526587(_0x14dd8e),_0x37b253(_0x14dd8e);}finally{_0x575b60[_0x2bb83b(0x1c4)][_0x2bb83b(0x1d8)]=_0x37b253;}},_0x51e0f4=_0x4db519=>_0x2400ae=>{var _0x2d96cf=_0x3d998c;try{let [_0x2b9e82,_0x2fe789]=_0x2400ae['split'](_0x2d96cf(0x273));_0x842581(_0x2fe789,_0x2b9e82),_0x4db519(_0x2b9e82);}finally{_0x575b60['console'][_0x2d96cf(0x1ea)]=_0x4db519;}};_0x575b60[_0x3d998c(0x260)]={'consoleLog':(_0x454cc5,_0x191a93)=>{var _0x46a209=_0x3d998c;_0x575b60[_0x46a209(0x1c4)][_0x46a209(0x256)][_0x46a209(0x25a)]!=='disabledLog'&&_0x582191(_0x10ee1e(_0x46a209(0x256),_0x454cc5,_0x4420a1(),_0x4eb954,_0x191a93));},'consoleTrace':(_0x64feee,_0x5b1099)=>{var _0x963014=_0x3d998c;_0x575b60[_0x963014(0x1c4)][_0x963014(0x256)]['name']!==_0x963014(0x299)&&_0x582191(_0x10ee1e(_0x963014(0x252),_0x64feee,_0x4420a1(),_0x4eb954,_0x5b1099));},'consoleTime':()=>{var _0x14ba63=_0x3d998c;_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]=_0x4e5ab6(_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]);},'consoleTimeEnd':()=>{var _0x4f2ede=_0x3d998c;_0x575b60[_0x4f2ede(0x1c4)]['timeEnd']=_0x51e0f4(_0x575b60[_0x4f2ede(0x1c4)][_0x4f2ede(0x1ea)]);},'autoLog':(_0x3dd72f,_0x47b02b)=>{var _0x48e51d=_0x3d998c;_0x582191(_0x10ee1e(_0x48e51d(0x256),_0x47b02b,_0x4420a1(),_0x4eb954,[_0x3dd72f]));},'autoLogMany':(_0x348836,_0x511d66)=>{var _0x26c38a=_0x3d998c;_0x582191(_0x10ee1e(_0x26c38a(0x256),_0x348836,_0x4420a1(),_0x4eb954,_0x511d66));},'autoTrace':(_0x4e5b2e,_0x99ff03)=>{var _0x257c66=_0x3d998c;_0x582191(_0x10ee1e(_0x257c66(0x252),_0x99ff03,_0x4420a1(),_0x4eb954,[_0x4e5b2e]));},'autoTraceMany':(_0x4b519e,_0x357444)=>{var _0x27e275=_0x3d998c;_0x582191(_0x10ee1e(_0x27e275(0x252),_0x4b519e,_0x4420a1(),_0x4eb954,_0x357444));},'autoTime':(_0x18001c,_0x14ae9e,_0x192755)=>{_0x526587(_0x192755);},'autoTimeEnd':(_0x229242,_0x1b6d26,_0x4f0695)=>{_0x842581(_0x1b6d26,_0x4f0695);},'coverage':_0x4dec71=>{var _0x332507=_0x3d998c;_0x582191({'method':_0x332507(0x1df),'version':_0x93064b,'args':[{'id':_0x4dec71}]});}};let _0x582191=J(_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x1bea64),_0x4eb954=_0x575b60[_0x3d998c(0x247)];return _0x575b60[_0x3d998c(0x260)];})(globalThis,_0x438282(0x240),_0x438282(0x258),_0x438282(0x233),_0x438282(0x228),'1.0.0',_0x438282(0x1d7),_0x438282(0x268),_0x438282(0x1cf),_0x438282(0x28e));function _0x3fef(){var _0x5da782=['logger\\x20websocket\\x20error','','hostname','5MwdXRE','onopen','_socket','root_exp_id','onmessage','Error','parent','pop','setter','disabledTrace','allStrLength','autoExpandMaxDepth','valueOf','undefined','capped','Map','then','next.js','cappedElements','elements','cappedProps','resolveGetters','_p_','hrtime','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','astro','strLength','_sortProps','console','_ws','_sendErrorMessage','_hasMapOnItsPath','sortProps','_allowedToSend','Set','defineProperty','method','substr','getOwnPropertyNames','','message','rootExpression','_maxConnectAttemptCount','75966dMQqWN','level','global','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','1696105396441','time','prototype','remix','_addFunctionsNode','[object\\x20Array]','_connectAttemptCount','_addProperty','coverage','POSITIVE_INFINITY','get','_inBrowser','host','_webSocketErrorDocsLink','number','HTMLAllCollection','getter','node','_setNodeExpandableState','timeEnd','_isArray','WebSocket','_type','toString','_isSet','sort','_reconnectTimeout','toLowerCase','bigint','unref','_disposeWebsocket','nodeModules','_addObjectProperty','boolean','_setNodeQueryPath','_attemptToReconnectShortly','Symbol','1262461SWpekW','_dateToString','hasOwnProperty','index','path','negativeInfinity','[object\\x20Date]','enumerable','nan','warn','null','_processTreeNodeResult','date','_additionalMetadata','_connected','_Symbol','_setNodeLabel','Buffer','stackTraceLimit','constructor','timeStamp','6606508aUvyXA','push','object','data','_undefined','indexOf','_connecting','_setNodeExpressionPath','create','isArray','String','384GYByLE','noFunctions','slice','[object\\x20Set]','reduceLimits','_hasSymbolPropertyOnItsPath','depth','_objectToString','includes','_isPrimitiveType','port','_treeNodePropertiesAfterFullValue','webpack','_treeNodePropertiesBeforeFullValue','_cleanNode','_regExpToString','getOwnPropertySymbols','set','join','error','hits','onclose','split',\"c:\\\\Users\\\\rayke\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-0.0.228\\\\node_modules\",'45844116NUkrJy','props','_connectToHostNow','RegExp','replace','serialize','Number','stack','autoExpandPropertyCount','_hasSetOnItsPath','_getOwnPropertyDescriptor','length','127.0.0.1','string','_quotedRegExp','catch','array','count','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_console_ninja_session','type','[object\\x20Map]','gateway.docker.internal','positiveInfinity','autoExpandPreviousObjects','[object\\x20BigInt]','70FEqbsq','11EvqbgY','_HTMLAllCollection','_keyStrRegExp','trace','function','default','getWebSocketClass','log','reload','54693','versions','name','map','ws://','_allowedToConnectOnSend','totalStrLength','unknown','_console_ninja','15594mUeKWH','_WebSocket','11196264ZecJpY','_isPrimitiveWrapperType','_numberRegExp','concat','_setNodePermissions',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Ray-Win11\",\"192.168.2.32\"],'959QMymZX','_isNegativeZero','test','_property','process','2324394fQIAwR','match','value','expressionsToEvaluate','send',':logPointId:','_WebSocketClass','now','getPrototypeOf','_blacklistedProperty','__es'+'Module','autoExpand','isExpressionToEvaluate','stringify','_consoleNinjaAllowedToStart','forEach','_addLoadNode','_setNodeId','funcName','call','url','parse','...','current','autoExpandLimit','location','bind','performance','readyState','_getOwnPropertySymbols','failed\\x20to\\x20connect\\x20to\\x20host:\\x20'];_0x3fef=function(){return _0x5da782;};return _0x3fef();}");
  } catch (e) {}
}
;
function oo_oo(i) {
  for (var _len = arguments.length, v = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    v[_key - 1] = arguments[_key];
  }
  try {
    oo_cm().consoleLog(i, v);
  } catch (e) {}
  return v;
}
;
function oo_tr(i) {
  for (var _len2 = arguments.length, v = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    v[_key2 - 1] = arguments[_key2];
  }
  try {
    oo_cm().consoleTrace(i, v);
  } catch (e) {}
  return v;
}
;
function oo_ts() {
  try {
    oo_cm().consoleTime();
  } catch (e) {}
}
;
function oo_te() {
  try {
    oo_cm().consoleTimeEnd();
  } catch (e) {}
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/

/***/ }),

/***/ "./src/StrapifyTemplate.js":
/*!*********************************!*\
  !*** ./src/StrapifyTemplate.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Strapify_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Strapify.js */ "./src/Strapify.js");
/* harmony import */ var _StrapifyRelation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifyRelation.js */ "./src/StrapifyRelation.js");
/* harmony import */ var _StrapifyField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyField */ "./src/StrapifyField.js");
/* harmony import */ var _StrapifyRepeatable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StrapifyRepeatable.js */ "./src/StrapifyRepeatable.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }




var _templateElement = /*#__PURE__*/new WeakMap();
var _strapiDataId = /*#__PURE__*/new WeakMap();
var _strapiDataAttributes = /*#__PURE__*/new WeakMap();
var _strapifyFields = /*#__PURE__*/new WeakMap();
var _strapifyRelations = /*#__PURE__*/new WeakMap();
var _strapifyRepeatables = /*#__PURE__*/new WeakMap();
var _attributes = /*#__PURE__*/new WeakMap();
var _updateAttributes = /*#__PURE__*/new WeakSet();
var _addIds = /*#__PURE__*/new WeakSet();
class StrapifyTemplate {
  //the template element this class manages

  //the strapi data id and attributes

  //the strapify field, relation, and repeatable objects which belong to this template

  //the allowed attributes for the template element

  constructor(templateElement, strapiDataId, strapiDataAttributes, strapifyCollection) {
    _classPrivateMethodInitSpec(this, _addIds);
    _classPrivateMethodInitSpec(this, _updateAttributes);
    _classPrivateFieldInitSpec(this, _templateElement, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataId, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapiDataAttributes, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _strapifyFields, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _strapifyRelations, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _strapifyRepeatables, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _attributes, {
      writable: true,
      value: {
        "strapi-template": undefined,
        "strapi-template-conditional": undefined
      }
    });
    _classPrivateFieldSet(this, _templateElement, templateElement);
    _classPrivateFieldSet(this, _strapiDataId, strapiDataId);
    _classPrivateFieldSet(this, _strapiDataAttributes, strapiDataAttributes);
    _classPrivateMethodGet(this, _updateAttributes, _updateAttributes2).call(this);
    _classPrivateMethodGet(this, _addIds, _addIds2).call(this);
  }

  //destroy all descendant strapify objects and delete the template element
  destroy() {
    _classPrivateFieldGet(this, _strapifyFields).forEach(field => field.destroy());
    _classPrivateFieldGet(this, _strapifyRelations).forEach(relation => relation.destroy());
    _classPrivateFieldGet(this, _strapifyRepeatables).forEach(repeatable => repeatable.destroy());
    _classPrivateFieldGet(this, _templateElement).remove();
  }
  async process() {
    //find strapify field elements, instatiate strapify field objects, and process them
    const strapifyFieldElements = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findFieldElms(_classPrivateFieldGet(this, _templateElement));
    strapifyFieldElements.forEach(fieldElement => {
      const strapifyField = new _StrapifyField__WEBPACK_IMPORTED_MODULE_2__["default"](fieldElement);
      _classPrivateFieldGet(this, _strapifyFields).push(strapifyField);
      strapifyField.process(_classPrivateFieldGet(this, _strapiDataAttributes));
    });
    const processPromises = [];

    //find strapify repeatable elements, instatiate strapify repeatable objects, and process them
    const strapifyRepeatableElements = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findRepeatableElms(_classPrivateFieldGet(this, _templateElement));
    for (const repeatableElement of strapifyRepeatableElements) {
      const strapifyRepeatable = new _StrapifyRepeatable_js__WEBPACK_IMPORTED_MODULE_3__["default"](repeatableElement, _classPrivateFieldGet(this, _strapiDataId), _classPrivateFieldGet(this, _strapiDataAttributes));
      _classPrivateFieldGet(this, _strapifyRepeatables).push(strapifyRepeatable);
      processPromises.push(strapifyRepeatable.process());
    }

    //find strapify relation elements, instatiate strapify relation objects, and process them
    const strapifyRelationElements = _Strapify_js__WEBPACK_IMPORTED_MODULE_0__["default"].findRelationElms(_classPrivateFieldGet(this, _templateElement));
    strapifyRelationElements.forEach(relationElement => {
      const strapifyRelation = new _StrapifyRelation_js__WEBPACK_IMPORTED_MODULE_1__["default"](relationElement, _classPrivateFieldGet(this, _strapiDataId), _classPrivateFieldGet(this, _strapiDataAttributes));
      _classPrivateFieldGet(this, _strapifyRelations).push(strapifyRelation);
      processPromises.push(strapifyRelation.process());
    });

    //wait for all strapify objects to process
    await Promise.allSettled(processPromises);

    //remove strapify-hide class from template element
    _classPrivateFieldGet(this, _templateElement).classList.remove("strapify-hide");
  }
}
function _updateAttributes2() {
  Object.keys(_classPrivateFieldGet(this, _attributes)).forEach(attribute => {
    _classPrivateFieldGet(this, _attributes)[attribute] = _classPrivateFieldGet(this, _templateElement).getAttribute(attribute);
  });
}
function _addIds2() {
  if (_classPrivateFieldGet(this, _strapiDataId)) {
    _classPrivateFieldGet(this, _templateElement).setAttribute("strapi-template-id", _classPrivateFieldGet(this, _strapiDataId));
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StrapifyTemplate);

/***/ }),

/***/ "./src/strapify-parser.js":
/*!********************************!*\
  !*** ./src/strapify-parser.js ***!
  \********************************/
/***/ ((module) => {

"use strict";
// Generated by Peggy 3.0.2.
//
// https://peggyjs.org/



function peg$subclass(child, parent) {
  function C() {
    this.constructor = child;
  }
  C.prototype = parent.prototype;
  child.prototype = new C();
}
function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  // istanbul ignore next Check is a necessary evil to support older environments
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}
peg$subclass(peg$SyntaxError, Error);
function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) {
    return str;
  }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}
peg$SyntaxError.prototype.format = function (sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = last - s.column || 1;
      str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + peg$padEnd("", s.column - 1, ' ') + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};
peg$SyntaxError.buildMessage = function (expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function (expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },
    class: function (expectation) {
      var escapedParts = expectation.parts.map(function (part) {
        return Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part);
      });
      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },
    any: function () {
      return "any character";
    },
    end: function () {
      return "end of input";
    },
    other: function (expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function (ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== undefined ? options : {};
  var peg$FAILED = {};
  var peg$source = options.grammarSource;
  var peg$startRuleFunctions = {
    entry: peg$parseentry
  };
  var peg$startRuleFunction = peg$parseentry;
  var peg$c0 = "(";
  var peg$c1 = ")";
  var peg$c2 = "||";
  var peg$c3 = "&&";
  var peg$c4 = "==";
  var peg$c5 = "<=";
  var peg$c6 = ">=";
  var peg$c7 = "!=";
  var peg$c8 = "<";
  var peg$c9 = ">";
  var peg$c10 = ".";
  var peg$c11 = "'";
  var peg$c12 = "null";
  var peg$c13 = "true";
  var peg$c14 = "false";
  var peg$r0 = /^[A-Za-z0-9\-_]/;
  var peg$r1 = /^[^']/;
  var peg$r2 = /^[0-9]/;
  var peg$r3 = /^[ \t\n\r]/;
  var peg$e0 = peg$literalExpectation("(", false);
  var peg$e1 = peg$literalExpectation(")", false);
  var peg$e2 = peg$literalExpectation("||", false);
  var peg$e3 = peg$literalExpectation("&&", false);
  var peg$e4 = peg$literalExpectation("==", false);
  var peg$e5 = peg$literalExpectation("<=", false);
  var peg$e6 = peg$literalExpectation(">=", false);
  var peg$e7 = peg$literalExpectation("!=", false);
  var peg$e8 = peg$literalExpectation("<", false);
  var peg$e9 = peg$literalExpectation(">", false);
  var peg$e10 = peg$literalExpectation(".", false);
  var peg$e11 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "-", "_"], false, false);
  var peg$e12 = peg$literalExpectation("'", false);
  var peg$e13 = peg$classExpectation(["'"], true, false);
  var peg$e14 = peg$literalExpectation("null", false);
  var peg$e15 = peg$literalExpectation("true", false);
  var peg$e16 = peg$literalExpectation("false", false);
  var peg$e17 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e18 = peg$otherExpectation("whitespace");
  var peg$e19 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);
  var peg$f0 = function (exp) {
    return exp;
  };
  var peg$f1 = function (left, op, right) {
    return {
      type: operatorDict[op],
      left: left,
      right: right
    };
  };
  var peg$f2 = function (left, op, right) {
    return {
      type: operatorDict[op],
      left: left,
      right: right
    };
  };
  var peg$f3 = function (variables) {
    let val = "";
    for (let i = 0; i < variables.length; i++) {
      val += variables[i][0].value;
      if (variables[i][1]) {
        val += ".";
      }
    }
    return {
      type: "variable",
      value: val
    };
  };
  var peg$f4 = function (variable) {
    return {
      type: "variable",
      value: variable.join("")
    };
  };
  var peg$f5 = function (string) {
    return {
      type: "string",
      value: string.join("")
    };
  };
  var peg$f6 = function () {
    return {
      type: "null",
      value: null
    };
  };
  var peg$f7 = function (bool) {
    return {
      type: "boolean",
      value: bool
    };
  };
  var peg$f8 = function (first, second) {
    return {
      type: "float",
      value: first.value + "." + second.value
    };
  };
  var peg$f9 = function (digits) {
    return {
      type: "integer",
      value: digits.join("")
    };
  };
  var peg$currPos = 0;
  var peg$savedPos = 0;
  var peg$posDetailsCache = [{
    line: 1,
    column: 1
  }];
  var peg$maxFailPos = 0;
  var peg$maxFailExpected = [];
  var peg$silentFails = 0;
  var peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location) {
    location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
  }
  function error(message, location) {
    location = location !== undefined ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location);
  }
  function peg$literalExpectation(text, ignoreCase) {
    return {
      type: "literal",
      text: text,
      ignoreCase: ignoreCase
    };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return {
      type: "class",
      parts: parts,
      inverted: inverted,
      ignoreCase: ignoreCase
    };
  }
  function peg$anyExpectation() {
    return {
      type: "any"
    };
  }
  function peg$endExpectation() {
    return {
      type: "end"
    };
  }
  function peg$otherExpectation(description) {
    return {
      type: "other",
      description: description
    };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos, offset) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);
    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset && peg$source && typeof peg$source.offset === "function") {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }
  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected);
  }
  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }
  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
  }
  function peg$parseentry() {
    var s0;
    s0 = peg$parseoperator();
    if (s0 === peg$FAILED) {
      s0 = peg$parsecomparison();
    }
    return s0;
  }
  function peg$parsegroup() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e0);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseoperator();
      if (s3 === peg$FAILED) {
        s3 = peg$parsecomparison();
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c1;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e1);
          }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f0(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseoperator() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parsegroup();
    if (s1 === peg$FAILED) {
      s1 = peg$parsecomparison();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c2) {
        s3 = peg$c2;
        peg$currPos += 2;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e2);
        }
      }
      if (s3 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c3) {
          s3 = peg$c3;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e3);
          }
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parsegroup();
        if (s5 === peg$FAILED) {
          s5 = peg$parsecomparison();
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f1(s1, s3, s5);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecomparison() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    s1 = peg$parseliteral();
    if (s1 === peg$FAILED) {
      s1 = peg$parsevariable();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c4) {
        s3 = peg$c4;
        peg$currPos += 2;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e4);
        }
      }
      if (s3 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c5) {
          s3 = peg$c5;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e5);
          }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c6) {
            s3 = peg$c6;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e6);
            }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c7) {
              s3 = peg$c7;
              peg$currPos += 2;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e7);
              }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 60) {
                s3 = peg$c8;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e8);
                }
              }
              if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s3 = peg$c9;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e9);
                  }
                }
              }
            }
          }
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseliteral();
        if (s5 === peg$FAILED) {
          s5 = peg$parsevariable();
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          peg$savedPos = s0;
          s0 = peg$f2(s1, s3, s5);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsevariable() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$parsesimpleVariable();
    if (s3 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s4 = peg$c10;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e10);
        }
      }
      if (s4 === peg$FAILED) {
        s4 = null;
      }
      s3 = [s3, s4];
      s2 = s3;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$parsesimpleVariable();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c10;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e10);
            }
          }
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          s3 = [s3, s4];
          s2 = s3;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f3(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsesimpleVariable() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (peg$r0.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e11);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$r0.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f4(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseliteral() {
    var s0;
    s0 = peg$parsestring();
    if (s0 === peg$FAILED) {
      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parseboolean();
        if (s0 === peg$FAILED) {
          s0 = peg$parsenull();
        }
      }
    }
    return s0;
  }
  function peg$parsestring() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c11;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e12);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$r1.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$r1.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e13);
          }
        }
      }
      if (input.charCodeAt(peg$currPos) === 39) {
        s3 = peg$c11;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e12);
        }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f5(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenull() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e14);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f6();
    }
    s0 = s1;
    return s0;
  }
  function peg$parseboolean() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c13) {
      s1 = peg$c13;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e15);
      }
    }
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c14) {
        s1 = peg$c14;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e16);
        }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f7(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsenumber() {
    var s0;
    s0 = peg$parsefloat();
    if (s0 === peg$FAILED) {
      s0 = peg$parseinteger();
    }
    return s0;
  }
  function peg$parsefloat() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c10;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e10);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseinteger();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f8(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseinteger() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (peg$r2.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e17);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$r2.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e17);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f9(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parse_() {
    var s0, s1;
    peg$silentFails++;
    s0 = [];
    if (peg$r3.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e19);
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      if (peg$r3.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e19);
        }
      }
    }
    peg$silentFails--;
    s1 = peg$FAILED;
    if (peg$silentFails === 0) {
      peg$fail(peg$e18);
    }
    return s0;
  }
  const operatorDict = {
    "&&": "and",
    "||": "or",
    "==": "eq",
    "!=": "ne",
    "<=": "le",
    ">=": "ge",
    "<": "lt",
    ">": "gt"
  };
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
  }
}
module.exports = {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
};

/***/ }),

/***/ "./src/util/strapiRequest.js":
/*!***********************************!*\
  !*** ./src/util/strapiRequest.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "strapiAuthenticate": () => (/* binding */ strapiAuthenticate),
/* harmony export */   "strapiEZFormsSubmit": () => (/* binding */ strapiEZFormsSubmit),
/* harmony export */   "strapiRegister": () => (/* binding */ strapiRegister),
/* harmony export */   "strapiRequest": () => (/* binding */ strapiRequest)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/lib/axios.js");
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Strapify */ "./src/Strapify.js");
/* harmony import */ var _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../StrapifyErrors */ "./src/StrapifyErrors.js");



const strapiRequest = async (slug, queryString) => {
  const url = `${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}${slug}${queryString ? queryString : ""}`;
  const jwt = localStorage.getItem("jwt");
  try {
    const headers = {};
    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }
    const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].get(url, {
      headers: headers
    });
    return response.data;
  } catch (err) {
    if (!err.response) {
      _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].toast(`An unexpected error occurred trying to fetch data from ${url}.  (No response)`);
      console.error(err);
      throw err;
    }
    switch (err?.response.status) {
      case 401:
        _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].warn(`Unable to access the collection or single type: "${slug.replace("/api/", "")}" due to missing or bad authentication. (401)`);
        break;
      case 403:
        _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].warn(`You are not authorized to access the collection or single type: "${slug.replace("/api/", "")}". (403)`);
        break;
      case 404:
        _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].error(`Invalid collection or single type: "${slug.replace("/api/", "")}" (404)`);
        break;
      default:
        _StrapifyErrors__WEBPACK_IMPORTED_MODULE_1__["default"].toast(`An unexpected error occurred trying to fetch data from ${url}.  (${err.response.status})`);
        console.error(err);
        break;
    }
    throw err;
  }
};
const strapiRegister = async formData => {
  try {
    const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].post(`${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}/api/auth/local/register`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};
const strapiAuthenticate = async (identifier, password) => {
  try {
    const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].post(`${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}/api/auth/local`, {
      identifier: identifier,
      password: password
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
const strapiEZFormsSubmit = async formElement => {
  const formData = new FormData(formElement);
  const formDataJson = Object.fromEntries(formData.entries());
  const jwt = localStorage.getItem("jwt");
  try {
    const headers = {};
    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
    }
    const response = await axios__WEBPACK_IMPORTED_MODULE_2__["default"].post(`${_Strapify__WEBPACK_IMPORTED_MODULE_0__["default"].apiURL}/api/ezforms/submit`, {
      headers: headers,
      formData: formDataJson
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (strapiRequest);


/***/ }),

/***/ "./node_modules/form-data/lib/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/form-data/lib/browser.js ***!
  \***********************************************/
/***/ ((module) => {

/* eslint-env browser */
module.exports = typeof self == 'object' ? self.FormData : window.FormData;


/***/ }),

/***/ "./node_modules/axios/lib/adapters/adapters.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/adapters/adapters.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _http_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./http.js */ "./node_modules/axios/lib/helpers/null.js");
/* harmony import */ var _xhr_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr.js */ "./node_modules/axios/lib/adapters/xhr.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const knownAdapters = {
  http: _http_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  xhr: _xhr_js__WEBPACK_IMPORTED_MODULE_1__["default"]
}

_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(knownAdapters, (fn, value) => {
  if(fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  getAdapter: (adapters) => {
    adapters = _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      if((adapter = _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_3__["default"](
          `Adapter ${nameOrAdapter} is not supported by the environment`,
          'ERR_NOT_SUPPORT'
        );
      }

      throw new Error(
        _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].hasOwnProp(knownAdapters, nameOrAdapter) ?
          `Adapter '${nameOrAdapter}' is not available in the build` :
          `Unknown adapter '${nameOrAdapter}'`
      );
    }

    if (!_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isFunction(adapter)) {
      throw new TypeError('adapter is not a function');
    }

    return adapter;
  },
  adapters: knownAdapters
});


/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_settle_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../core/settle.js */ "./node_modules/axios/lib/core/settle.js");
/* harmony import */ var _helpers_cookies_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../helpers/cookies.js */ "./node_modules/axios/lib/helpers/cookies.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../helpers/isURLSameOrigin.js */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
/* harmony import */ var _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../defaults/transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../helpers/parseProtocol.js */ "./node_modules/axios/lib/helpers/parseProtocol.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_speedometer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/speedometer.js */ "./node_modules/axios/lib/helpers/speedometer.js");
















function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = (0,_helpers_speedometer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(50, 250);

  return e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e
    };

    data[isDownloadStream ? 'download' : 'upload'] = true;

    listener(data);
  };
}

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let requestData = config.data;
    const requestHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers).normalize();
    const responseType = config.responseType;
    let onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isFormData(requestData) && (_platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserEnv || _platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserWebWorkerEnv)) {
      requestHeaders.setContentType(false); // Let the browser set it
    }

    let request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      const username = config.auth.username || '';
      const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
    }

    const fullPath = (0,_core_buildFullPath_js__WEBPACK_IMPORTED_MODULE_4__["default"])(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_5__["default"])(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      (0,_core_settle_js__WEBPACK_IMPORTED_MODULE_6__["default"])(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Request aborted', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Network Error', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = config.transitional || _defaults_transitional_js__WEBPACK_IMPORTED_MODULE_8__["default"];
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"](
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ETIMEDOUT : _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (_platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].isStandardBrowserEnv) {
      // Add xsrf header
      const xsrfValue = (config.withCredentials || (0,_helpers_isURLSameOrigin_js__WEBPACK_IMPORTED_MODULE_9__["default"])(fullPath))
        && config.xsrfCookieName && _helpers_cookies_js__WEBPACK_IMPORTED_MODULE_10__["default"].read(config.xsrfCookieName);

      if (xsrfValue) {
        requestHeaders.set(config.xsrfHeaderName, xsrfValue);
      }
    }

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_11__["default"](null, config, request) : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = (0,_helpers_parseProtocol_js__WEBPACK_IMPORTED_MODULE_12__["default"])(fullPath);

    if (protocol && _platform_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].protocols.indexOf(protocol) === -1) {
      reject(new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"]('Unsupported protocol ' + protocol + ':', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_7__["default"].ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
});


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");
/* harmony import */ var _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Axios.js */ "./node_modules/axios/lib/core/Axios.js");
/* harmony import */ var _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./cancel/CancelToken.js */ "./node_modules/axios/lib/cancel/CancelToken.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./helpers/spread.js */ "./node_modules/axios/lib/helpers/spread.js");
/* harmony import */ var _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/isAxiosError.js */ "./node_modules/axios/lib/helpers/isAxiosError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./helpers/HttpStatusCode.js */ "./node_modules/axios/lib/helpers/HttpStatusCode.js");



















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"](defaultConfig);
  const instance = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_1__["default"])(_core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.request, context);

  // Copy axios.prototype to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype, context, {allOwnKeys: true});

  // Copy context to instance
  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0,_core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"])(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

// Expose Axios class to allow class inheritance
axios.Axios = _core_Axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];

// Expose Cancel & CancelToken
axios.CanceledError = _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_5__["default"];
axios.CancelToken = _cancel_CancelToken_js__WEBPACK_IMPORTED_MODULE_6__["default"];
axios.isCancel = _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_7__["default"];
axios.VERSION = _env_data_js__WEBPACK_IMPORTED_MODULE_8__.VERSION;
axios.toFormData = _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_9__["default"];

// Expose AxiosError class
axios.AxiosError = _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_10__["default"];

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = _helpers_spread_js__WEBPACK_IMPORTED_MODULE_11__["default"];

// Expose isAxiosError
axios.isAxiosError = _helpers_isAxiosError_js__WEBPACK_IMPORTED_MODULE_12__["default"];

// Expose mergeConfig
axios.mergeConfig = _core_mergeConfig_js__WEBPACK_IMPORTED_MODULE_3__["default"];

axios.AxiosHeaders = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_13__["default"];

axios.formToJSON = thing => (0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_14__["default"])(_utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isHTMLForm(thing) ? new FormData(thing) : thing);

axios.HttpStatusCode = _helpers_HttpStatusCode_js__WEBPACK_IMPORTED_MODULE_15__["default"];

axios.default = axios;

// this module should only have a default export
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (axios);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");




/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new _CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelToken);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CanceledError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CanceledError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");





/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this, message == null ? 'canceled' : message, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].inherits(CanceledError, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
  __CANCEL__: true
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanceledError);


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isCancel)
/* harmony export */ });


function isCancel(value) {
  return !!(value && value.__CANCEL__);
}


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/buildURL.js */ "./node_modules/axios/lib/helpers/buildURL.js");
/* harmony import */ var _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InterceptorManager.js */ "./node_modules/axios/lib/core/InterceptorManager.js");
/* harmony import */ var _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dispatchRequest.js */ "./node_modules/axios/lib/core/dispatchRequest.js");
/* harmony import */ var _mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mergeConfig.js */ "./node_modules/axios/lib/core/mergeConfig.js");
/* harmony import */ var _buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./buildFullPath.js */ "./node_modules/axios/lib/core/buildFullPath.js");
/* harmony import */ var _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/validator.js */ "./node_modules/axios/lib/helpers/validator.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");











const validators = _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"](),
      response: new _InterceptorManager_js__WEBPACK_IMPORTED_MODULE_1__["default"]()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer !== undefined) {
      _helpers_validator_js__WEBPACK_IMPORTED_MODULE_0__["default"].assertOptions(paramsSerializer, {
        encode: validators.function,
        serialize: validators.function
      }, true);
    }

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    let contextHeaders;

    // Flatten headers
    contextHeaders = headers && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].merge(
      headers.common,
      headers[config.method]
    );

    contextHeaders && _utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_4__["default"].concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = _dispatchRequest_js__WEBPACK_IMPORTED_MODULE_5__["default"].call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = (0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this.defaults, config);
    const fullPath = (0,_buildFullPath_js__WEBPACK_IMPORTED_MODULE_6__["default"])(config.baseURL, config.url);
    return (0,_helpers_buildURL_js__WEBPACK_IMPORTED_MODULE_7__["default"])(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

_utils_js__WEBPACK_IMPORTED_MODULE_3__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0,_mergeConfig_js__WEBPACK_IMPORTED_MODULE_2__["default"])(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Axios);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosError.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosError.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

const prototype = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);

  _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosError);


/***/ }),

/***/ "./node_modules/axios/lib/core/AxiosHeaders.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/AxiosHeaders.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/parseHeaders.js */ "./node_modules/axios/lib/helpers/parseHeaders.js");





const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

function isValidHeaderName(str) {
  return /^[-_a-zA-Z]+$/.test(str.trim());
}

function matchHeaderValue(context, value, header, filter) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(value)) return;

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite)
    } else if(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0,_helpers_parseHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"])(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(this, header);

      return !!(key && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear() {
    return Object.keys(this).forEach(this.delete.bind(this));
  }

  normalize(format) {
    const self = this;
    const headers = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      const key = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent']);

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders.prototype);
_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].freezeMethods(AxiosHeaders);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosHeaders);


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InterceptorManager);


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFullPath)
/* harmony export */ });
/* harmony import */ var _helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/isAbsoluteURL.js */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
/* harmony import */ var _helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/combineURLs.js */ "./node_modules/axios/lib/helpers/combineURLs.js");





/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !(0,_helpers_isAbsoluteURL_js__WEBPACK_IMPORTED_MODULE_0__["default"])(requestedURL)) {
    return (0,_helpers_combineURLs_js__WEBPACK_IMPORTED_MODULE_1__["default"])(baseURL, requestedURL);
  }
  return requestedURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dispatchRequest)
/* harmony export */ });
/* harmony import */ var _transformData_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transformData.js */ "./node_modules/axios/lib/core/transformData.js");
/* harmony import */ var _cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../cancel/isCancel.js */ "./node_modules/axios/lib/cancel/isCancel.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../cancel/CanceledError.js */ "./node_modules/axios/lib/cancel/CanceledError.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");
/* harmony import */ var _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../adapters/adapters.js */ "./node_modules/axios/lib/adapters/adapters.js");









/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new _cancel_CanceledError_js__WEBPACK_IMPORTED_MODULE_0__["default"](null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(config.headers);

  // Transform request data
  config.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = _adapters_adapters_js__WEBPACK_IMPORTED_MODULE_3__["default"].getAdapter(config.adapter || _defaults_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
      config,
      config.transformResponse,
      response
    );

    response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!(0,_cancel_isCancel_js__WEBPACK_IMPORTED_MODULE_5__["default"])(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeConfig)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");





const headersToObject = (thing) => thing instanceof _AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? thing.toJSON() : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, caseless) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(target) && _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge.call({caseless}, target, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isPlainObject(source)) {
      return _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].merge({}, source);
    } else if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, caseless) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };

  _utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ settle)
/* harmony export */ });
/* harmony import */ var _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");




/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"](
      'Request failed with status code ' + response.status,
      [_AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_REQUEST, _AxiosError_js__WEBPACK_IMPORTED_MODULE_0__["default"].ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ transformData)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../defaults/index.js */ "./node_modules/axios/lib/defaults/index.js");
/* harmony import */ var _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosHeaders.js */ "./node_modules/axios/lib/core/AxiosHeaders.js");






/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _defaults_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  const context = response || config;
  const headers = _core_AxiosHeaders_js__WEBPACK_IMPORTED_MODULE_1__["default"].from(context.headers);
  let data = context.data;

  _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}


/***/ }),

/***/ "./node_modules/axios/lib/defaults/index.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/defaults/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _transitional_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transitional.js */ "./node_modules/axios/lib/defaults/transitional.js");
/* harmony import */ var _helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers/toURLEncodedForm.js */ "./node_modules/axios/lib/helpers/toURLEncodedForm.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");
/* harmony import */ var _helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers/formDataToJSON.js */ "./node_modules/axios/lib/helpers/formDataToJSON.js");










const DEFAULT_CONTENT_TYPE = {
  'Content-Type': undefined
};

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: _transitional_js__WEBPACK_IMPORTED_MODULE_1__["default"],

  adapter: ['xhr', 'http'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(data);

    if (isObjectPayload && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(data);

    if (isFormData) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify((0,_helpers_formDataToJSON_js__WEBPACK_IMPORTED_MODULE_2__["default"])(data)) : data;
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBuffer(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStream(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFile(data) ||
      _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(data)
    ) {
      return data;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0,_helpers_toURLEncodedForm_js__WEBPACK_IMPORTED_MODULE_3__["default"])(data, this.formSerializer).toString();
      }

      if ((isFileList = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return (0,_helpers_toFormData_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (data && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].from(e, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_5__["default"].ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.FormData,
    Blob: _platform_index_js__WEBPACK_IMPORTED_MODULE_6__["default"].classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].merge(DEFAULT_CONTENT_TYPE);
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);


/***/ }),

/***/ "./node_modules/axios/lib/defaults/transitional.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/defaults/transitional.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
});


/***/ }),

/***/ "./node_modules/axios/lib/env/classes/FormData.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/env/classes/FormData.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var form_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! form-data */ "./node_modules/form-data/lib/browser.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (form_data__WEBPACK_IMPORTED_MODULE_0__);


/***/ }),

/***/ "./node_modules/axios/lib/env/data.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/env/data.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VERSION": () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION = "1.2.2";

/***/ }),

/***/ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js":
/*!****************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");




/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AxiosURLSearchParams);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/HttpStatusCode.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/HttpStatusCode.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HttpStatusCode);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ bind)
/* harmony export */ });


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildURL)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");





/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isURLSearchParams(params) ?
      params.toString() :
      new _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_1__["default"](params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ combineURLs)
/* harmony export */ });


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStandardBrowserEnv ?

// Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        const cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(path)) {
          cookie.push('path=' + path);
        }

        if (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

// Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/formDataToJSON.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/formDataToJSON.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target) ? target.length : name;

    if (isLast) {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFormData(formData) && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(formData.entries)) {
    const obj = {};

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formDataToJSON);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAbsoluteURL)
/* harmony export */ });


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isAxiosError)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(payload) && (payload.isAxiosError === true);
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_platform_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].isStandardBrowserEnv ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement('a');
    let originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      let href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
          urlParsingNode.pathname :
          '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      const parsed = (_utils_js__WEBPACK_IMPORTED_MODULE_1__["default"].isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
          parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })());


/***/ }),

/***/ "./node_modules/axios/lib/helpers/null.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/null.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// eslint-disable-next-line strict
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (null);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../utils.js */ "./node_modules/axios/lib/utils.js");




// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
});


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseProtocol.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseProtocol.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parseProtocol)
/* harmony export */ });


function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/speedometer.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/speedometer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (speedometer);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ spread)
/* harmony export */ });


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toFormData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toFormData.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");
/* harmony import */ var _env_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env/classes/FormData.js */ "./node_modules/axios/lib/env/classes/FormData.js");






/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isPlainObject(thing) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(arr) && !arr.some(isVisitable);
}

const predicates = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"], {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliant(thing) {
  return thing && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator];
}

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_env_classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"] || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && isSpecCompliant(formData);

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isBlob(value)) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_2__["default"]('Blob is not supported. Use a Buffer instead.');
    }

    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArrayBuffer(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isArray(value) && isFlatArray(value)) ||
        (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isFileList(value) || _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].endsWith(key, '[]') && (arr = _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].forEach(value, function each(el, key) {
      const result = !(_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isUndefined(el) || el === null) && visitor.call(
        formData, el, _utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!_utils_js__WEBPACK_IMPORTED_MODULE_0__["default"].isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toFormData);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/toURLEncodedForm.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/toURLEncodedForm.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toURLEncodedForm)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/axios/lib/utils.js");
/* harmony import */ var _toFormData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toFormData.js */ "./node_modules/axios/lib/helpers/toFormData.js");
/* harmony import */ var _platform_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../platform/index.js */ "./node_modules/axios/lib/platform/browser/index.js");






function toURLEncodedForm(data, options) {
  return (0,_toFormData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, new _platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (_platform_index_js__WEBPACK_IMPORTED_MODULE_1__["default"].isNode && _utils_js__WEBPACK_IMPORTED_MODULE_2__["default"].isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env_data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env/data.js */ "./node_modules/axios/lib/env/data.js");
/* harmony import */ var _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/AxiosError.js */ "./node_modules/axios/lib/core/AxiosError.js");





const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _env_data_js__WEBPACK_IMPORTED_MODULE_0__.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"](
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('options must be an object', _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('option ' + opt + ' must be ' + result, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"]('Unknown option ' + opt, _core_AxiosError_js__WEBPACK_IMPORTED_MODULE_1__["default"].ERR_BAD_OPTION);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  assertOptions,
  validators
});


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/FormData.js":
/*!*********************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/FormData.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormData);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":
/*!****************************************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/AxiosURLSearchParams.js */ "./node_modules/axios/lib/helpers/AxiosURLSearchParams.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (typeof URLSearchParams !== 'undefined' ? URLSearchParams : _helpers_AxiosURLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./node_modules/axios/lib/platform/browser/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/axios/lib/platform/browser/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./classes/URLSearchParams.js */ "./node_modules/axios/lib/platform/browser/classes/URLSearchParams.js");
/* harmony import */ var _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./classes/FormData.js */ "./node_modules/axios/lib/platform/browser/classes/FormData.js");



/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== 'undefined' && (
    (product = navigator.product) === 'ReactNative' ||
    product === 'NativeScript' ||
    product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
})();

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
 const isStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isBrowser: true,
  classes: {
    URLSearchParams: _classes_URLSearchParams_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    FormData: _classes_FormData_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Blob
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
});


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/bind.js */ "./node_modules/axios/lib/helpers/bind.js");




// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
}

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
}

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  const pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  }

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0,_helpers_bind_js__WEBPACK_IMPORTED_MODULE_0__["default"])(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    if (reducer(descriptor, name, obj) !== false) {
      reducedDescriptors[name] = descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
}

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
}

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  }

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
}

const noop = () => {}

const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  }

  return visit(obj, 0);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  toJSONObject
});


/***/ }),

/***/ "./node_modules/marked/lib/marked.esm.js":
/*!***********************************************!*\
  !*** ./node_modules/marked/lib/marked.esm.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Lexer": () => (/* binding */ Lexer),
/* harmony export */   "Parser": () => (/* binding */ Parser),
/* harmony export */   "Renderer": () => (/* binding */ Renderer),
/* harmony export */   "Slugger": () => (/* binding */ Slugger),
/* harmony export */   "TextRenderer": () => (/* binding */ TextRenderer),
/* harmony export */   "Tokenizer": () => (/* binding */ Tokenizer),
/* harmony export */   "defaults": () => (/* binding */ defaults),
/* harmony export */   "getDefaults": () => (/* binding */ getDefaults),
/* harmony export */   "lexer": () => (/* binding */ lexer),
/* harmony export */   "marked": () => (/* binding */ marked),
/* harmony export */   "options": () => (/* binding */ options),
/* harmony export */   "parse": () => (/* binding */ parse),
/* harmony export */   "parseInline": () => (/* binding */ parseInline),
/* harmony export */   "parser": () => (/* binding */ parser),
/* harmony export */   "setOptions": () => (/* binding */ setOptions),
/* harmony export */   "use": () => (/* binding */ use),
/* harmony export */   "walkTokens": () => (/* binding */ walkTokens)
/* harmony export */ });
/**
 * marked v4.2.12 - a markdown parser
 * Copyright (c) 2011-2023, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

function getDefaults() {
  return {
    async: false,
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}

let defaults = getDefaults();

function changeDefaults(newDefaults) {
  defaults = newDefaults;
}

/**
 * Helpers
 */
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

/**
 * @param {string} html
 */
function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const caret = /(^|[^\[])\^/g;

/**
 * @param {string | RegExp} regex
 * @param {string} opt
 */
function edit(regex, opt) {
  regex = typeof regex === 'string' ? regex : regex.source;
  opt = opt || '';
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

/**
 * @param {boolean} sanitize
 * @param {string} base
 * @param {string} href
 */
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href))
        .replace(nonWordAndColonTest, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

/**
 * @param {string} base
 * @param {string} href
 */
function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (justDomain.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];
  const relativeBase = base.indexOf(':') === -1;

  if (href.substring(0, 2) === '//') {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, '$1') + href;
  } else if (href.charAt(0) === '/') {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, '$1') + href;
  } else {
    return base + href;
  }
}

const noopTest = { exec: function noopTest() {} };

function merge(obj) {
  let i = 1,
    target,
    key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false,
        curr = offset;
      while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \|/);
  let i = 0;

  // First/last cell in a row cannot be empty if it has no leading/trailing pipe
  if (!cells[0].trim()) { cells.shift(); }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

/**
 * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
 * /c*$/ is vulnerable to REDOS.
 *
 * @param {string} str
 * @param {string} c
 * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
 */
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  let suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.slice(0, l - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0,
    i = 0;
  for (; i < l; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

// copied from https://stackoverflow.com/a/5450113/806777
/**
 * @param {string} pattern
 * @param {number} count
 */
function repeatString(pattern, count) {
  if (count < 1) {
    return '';
  }
  let result = '';
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}

function outputLink(cap, link, raw, lexer) {
  const href = link.href;
  const title = link.title ? escape(link.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, '$1');

  if (cap[0].charAt(0) !== '!') {
    lexer.state.inLink = true;
    const token = {
      type: 'link',
      raw,
      href,
      title,
      text,
      tokens: lexer.inlineTokens(text)
    };
    lexer.state.inLink = false;
    return token;
  }
  return {
    type: 'image',
    raw,
    href,
    title,
    text: escape(text)
  };
}

function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

  if (matchIndentToCode === null) {
    return text;
  }

  const indentToCode = matchIndentToCode[1];

  return text
    .split('\n')
    .map(node => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }

      const [indentInNode] = matchIndentInNode;

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    })
    .join('\n');
}

/**
 * Tokenizer
 */
class Tokenizer {
  constructor(options) {
    this.options = options || defaults;
  }

  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: 'space',
        raw: cap[0]
      };
    }
  }

  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, '');
      return {
        type: 'code',
        raw: cap[0],
        codeBlockStyle: 'indented',
        text: !this.options.pedantic
          ? rtrim(text, '\n')
          : text
      };
    }
  }

  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || '');

      return {
        type: 'code',
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, '$1') : cap[2],
        text
      };
    }
  }

  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();

      // remove trailing #s
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, '#');
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          // CommonMark requires space before trailing #s
          text = trimmed.trim();
        }
      }

      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: 'hr',
        raw: cap[0]
      };
    }
  }

  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *>[ \t]?/gm, '');
      const top = this.lexer.state.top;
      this.lexer.state.top = true;
      const tokens = this.lexer.blockTokens(text);
      this.lexer.state.top = top;
      return {
        type: 'blockquote',
        raw: cap[0],
        tokens,
        text
      };
    }
  }

  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
        line, nextLine, rawLine, itemContents, endEarly;

      let bull = cap[1].trim();
      const isordered = bull.length > 1;

      const list = {
        type: 'list',
        raw: '',
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : '',
        loose: false,
        items: []
      };

      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

      if (this.options.pedantic) {
        bull = isordered ? bull : '[*+-]';
      }

      // Get next list item
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);

      // Check if current bullet point can start a new List Item
      while (src) {
        endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }

        if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
          break;
        }

        raw = cap[0];
        src = src.substring(raw.length);

        line = cap[2].split('\n', 1)[0].replace(/^\t+/, (t) => ' '.repeat(3 * t.length));
        nextLine = src.split('\n', 1)[0];

        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/); // Find first non-space char
          indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }

        blankLine = false;

        if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
          raw += nextLine + '\n';
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }

        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);

          // Check if following lines should be included in List Item
          while (src) {
            rawLine = src.split('\n', 1)[0];
            nextLine = rawLine;

            // Re-align to follow commonmark nesting rules
            if (this.options.pedantic) {
              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
            }

            // End list item if found code fences
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new heading
            if (headingBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new bullet
            if (nextBulletRegex.test(nextLine)) {
              break;
            }

            // Horizontal rule found
            if (hrRegex.test(src)) {
              break;
            }

            if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) { // Dedent if possible
              itemContents += '\n' + nextLine.slice(indent);
            } else {
              // not enough indentation
              if (blankLine) {
                break;
              }

              // paragraph continuation unless last line was a different block level element
              if (line.search(/[^ ]/) >= 4) { // indented code block
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }

              itemContents += '\n' + nextLine;
            }

            if (!blankLine && !nextLine.trim()) { // Check if current line is blank
              blankLine = true;
            }

            raw += rawLine + '\n';
            src = src.substring(rawLine.length + 1);
            line = nextLine.slice(indent);
          }
        }

        if (!list.loose) {
          // If the previous item ended with a blank line, the list is loose
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }

        // Check for task list items
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== '[ ] ';
            itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
          }
        }

        list.items.push({
          type: 'list_item',
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });

        list.raw += raw;
      }

      // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
      list.items[list.items.length - 1].raw = raw.trimRight();
      list.items[list.items.length - 1].text = itemContents.trimRight();
      list.raw = list.raw.trimRight();

      const l = list.items.length;

      // Item child tokens handled here at end because we needed to have the final item to trim it first
      for (i = 0; i < l; i++) {
        this.lexer.state.top = false;
        list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);

        if (!list.loose) {
          // Check if list should be loose
          const spacers = list.items[i].tokens.filter(t => t.type === 'space');
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => /\n.*\n/.test(t.raw));

          list.loose = hasMultipleLineBreaks;
        }
      }

      // Set all items to loose if list is loose
      if (list.loose) {
        for (i = 0; i < l; i++) {
          list.items[i].loose = true;
        }
      }

      return list;
    }
  }

  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: 'html',
        raw: cap[0],
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      };
      if (this.options.sanitize) {
        const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
        token.type = 'paragraph';
        token.text = text;
        token.tokens = this.lexer.inline(text);
      }
      return token;
    }
  }

  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
      const href = cap[2] ? cap[2].replace(/^<(.*)>$/, '$1').replace(this.rules.inline._escapes, '$1') : '';
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, '$1') : cap[3];
      return {
        type: 'def',
        tag,
        raw: cap[0],
        href,
        title
      };
    }
  }

  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: 'table',
        header: splitCells(cap[1]).map(c => { return { text: c }; }),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
      };

      if (item.header.length === item.align.length) {
        item.raw = cap[0];

        let l = item.align.length;
        let i, j, k, row;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        l = item.rows.length;
        for (i = 0; i < l; i++) {
          item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
        }

        // parse child tokens inside headers and cells

        // header child tokens
        l = item.header.length;
        for (j = 0; j < l; j++) {
          item.header[j].tokens = this.lexer.inline(item.header[j].text);
        }

        // cell child tokens
        l = item.rows.length;
        for (j = 0; j < l; j++) {
          row = item.rows[j];
          for (k = 0; k < row.length; k++) {
            row[k].tokens = this.lexer.inline(row[k].text);
          }
        }

        return item;
      }
    }
  }

  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }

  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === '\n'
        ? cap[1].slice(0, -1)
        : cap[1];
      return {
        type: 'paragraph',
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: 'text',
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }

  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: 'escape',
        raw: cap[0],
        text: escape(cap[1])
      };
    }
  }

  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }

      return {
        type: this.options.sanitize
          ? 'text'
          : 'html',
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize
          ? (this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0]))
          : cap[0]
      };
    }
  }

  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        // commonmark requires matching angle brackets
        if (!(/>$/.test(trimmedUrl))) {
          return;
        }

        // ending angle bracket cannot be escaped
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        // find closing parenthesis
        const lastParenIndex = findClosingBracket(cap[2], '()');
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf('!') === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = '';
        }
      }
      let href = cap[2];
      let title = '';
      if (this.options.pedantic) {
        // split pedantic href and title
        const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }

      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
          // pedantic allows starting angle bracket without ending angle bracket
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
        title: title ? title.replace(this.rules.inline._escapes, '$1') : title
      }, cap[0], this.lexer);
    }
  }

  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src))
        || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = links[link.toLowerCase()];
      if (!link) {
        const text = cap[0].charAt(0);
        return {
          type: 'text',
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }

  emStrong(src, maskedSrc, prevChar = '') {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match) return;

    // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

    const nextChar = match[1] || match[2] || '';

    if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

      const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;

      // Clip maskedSrc to same section of string as src (move to lexer?)
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

        if (!rDelim) continue; // skip single * in __abc*abc__

        rLength = rDelim.length;

        if (match[3] || match[4]) { // found another Left Delim
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) { // either Left or Right Delim
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue; // CommonMark Emphasis Rules 9-10
          }
        }

        delimTotal -= rLength;

        if (delimTotal > 0) continue; // Haven't found enough closing delimiters

        // Remove extra characters. *a*** -> *a*
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

        const raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);

        // Create `em` if smallest delimiter has odd char count. *a***
        if (Math.min(lLength, rLength) % 2) {
          const text = raw.slice(1, -1);
          return {
            type: 'em',
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }

        // Create 'strong' if smallest delimiter has even char count. **a***
        const text = raw.slice(2, -2);
        return {
          type: 'strong',
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }

  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, ' ');
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape(text, true);
      return {
        type: 'codespan',
        raw: cap[0],
        text
      };
    }
  }

  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: 'br',
        raw: cap[0]
      };
    }
  }

  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: 'del',
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }

  autolink(src, mangle) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }

      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  url(src, mangle) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  inlineText(src, smartypants) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
      } else {
        text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
      }
      return {
        type: 'text',
        raw: cap[0],
        text
      };
    }
  }
}

/**
 * Block-Level Grammar
 */
const block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
    + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
    + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
    + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
  table: noopTest,
  lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block.listItemStart = edit(/^( *)(bull) */)
  .replace('bull', block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('|table', '')
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  table: '^ *([^\\n ].*\\|.*)\\n' // Header
    + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
    + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
});

block.gfm.table = edit(block.gfm.table)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('blockquote', ' {0,3}>')
  .replace('code', ' {4}[^\\n]')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();

block.gfm.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('table', block.gfm.table) // interrupt paragraphs with table
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest, // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
});

/**
 * Inline-Level Grammar
 */
const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(ref)\]/,
  nolink: /^!?\[(ref)\](?:\[\])?/,
  reflinkSearch: 'reflink|nolink(?!\\()',
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
    rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/
};

// list of punctuation marks from CommonMark spec
// without * and _ to handle the different emphasis markers * and _
inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

// sequences em should skip over [title](link), `code`, <html>
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
// lookbehind is not available on Safari as of version 16
// inline.escapedEmSt = /(?<=(?:^|[^\\)(?:\\[^])*)\\[*_]/g;
inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;

inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', inline._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .replace('ref', block._label)
  .getRegex();

inline.nolink = edit(inline.nolink)
  .replace('ref', block._label)
  .getRegex();

inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
  .replace('reflink', inline.reflink)
  .replace('nolink', inline.nolink)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
});

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

/**
 * smartypants text replacement
 * @param {string} text
 */
function smartypants(text) {
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
}

/**
 * mangle email addresses
 * @param {string} text
 */
function mangle(text) {
  let out = '',
    i,
    ch;

  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
}

/**
 * Block Lexer
 */
class Lexer {
  constructor(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };

    const rules = {
      block: block.normal,
      inline: inline.normal
    };

    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }

  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }

  /**
   * Static Lex Method
   */
  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }

  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options) {
    const lexer = new Lexer(options);
    return lexer.inlineTokens(src);
  }

  /**
   * Preprocessing
   */
  lex(src) {
    src = src
      .replace(/\r\n|\r/g, '\n');

    this.blockTokens(src, this.tokens);

    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }

    return this.tokens;
  }

  /**
   * Lexing
   */
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
        return leading + '    '.repeat(tabs.length);
      });
    }

    let token, lastToken, cutSrc, lastParagraphClipped;

    while (src) {
      if (this.options.extensions
        && this.options.extensions.block
        && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // newline
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          // if there's a single \n as a spacer, it's terminating the last line,
          // so move it there so that we don't get unecessary paragraph tags
          tokens[tokens.length - 1].raw += '\n';
        } else {
          tokens.push(token);
        }
        continue;
      }

      // code
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        // An indented code block cannot interrupt a paragraph.
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // fences
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // heading
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // hr
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // blockquote
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // list
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // html
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // def
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }

      // table (gfm)
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // lheading
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // top-level paragraph
      // prevent paragraph consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === 'paragraph') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = (cutSrc.length !== src.length);
        src = src.substring(token.raw.length);
        continue;
      }

      // text
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += '\n' + token.raw;
          lastToken.text += '\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    this.state.top = true;
    return tokens;
  }

  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }

  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;

    // String with links masked to avoid interference with em and strong
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;

    // Mask out reflinks
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    // Mask out other blocks
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }

    // Mask out escaped em & strong delimiters
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
      this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
    }

    while (src) {
      if (!keepPrevChar) {
        prevChar = '';
      }
      keepPrevChar = false;

      // extensions
      if (this.options.extensions
        && this.options.extensions.inline
        && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // escape
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // tag
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // link
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // reflink, nolink
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // em & strong
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // code
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // br
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // del (gfm)
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // autolink
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // url (gfm)
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // text
      // prevent inlineText consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    return tokens;
  }
}

/**
 * Renderer
 */
class Renderer {
  constructor(options) {
    this.options = options || defaults;
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\n$/, '') + '\n';

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\n';
  }

  /**
   * @param {string} quote
   */
  blockquote(quote) {
    return `<blockquote>\n${quote}</blockquote>\n`;
  }

  html(html) {
    return html;
  }

  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    }

    // ignore IDs
    return `<h${level}>${text}</h${level}>\n`;
  }

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  }

  /**
   * @param {string} text
   */
  listitem(text) {
    return `<li>${text}</li>\n`;
  }

  checkbox(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  }

  /**
   * @param {string} text
   */
  paragraph(text) {
    return `<p>${text}</p>\n`;
  }

  /**
   * @param {string} header
   * @param {string} body
   */
  table(header, body) {
    if (body) body = `<tbody>${body}</tbody>`;

    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  }

  /**
   * @param {string} content
   */
  tablerow(content) {
    return `<tr>\n${content}</tr>\n`;
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? `<${type} align="${flags.align}">`
      : `<${type}>`;
    return tag + content + `</${type}>\n`;
  }

  /**
   * span level renderer
   * @param {string} text
   */
  strong(text) {
    return `<strong>${text}</strong>`;
  }

  /**
   * @param {string} text
   */
  em(text) {
    return `<em>${text}</em>`;
  }

  /**
   * @param {string} text
   */
  codespan(text) {
    return `<code>${text}</code>`;
  }

  br() {
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  /**
   * @param {string} text
   */
  del(text) {
    return `<del>${text}</del>`;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  text(text) {
    return text;
  }
}

/**
 * TextRenderer
 * returns only the textual part of the token
 */
class TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }

  em(text) {
    return text;
  }

  codespan(text) {
    return text;
  }

  del(text) {
    return text;
  }

  html(text) {
    return text;
  }

  text(text) {
    return text;
  }

  link(href, title, text) {
    return '' + text;
  }

  image(href, title, text) {
    return '' + text;
  }

  br() {
    return '';
  }
}

/**
 * Slugger generates header id
 */
class Slugger {
  constructor() {
    this.seen = {};
  }

  /**
   * @param {string} value
   */
  serialize(value) {
    return value
      .toLowerCase()
      .trim()
      // remove html tags
      .replace(/<[!\/a-z].*?>/ig, '')
      // remove unwanted chars
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');
  }

  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + '-' + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }

  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(value, options = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options.dryrun);
  }
}

/**
 * Parsing & Compiling
 */
class Parser {
  constructor(options) {
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }

  /**
   * Static Parse Method
   */
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  }

  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options) {
    const parser = new Parser(options);
    return parser.parseInline(tokens);
  }

  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = '',
      i,
      j,
      k,
      l2,
      l3,
      row,
      cell,
      header,
      body,
      token,
      ordered,
      start,
      loose,
      itemBody,
      item,
      checked,
      task,
      checkbox,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'space': {
          continue;
        }
        case 'hr': {
          out += this.renderer.hr();
          continue;
        }
        case 'heading': {
          out += this.renderer.heading(
            this.parseInline(token.tokens),
            token.depth,
            unescape(this.parseInline(token.tokens, this.textRenderer)),
            this.slugger);
          continue;
        }
        case 'code': {
          out += this.renderer.code(token.text,
            token.lang,
            token.escaped);
          continue;
        }
        case 'table': {
          header = '';

          // header
          cell = '';
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(
              this.parseInline(token.header[j].tokens),
              { header: true, align: token.align[j] }
            );
          }
          header += this.renderer.tablerow(cell);

          body = '';
          l2 = token.rows.length;
          for (j = 0; j < l2; j++) {
            row = token.rows[j];

            cell = '';
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k].tokens),
                { header: false, align: token.align[k] }
              );
            }

            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case 'blockquote': {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case 'list': {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l2 = token.items.length;

          body = '';
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;

            itemBody = '';
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                  item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                    item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: 'text',
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }

            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }

          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case 'html': {
          // TODO parse inline content if parameter markdown=1
          out += this.renderer.html(token.text);
          continue;
        }
        case 'paragraph': {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case 'text': {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === 'text') {
            token = tokens[++i];
            body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }

    return out;
  }

  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = '',
      i,
      token,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'escape': {
          out += renderer.text(token.text);
          break;
        }
        case 'html': {
          out += renderer.html(token.text);
          break;
        }
        case 'link': {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case 'image': {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case 'strong': {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'em': {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'codespan': {
          out += renderer.codespan(token.text);
          break;
        }
        case 'br': {
          out += renderer.br();
          break;
        }
        case 'del': {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'text': {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}

/**
 * Marked
 */
function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (typeof opt === 'function') {
    callback = opt;
    opt = null;
  }

  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);

  if (callback) {
    const highlight = opt.highlight;
    let tokens;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    const done = function(err) {
      let out;

      if (!err) {
        try {
          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!tokens.length) return done();

    let pending = 0;
    marked.walkTokens(tokens, function(token) {
      if (token.type === 'code') {
        pending++;
        setTimeout(() => {
          highlight(token.text, token.lang, function(err, code) {
            if (err) {
              return done(err);
            }
            if (code != null && code !== token.text) {
              token.text = code;
              token.escaped = true;
            }

            pending--;
            if (pending === 0) {
              done();
            }
          });
        }, 0);
      }
    });

    if (pending === 0) {
      done();
    }

    return;
  }

  function onError(e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if (opt.silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }

  try {
    const tokens = Lexer.lex(src, opt);
    if (opt.walkTokens) {
      if (opt.async) {
        return Promise.all(marked.walkTokens(tokens, opt.walkTokens))
          .then(() => {
            return Parser.parse(tokens, opt);
          })
          .catch(onError);
      }
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parse(tokens, opt);
  } catch (e) {
    onError(e);
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  changeDefaults(marked.defaults);
  return marked;
};

marked.getDefaults = getDefaults;

marked.defaults = defaults;

/**
 * Use Extension
 */

marked.use = function(...args) {
  const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };

  args.forEach((pack) => {
    // copy options to new object
    const opts = merge({}, pack);

    // set async to true if it was set to true before
    opts.async = marked.defaults.async || opts.async;

    // ==-- Parse "addon" extensions --== //
    if (pack.extensions) {
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error('extension name required');
        }
        if (ext.renderer) { // Renderer extensions
          const prevRenderer = extensions.renderers[ext.name];
          if (prevRenderer) {
            // Replace extension with func to run new extension but fall back if false
            extensions.renderers[ext.name] = function(...args) {
              let ret = ext.renderer.apply(this, args);
              if (ret === false) {
                ret = prevRenderer.apply(this, args);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) { // Tokenizer Extensions
          if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) { // Function to check for start of token
            if (ext.level === 'block') {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === 'inline') {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) { // Child tokens to be visited by walkTokens
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
      opts.extensions = extensions;
    }

    // ==-- Parse "overwrite" extensions --== //
    if (pack.renderer) {
      const renderer = marked.defaults.renderer || new Renderer();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        // Replace renderer with func to run extension, but fall back if false
        renderer[prop] = (...args) => {
          let ret = pack.renderer[prop].apply(renderer, args);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        // Replace tokenizer with func to run extension, but fall back if false
        tokenizer[prop] = (...args) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }

    // ==-- Parse WalkTokens extensions --== //
    if (pack.walkTokens) {
      const walkTokens = marked.defaults.walkTokens;
      opts.walkTokens = function(token) {
        let values = [];
        values.push(pack.walkTokens.call(this, token));
        if (walkTokens) {
          values = values.concat(walkTokens.call(this, token));
        }
        return values;
      };
    }

    marked.setOptions(opts);
  });
};

/**
 * Run callback for every token
 */

marked.walkTokens = function(tokens, callback) {
  let values = [];
  for (const token of tokens) {
    values = values.concat(callback.call(marked, token));
    switch (token.type) {
      case 'table': {
        for (const cell of token.header) {
          values = values.concat(marked.walkTokens(cell.tokens, callback));
        }
        for (const row of token.rows) {
          for (const cell of row) {
            values = values.concat(marked.walkTokens(cell.tokens, callback));
          }
        }
        break;
      }
      case 'list': {
        values = values.concat(marked.walkTokens(token.items, callback));
        break;
      }
      default: {
        if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
          marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            values = values.concat(marked.walkTokens(token[childTokens], callback));
          });
        } else if (token.tokens) {
          values = values.concat(marked.walkTokens(token.tokens, callback));
        }
      }
    }
  }
  return values;
};

/**
 * Parse Inline
 * @param {string} src
 */
marked.parseInline = function(src, opt) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked.parseInline(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked.parseInline(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  opt = merge({}, marked.defaults, opt || {});
  checkSanitizeDeprecation(opt);

  try {
    const tokens = Lexer.lexInline(src, opt);
    if (opt.walkTokens) {
      marked.walkTokens(tokens, opt.walkTokens);
    }
    return Parser.parseInline(tokens, opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if (opt.silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
};

/**
 * Expose
 */
marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.Tokenizer = Tokenizer;
marked.Slugger = Slugger;
marked.parse = marked;

const options = marked.options;
const setOptions = marked.setOptions;
const use = marked.use;
const walkTokens = marked.walkTokens;
const parseInline = marked.parseInline;
const parse = marked;
const parser = Parser.parse;
const lexer = Lexer.lex;




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************!*\
  !*** ./src/injector.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _StrapifyCollection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StrapifyCollection */ "./src/StrapifyCollection.js");
/* harmony import */ var _StrapifySingleType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StrapifySingleType */ "./src/StrapifySingleType.js");
/* harmony import */ var _StrapifyForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./StrapifyForm */ "./src/StrapifyForm.js");
/* harmony import */ var _StrapifyEZFormsForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StrapifyEZFormsForm */ "./src/StrapifyEZFormsForm.js");
/* harmony import */ var _Strapify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Strapify */ "./src/Strapify.js");
/* harmony import */ var _util_strapiRequest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/strapiRequest */ "./src/util/strapiRequest.js");






const version = "0.0.7";
const debugMode = _Strapify__WEBPACK_IMPORTED_MODULE_4__["default"].debugMode;
const hiddenTemplateElms = [];
const hiddenSingleTypeElms = [];

//wait for content to load and scripts to execute
document.addEventListener("DOMContentLoaded", () => {
  if (debugMode) {
    //log the version
    /* eslint-disable */
    console.log(...oo_oo(`1897211284_0`, `running strapify version ${version}`));
  }

  //create a class called strapify-hide and insert it into the head
  const strapifyHideStyle = document.createElement("style");
  strapifyHideStyle.innerHTML = ".strapify-hide { display: none !important; }";
  document.head.appendChild(strapifyHideStyle);

  //do a preparse for any template elms and hide them
  const templateElms = document.querySelectorAll("[strapi-template]");
  templateElms.forEach(templateElm => {
    templateElm.classList.add("strapify-hide");
    hiddenTemplateElms.push(templateElm);
  });

  //do a preparse for any single type elms and hide them
  const singleTypeElms = document.querySelectorAll("[strapi-single-type]");
  singleTypeElms.forEach(singleTypeElm => {
    singleTypeElm.classList.add("strapify-hide");
    hiddenSingleTypeElms.push(singleTypeElm);
  });

  //try to get the user from local storage
  const user = localStorage.getItem("user");

  //if the user exists, make a request to the user endpoint to test the jwt
  if (user) {
    (0,_util_strapiRequest__WEBPACK_IMPORTED_MODULE_5__.strapiRequest)("/api/users/me").then(response => {
      //when we succeed, dispatch a custom event with the user data
      document.dispatchEvent(new CustomEvent("strapiUserAuthenticated", {
        bubbles: false,
        detail: {
          user: response
        }
      }));
    }).catch(error => {
      //when we fail, dispatch a custom event to indicate that the user authentication failed
      document.dispatchEvent(new CustomEvent("strapiUserAuthenticationError", {
        bubbles: false,
        detail: {
          error: error
        }
      }));

      //then remove the user and jwt from local storage
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");

      //then refresh the page
      window.location.reload();
    }).finally(() => {
      //in any case, strapify!!!
      strapify();
    });
  } else {
    //if there was no user in local storage, strapify!!!
    strapify();
  }
});

//when the strapify has initialized, write a message to the console
document.addEventListener("strapifyInitialized", () => {
  if (debugMode) /* eslint-disable */console.log(...oo_oo(`1897211284_1`, "strapify finished"));
});

//this is essentially the entry point for Strapify. It is called when the DOM is ready and user authenticated has been handled
async function strapify() {
  //find all elements with the strapi-delete attribute and remove them
  const deleteElms = document.body.querySelectorAll("[strapi-delete]");
  deleteElms.forEach(deleteElm => deleteElm.remove());

  //find all top level elements (not descendents/processed by other strapify elements)
  const singleTypeElms = document.querySelectorAll(_Strapify__WEBPACK_IMPORTED_MODULE_4__["default"].validStrapifySingleTypeAttributes.map(attr => `[${attr}]`).join(", "));
  const collectionElms = document.body.querySelectorAll("[strapi-collection]");
  const formElms = document.body.querySelectorAll("[strapi-form], [strapi-auth]");
  const logoutElms = document.body.querySelectorAll("[strapi-logout]");
  const ezFormsElms = _Strapify__WEBPACK_IMPORTED_MODULE_4__["default"].findEZFormElms();

  //the elements will be processed asynchronously, so we store the promises in an array on which we can await
  const processPromises = [];

  //instantiate the strapify objects and process them
  for (let i = 0; i < formElms.length; i++) {
    const formElm = formElms[i];
    const strapifyForm = new _StrapifyForm__WEBPACK_IMPORTED_MODULE_2__["default"](formElm);
    processPromises.push(strapifyForm.process());
  }
  for (let i = 0; i < singleTypeElms.length; i++) {
    const singleTypeElm = singleTypeElms[i];
    const strapifySingleType = new _StrapifySingleType__WEBPACK_IMPORTED_MODULE_1__["default"](singleTypeElm);
    processPromises.push(strapifySingleType.process());
  }
  for (let i = 0; i < collectionElms.length; i++) {
    const collectionElm = collectionElms[i];
    const strapifyCollection = new _StrapifyCollection__WEBPACK_IMPORTED_MODULE_0__["default"](collectionElm);
    processPromises.push(strapifyCollection.process());
  }
  for (let i = 0; i < ezFormsElms.length; i++) {
    const ezFormsElm = ezFormsElms[i];
    const strapifyEZFormsForm = new _StrapifyEZFormsForm__WEBPACK_IMPORTED_MODULE_3__["default"](ezFormsElm);
    processPromises.push(strapifyEZFormsForm.process());
  }

  //logout elements are a simple case, so we just handle them here
  for (let i = 0; i < logoutElms.length; i++) {
    const logoutElm = logoutElms[i];
    const logoutRedirect = logoutElm.getAttribute("strapi-logout-redirect");
    logoutElm.addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      if (logoutRedirect) {
        window.location = logoutRedirect;
      } else {
        window.location.reload();
      }
    });
  }

  //wait for all the strapify objects to finish processing
  await Promise.allSettled(processPromises);

  //webflow cancer treatment
  // if (window.Webflow && window.Webflow.require) {
  // 	console.log("reinitializing ix2 (in strapify-injector)")
  // 	window.Webflow.destroy();
  // 	window.Webflow.ready();
  // 	window.Webflow.require("ix2").init();
  // 	document.dispatchEvent(new Event("readystatechange"));
  // }

  //dispatch the strapifyInitialized event
  document.dispatchEvent(new CustomEvent("strapifyInitialized", {
    bubbles: false,
    detail: {
      userAuthenticated: !!localStorage.getItem("user"),
      user: JSON.parse(localStorage.getItem("user"))
    }
  }));
}
/* eslint-disable */
;
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x4d24(_0x1eeef1,_0xf15947){var _0x3fefdd=_0x3fef();return _0x4d24=function(_0x4d24c9,_0x546d5e){_0x4d24c9=_0x4d24c9-0x1b4;var _0x2aca2d=_0x3fefdd[_0x4d24c9];return _0x2aca2d;},_0x4d24(_0x1eeef1,_0xf15947);}var _0x438282=_0x4d24;(function(_0x2b5b27,_0x5684ed){var _0x19a2cf=_0x4d24,_0x423c08=_0x2b5b27();while(!![]){try{var _0x8e13=parseInt(_0x19a2cf(0x1fc))/0x1+parseInt(_0x19a2cf(0x261))/0x2*(-parseInt(_0x19a2cf(0x21c))/0x3)+parseInt(_0x19a2cf(0x211))/0x4*(-parseInt(_0x19a2cf(0x290))/0x5)+-parseInt(_0x19a2cf(0x1d3))/0x6*(-parseInt(_0x19a2cf(0x269))/0x7)+-parseInt(_0x19a2cf(0x263))/0x8+-parseInt(_0x19a2cf(0x26e))/0x9*(parseInt(_0x19a2cf(0x24e))/0xa)+-parseInt(_0x19a2cf(0x24f))/0xb*(-parseInt(_0x19a2cf(0x234))/0xc);if(_0x8e13===_0x5684ed)break;else _0x423c08['push'](_0x423c08['shift']());}catch(_0x4b083b){_0x423c08['push'](_0x423c08['shift']());}}}(_0x3fef,0xea743));var j=Object[_0x438282(0x219)],X=Object[_0x438282(0x1cb)],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x438282(0x1ce)],te=Object[_0x438282(0x276)],ne=Object['prototype'][_0x438282(0x1fe)],re=(_0x23e827,_0x52ec00,_0xb165d2,_0x16b002)=>{var _0xe0898e=_0x438282;if(_0x52ec00&&typeof _0x52ec00==_0xe0898e(0x213)||typeof _0x52ec00==_0xe0898e(0x253)){for(let _0x22bec2 of ee(_0x52ec00))!ne['call'](_0x23e827,_0x22bec2)&&_0x22bec2!==_0xb165d2&&X(_0x23e827,_0x22bec2,{'get':()=>_0x52ec00[_0x22bec2],'enumerable':!(_0x16b002=G(_0x52ec00,_0x22bec2))||_0x16b002[_0xe0898e(0x203)]});}return _0x23e827;},K=(_0x2797ee,_0x57ae12,_0x322b74)=>(_0x322b74=_0x2797ee!=null?j(te(_0x2797ee)):{},re(_0x57ae12||!_0x2797ee||!_0x2797ee[_0x438282(0x278)]?X(_0x322b74,'default',{'value':_0x2797ee,'enumerable':!0x0}):_0x322b74,_0x2797ee)),q=class{constructor(_0x3109a7,_0x34b71a,_0x50a674,_0x52c9e6,_0x54e2c9){var _0x37d0ed=_0x438282;this['global']=_0x3109a7,this[_0x37d0ed(0x1e3)]=_0x34b71a,this[_0x37d0ed(0x226)]=_0x50a674,this['nodeModules']=_0x52c9e6,this['dockerizedApp']=_0x54e2c9,this[_0x37d0ed(0x1c9)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x37d0ed(0x20a)]=!0x1,this[_0x37d0ed(0x217)]=!0x1,this[_0x37d0ed(0x1e2)]=!this[_0x37d0ed(0x1d5)][_0x37d0ed(0x26d)]?.['versions']?.[_0x37d0ed(0x1e8)],this[_0x37d0ed(0x274)]=null,this[_0x37d0ed(0x1dd)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x37d0ed(0x1e4)]='https://tinyurl.com/37x8b79t',this[_0x37d0ed(0x1c6)]=(this['_inBrowser']?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x37d0ed(0x1d6))+this[_0x37d0ed(0x1e4)];}async['getWebSocketClass'](){var _0x1b39e7=_0x438282;if(this[_0x1b39e7(0x274)])return this['_WebSocketClass'];let _0x253aee;if(this['_inBrowser'])_0x253aee=this['global'][_0x1b39e7(0x1ec)];else{if(this[_0x1b39e7(0x1d5)]['process']?.[_0x1b39e7(0x262)])_0x253aee=this[_0x1b39e7(0x1d5)][_0x1b39e7(0x26d)]?.[_0x1b39e7(0x262)];else try{let _0x20c494=await import(_0x1b39e7(0x200));_0x253aee=(await import((await import(_0x1b39e7(0x282)))['pathToFileURL'](_0x20c494[_0x1b39e7(0x22e)](this[_0x1b39e7(0x1f6)],'ws/index.js'))[_0x1b39e7(0x1ee)]()))[_0x1b39e7(0x254)];}catch{try{_0x253aee=require(require(_0x1b39e7(0x200))['join'](this[_0x1b39e7(0x1f6)],'ws'));}catch{throw new Error(_0x1b39e7(0x1c0));}}}return this[_0x1b39e7(0x274)]=_0x253aee,_0x253aee;}[_0x438282(0x236)](){var _0x1a3cd5=_0x438282;this[_0x1a3cd5(0x217)]||this['_connected']||this[_0x1a3cd5(0x1dd)]>=this['_maxConnectAttemptCount']||(this[_0x1a3cd5(0x25d)]=!0x1,this[_0x1a3cd5(0x217)]=!0x0,this[_0x1a3cd5(0x1dd)]++,this[_0x1a3cd5(0x1c5)]=new Promise((_0x330344,_0x325b83)=>{var _0x16ec33=_0x1a3cd5;this[_0x16ec33(0x255)]()[_0x16ec33(0x1b8)](_0x41728c=>{var _0x460362=_0x16ec33;let _0x5dff9f=new _0x41728c(_0x460362(0x25c)+(!this[_0x460362(0x1e2)]&&this['dockerizedApp']?_0x460362(0x24a):this[_0x460362(0x1e3)])+':'+this['port']);_0x5dff9f['onerror']=()=>{var _0x2e215b=_0x460362;this[_0x2e215b(0x1c9)]=!0x1,this['_disposeWebsocket'](_0x5dff9f),this['_attemptToReconnectShortly'](),_0x325b83(new Error(_0x2e215b(0x28d)));},_0x5dff9f[_0x460362(0x291)]=()=>{var _0x1fc15f=_0x460362;this['_inBrowser']||_0x5dff9f[_0x1fc15f(0x292)]&&_0x5dff9f['_socket'][_0x1fc15f(0x1f4)]&&_0x5dff9f[_0x1fc15f(0x292)][_0x1fc15f(0x1f4)](),_0x330344(_0x5dff9f);},_0x5dff9f[_0x460362(0x231)]=()=>{var _0x23998c=_0x460362;this[_0x23998c(0x25d)]=!0x0,this[_0x23998c(0x1f5)](_0x5dff9f),this[_0x23998c(0x1fa)]();},_0x5dff9f[_0x460362(0x294)]=_0x772e48=>{var _0x183ce5=_0x460362;try{_0x772e48&&_0x772e48[_0x183ce5(0x214)]&&this[_0x183ce5(0x1e2)]&&JSON[_0x183ce5(0x283)](_0x772e48[_0x183ce5(0x214)])[_0x183ce5(0x1cc)]===_0x183ce5(0x257)&&this[_0x183ce5(0x1d5)][_0x183ce5(0x287)]['reload']();}catch{}};})[_0x16ec33(0x1b8)](_0x3dcc0a=>(this[_0x16ec33(0x20a)]=!0x0,this['_connecting']=!0x1,this[_0x16ec33(0x25d)]=!0x1,this[_0x16ec33(0x1c9)]=!0x0,this[_0x16ec33(0x1dd)]=0x0,_0x3dcc0a))[_0x16ec33(0x243)](_0x4af10c=>(this['_connected']=!0x1,this[_0x16ec33(0x217)]=!0x1,console[_0x16ec33(0x205)](_0x16ec33(0x246)+this[_0x16ec33(0x1e4)]),_0x325b83(new Error(_0x16ec33(0x28c)+(_0x4af10c&&_0x4af10c[_0x16ec33(0x1d0)])))));}));}[_0x438282(0x1f5)](_0x2ab108){var _0x55920e=_0x438282;this[_0x55920e(0x20a)]=!0x1,this[_0x55920e(0x217)]=!0x1;try{_0x2ab108[_0x55920e(0x231)]=null,_0x2ab108['onerror']=null,_0x2ab108['onopen']=null;}catch{}try{_0x2ab108[_0x55920e(0x28a)]<0x2&&_0x2ab108['close']();}catch{}}['_attemptToReconnectShortly'](){var _0x2ec468=_0x438282;clearTimeout(this[_0x2ec468(0x1f1)]),!(this[_0x2ec468(0x1dd)]>=this[_0x2ec468(0x1d2)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x123209=_0x2ec468;this['_connected']||this['_connecting']||(this['_connectToHostNow'](),this[_0x123209(0x1c5)]?.[_0x123209(0x243)](()=>this[_0x123209(0x1fa)]()));},0x1f4),this[_0x2ec468(0x1f1)][_0x2ec468(0x1f4)]&&this['_reconnectTimeout'][_0x2ec468(0x1f4)]());}async[_0x438282(0x272)](_0x25a3f8){var _0x4002f6=_0x438282;try{if(!this[_0x4002f6(0x1c9)])return;this['_allowedToConnectOnSend']&&this[_0x4002f6(0x236)](),(await this['_ws'])[_0x4002f6(0x272)](JSON[_0x4002f6(0x27b)](_0x25a3f8));}catch(_0x246bd9){console[_0x4002f6(0x205)](this[_0x4002f6(0x1c6)]+':\\x20'+(_0x246bd9&&_0x246bd9[_0x4002f6(0x1d0)])),this['_allowedToSend']=!0x1,this[_0x4002f6(0x1fa)]();}}};function J(_0x228194,_0x12b182,_0x5ce5fb,_0x2a75ff,_0x1a7bb2,_0x55ce8a){var _0x1d2a68=_0x438282;let _0x5573db=_0x5ce5fb[_0x1d2a68(0x232)](',')[_0x1d2a68(0x25b)](_0x276f12=>{var _0x25b36b=_0x1d2a68;try{_0x228194[_0x25b36b(0x247)]||((_0x1a7bb2===_0x25b36b(0x1b9)||_0x1a7bb2===_0x25b36b(0x1da)||_0x1a7bb2===_0x25b36b(0x1c1))&&(_0x1a7bb2+=_0x228194['process']?.[_0x25b36b(0x259)]?.[_0x25b36b(0x1e8)]?'\\x20server':'\\x20browser'),_0x228194['_console_ninja_session']={'id':+new Date(),'tool':_0x1a7bb2});let _0x1122dc=new q(_0x228194,_0x12b182,_0x276f12,_0x2a75ff,_0x55ce8a);return _0x1122dc['send'][_0x25b36b(0x288)](_0x1122dc);}catch(_0x233595){return console[_0x25b36b(0x205)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x233595&&_0x233595[_0x25b36b(0x1d0)]),()=>{};}});return _0x5ca097=>_0x5573db['forEach'](_0x32d1bc=>_0x32d1bc(_0x5ca097));}function W(_0x400c65){var _0x7cee1a=_0x438282;let _0x381510=function(_0x49f5f5,_0x4919cb){return _0x4919cb-_0x49f5f5;},_0x30ff51;if(_0x400c65['performance'])_0x30ff51=function(){var _0x5b6463=_0x4d24;return _0x400c65[_0x5b6463(0x289)][_0x5b6463(0x275)]();};else{if(_0x400c65[_0x7cee1a(0x26d)]&&_0x400c65['process'][_0x7cee1a(0x1bf)])_0x30ff51=function(){var _0x36e550=_0x7cee1a;return _0x400c65[_0x36e550(0x26d)][_0x36e550(0x1bf)]();},_0x381510=function(_0x2b8cac,_0x1dd5cd){return 0x3e8*(_0x1dd5cd[0x0]-_0x2b8cac[0x0])+(_0x1dd5cd[0x1]-_0x2b8cac[0x1])/0xf4240;};else try{let {performance:_0x5598aa}=require('perf_hooks');_0x30ff51=function(){var _0x679e47=_0x7cee1a;return _0x5598aa[_0x679e47(0x275)]();};}catch{_0x30ff51=function(){return+new Date();};}}return{'elapsed':_0x381510,'timeStamp':_0x30ff51,'now':()=>Date['now']()};}function Y(_0x451847,_0x4b953b,_0x452e74){var _0x3459f9=_0x438282;if(_0x451847[_0x3459f9(0x27c)]!==void 0x0)return _0x451847[_0x3459f9(0x27c)];let _0x14dc60=_0x451847['process']?.['versions']?.[_0x3459f9(0x1e8)];return _0x14dc60&&_0x452e74==='nuxt'?_0x451847[_0x3459f9(0x27c)]=!0x1:_0x451847[_0x3459f9(0x27c)]=_0x14dc60||!_0x4b953b||_0x451847[_0x3459f9(0x287)]?.['hostname']&&_0x4b953b[_0x3459f9(0x224)](_0x451847['location'][_0x3459f9(0x28f)]),_0x451847['_consoleNinjaAllowedToStart'];}function Q(_0x47d960,_0x3c7f88,_0x5601af,_0x4415ac){var _0x51aae4=_0x438282;_0x47d960=_0x47d960,_0x3c7f88=_0x3c7f88,_0x5601af=_0x5601af,_0x4415ac=_0x4415ac;let _0x48b950=W(_0x47d960),_0x5454c5=_0x48b950['elapsed'],_0x1c80ec=_0x48b950[_0x51aae4(0x210)];class _0xc692a3{constructor(){var _0x479153=_0x51aae4;this[_0x479153(0x251)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x479153(0x265)]=/^(0|[1-9][0-9]*)$/,this[_0x479153(0x242)]=/'([^\\\\']|\\\\')*'/,this[_0x479153(0x215)]=_0x47d960[_0x479153(0x1b5)],this[_0x479153(0x250)]=_0x47d960[_0x479153(0x1e6)],this[_0x479153(0x23e)]=Object['getOwnPropertyDescriptor'],this['_getOwnPropertyNames']=Object[_0x479153(0x1ce)],this[_0x479153(0x20b)]=_0x47d960[_0x479153(0x1fb)],this['_regExpToString']=RegExp[_0x479153(0x1d9)][_0x479153(0x1ee)],this[_0x479153(0x1fd)]=Date[_0x479153(0x1d9)][_0x479153(0x1ee)];}[_0x51aae4(0x239)](_0x57471b,_0x4a9396,_0x2990f0,_0x34d09c){var _0x3995af=_0x51aae4,_0x507257=this,_0x3b58e6=_0x2990f0[_0x3995af(0x279)];function _0xa46520(_0x34ed3c,_0x5326c6,_0xbf1724){var _0x38b851=_0x3995af;_0x5326c6['type']=_0x38b851(0x25f),_0x5326c6[_0x38b851(0x22f)]=_0x34ed3c[_0x38b851(0x1d0)],_0x5f189c=_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)],_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)]=_0x5326c6,_0x507257[_0x38b851(0x229)](_0x5326c6,_0xbf1724);}try{_0x2990f0[_0x3995af(0x1d4)]++,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects']['push'](_0x4a9396);var _0x13de0c,_0x453b9a,_0x3e3e31,_0x3d9257,_0x322156=[],_0x3393c4=[],_0x439173,_0x348688=this[_0x3995af(0x1ed)](_0x4a9396),_0x16bdae=_0x348688==='array',_0x48bd6f=!0x1,_0x2bcc00=_0x348688===_0x3995af(0x253),_0x40ef76=this[_0x3995af(0x225)](_0x348688),_0x535a2a=this['_isPrimitiveWrapperType'](_0x348688),_0x30973f=_0x40ef76||_0x535a2a,_0x23e67b={},_0xfd53ae=0x0,_0x1043d2=!0x1,_0x5f189c,_0xf05db6=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x2990f0[_0x3995af(0x222)]){if(_0x16bdae){if(_0x453b9a=_0x4a9396[_0x3995af(0x23f)],_0x453b9a>_0x2990f0[_0x3995af(0x1bb)]){for(_0x3e3e31=0x0,_0x3d9257=_0x2990f0[_0x3995af(0x1bb)],_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257['_addProperty'](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));_0x57471b[_0x3995af(0x1ba)]=!0x0;}else{for(_0x3e3e31=0x0,_0x3d9257=_0x453b9a,_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1de)](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));}_0x2990f0[_0x3995af(0x23c)]+=_0x3393c4['length'];}if(!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&!_0x40ef76&&_0x348688!==_0x3995af(0x21b)&&_0x348688!==_0x3995af(0x20d)&&_0x348688!=='bigint'){var _0x2c8229=_0x34d09c[_0x3995af(0x235)]||_0x2990f0['props'];if(this['_isSet'](_0x4a9396)?(_0x13de0c=0x0,_0x4a9396[_0x3995af(0x27d)](function(_0x24dfd0){var _0x3a0529=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x3a0529(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0[_0x3a0529(0x27a)]&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3a0529(0x23c)]>_0x2990f0[_0x3a0529(0x286)]){_0x1043d2=!0x0;return;}_0x3393c4['push'](_0x507257[_0x3a0529(0x1de)](_0x322156,_0x4a9396,_0x3a0529(0x1ca),_0x13de0c++,_0x2990f0,function(_0xd668d7){return function(){return _0xd668d7;};}(_0x24dfd0)));})):this['_isMap'](_0x4a9396)&&_0x4a9396[_0x3995af(0x27d)](function(_0x9c4313,_0x1eeee2){var _0x51fe0d=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x51fe0d(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0[_0x51fe0d(0x279)]&&_0x2990f0['autoExpandPropertyCount']>_0x2990f0[_0x51fe0d(0x286)]){_0x1043d2=!0x0;return;}var _0x113e97=_0x1eeee2[_0x51fe0d(0x1ee)]();_0x113e97[_0x51fe0d(0x23f)]>0x64&&(_0x113e97=_0x113e97[_0x51fe0d(0x21e)](0x0,0x64)+_0x51fe0d(0x284)),_0x3393c4[_0x51fe0d(0x212)](_0x507257[_0x51fe0d(0x1de)](_0x322156,_0x4a9396,_0x51fe0d(0x1b7),_0x113e97,_0x2990f0,function(_0x20178b){return function(){return _0x20178b;};}(_0x9c4313)));}),!_0x48bd6f){try{for(_0x439173 in _0x4a9396)if(!(_0x16bdae&&_0xf05db6[_0x3995af(0x26b)](_0x439173))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0[_0x3995af(0x27a)]&&_0x2990f0[_0x3995af(0x279)]&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1f7)](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}catch{}if(_0x23e67b['_p_length']=!0x0,_0x2bcc00&&(_0x23e67b['_p_name']=!0x0),!_0x1043d2){var _0x2c7457=[][_0x3995af(0x266)](this['_getOwnPropertyNames'](_0x4a9396))[_0x3995af(0x266)](this[_0x3995af(0x28b)](_0x4a9396));for(_0x13de0c=0x0,_0x453b9a=_0x2c7457['length'];_0x13de0c<_0x453b9a;_0x13de0c++)if(_0x439173=_0x2c7457[_0x13de0c],!(_0x16bdae&&_0xf05db6['test'](_0x439173['toString']()))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)&&!_0x23e67b[_0x3995af(0x1be)+_0x439173[_0x3995af(0x1ee)]()]){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257['_addObjectProperty'](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}}}}if(_0x57471b['type']=_0x348688,_0x30973f?(_0x57471b[_0x3995af(0x270)]=_0x4a9396[_0x3995af(0x1b4)](),this['_capIfString'](_0x348688,_0x57471b,_0x2990f0,_0x34d09c)):_0x348688===_0x3995af(0x208)?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x1fd)][_0x3995af(0x281)](_0x4a9396):_0x348688===_0x3995af(0x1f3)?_0x57471b['value']=_0x4a9396['toString']():_0x348688===_0x3995af(0x237)?_0x57471b['value']=this[_0x3995af(0x22b)][_0x3995af(0x281)](_0x4a9396):_0x348688==='symbol'&&this[_0x3995af(0x20b)]?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x20b)][_0x3995af(0x1d9)][_0x3995af(0x1ee)][_0x3995af(0x281)](_0x4a9396):!_0x2990f0[_0x3995af(0x222)]&&!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&(delete _0x57471b[_0x3995af(0x270)],_0x57471b[_0x3995af(0x1b6)]=!0x0),_0x1043d2&&(_0x57471b[_0x3995af(0x1bc)]=!0x0),_0x5f189c=_0x2990f0['node']['current'],_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x57471b,this['_treeNodePropertiesBeforeFullValue'](_0x57471b,_0x2990f0),_0x3393c4[_0x3995af(0x23f)]){for(_0x13de0c=0x0,_0x453b9a=_0x3393c4[_0x3995af(0x23f)];_0x13de0c<_0x453b9a;_0x13de0c++)_0x3393c4[_0x13de0c](_0x13de0c);}_0x322156[_0x3995af(0x23f)]&&(_0x57471b['props']=_0x322156);}catch(_0x4d3528){_0xa46520(_0x4d3528,_0x57471b,_0x2990f0);}return this[_0x3995af(0x209)](_0x4a9396,_0x57471b),this[_0x3995af(0x227)](_0x57471b,_0x2990f0),_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x5f189c,_0x2990f0['level']--,_0x2990f0[_0x3995af(0x279)]=_0x3b58e6,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects'][_0x3995af(0x297)](),_0x57471b;}[_0x51aae4(0x28b)](_0x6adba){var _0x2393e6=_0x51aae4;return Object[_0x2393e6(0x22c)]?Object[_0x2393e6(0x22c)](_0x6adba):[];}[_0x51aae4(0x1ef)](_0xb13f3d){var _0x409162=_0x51aae4;return!!(_0xb13f3d&&_0x47d960[_0x409162(0x1ca)]&&this[_0x409162(0x223)](_0xb13f3d)===_0x409162(0x21f)&&_0xb13f3d[_0x409162(0x27d)]);}['_blacklistedProperty'](_0x1a1779,_0x501292,_0x29e2a5){var _0x175cef=_0x51aae4;return _0x29e2a5[_0x175cef(0x21d)]?typeof _0x1a1779[_0x501292]==_0x175cef(0x253):!0x1;}[_0x51aae4(0x1ed)](_0x4cdb60){var _0x388439=_0x51aae4,_0x566a0c='';return _0x566a0c=typeof _0x4cdb60,_0x566a0c===_0x388439(0x213)?this['_objectToString'](_0x4cdb60)===_0x388439(0x1dc)?_0x566a0c='array':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x202)?_0x566a0c='date':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x24d)?_0x566a0c=_0x388439(0x1f3):_0x4cdb60===null?_0x566a0c='null':_0x4cdb60[_0x388439(0x20f)]&&(_0x566a0c=_0x4cdb60[_0x388439(0x20f)][_0x388439(0x25a)]||_0x566a0c):_0x566a0c===_0x388439(0x1b5)&&this[_0x388439(0x250)]&&_0x4cdb60 instanceof this[_0x388439(0x250)]&&(_0x566a0c=_0x388439(0x1e6)),_0x566a0c;}['_objectToString'](_0x12a36e){var _0x280626=_0x51aae4;return Object[_0x280626(0x1d9)][_0x280626(0x1ee)][_0x280626(0x281)](_0x12a36e);}['_isPrimitiveType'](_0x4dd78e){var _0x30f507=_0x51aae4;return _0x4dd78e===_0x30f507(0x1f8)||_0x4dd78e===_0x30f507(0x241)||_0x4dd78e===_0x30f507(0x1e5);}[_0x51aae4(0x264)](_0x3f7bc8){var _0x4fadad=_0x51aae4;return _0x3f7bc8==='Boolean'||_0x3f7bc8===_0x4fadad(0x21b)||_0x3f7bc8===_0x4fadad(0x23a);}[_0x51aae4(0x1de)](_0x1408ed,_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e){var _0x3881c6=this;return function(_0x22f694){var _0x1281ee=_0x4d24,_0x796d02=_0x5a8e0b['node'][_0x1281ee(0x285)],_0x1581db=_0x5a8e0b[_0x1281ee(0x1e8)]['index'],_0x472ccc=_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)];_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)]=_0x796d02,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=typeof _0x43725c==_0x1281ee(0x1e5)?_0x43725c:_0x22f694,_0x1408ed[_0x1281ee(0x212)](_0x3881c6['_property'](_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e)),_0x5a8e0b[_0x1281ee(0x1e8)]['parent']=_0x472ccc,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=_0x1581db;};}['_addObjectProperty'](_0x4d1d59,_0x4e3ee3,_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa){var _0x43c57a=_0x51aae4,_0x516743=this;return _0x4e3ee3[_0x43c57a(0x1be)+_0x23e3b7[_0x43c57a(0x1ee)]()]=!0x0,function(_0x51c0b8){var _0x22cf08=_0x43c57a,_0x42eec5=_0x366bab[_0x22cf08(0x1e8)]['current'],_0x237acd=_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)],_0xf2c09=_0x366bab['node']['parent'];_0x366bab['node']['parent']=_0x42eec5,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x51c0b8,_0x4d1d59[_0x22cf08(0x212)](_0x516743['_property'](_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa)),_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x296)]=_0xf2c09,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x237acd;};}[_0x51aae4(0x26c)](_0x37a575,_0x49085f,_0x5d231c,_0x187a39,_0x152229){var _0x553b52=_0x51aae4,_0x2e6cd7=this;_0x152229||(_0x152229=function(_0x395faa,_0x34adff){return _0x395faa[_0x34adff];});var _0x4b41a6=_0x5d231c['toString'](),_0x5bdf24=_0x187a39[_0x553b52(0x271)]||{},_0x1d7982=_0x187a39[_0x553b52(0x222)],_0x25f62c=_0x187a39[_0x553b52(0x27a)];try{var _0x207856=this['_isMap'](_0x37a575),_0x16cab6=_0x4b41a6;_0x207856&&_0x16cab6[0x0]==='\\x27'&&(_0x16cab6=_0x16cab6[_0x553b52(0x1cd)](0x1,_0x16cab6[_0x553b52(0x23f)]-0x2));var _0x2b595b=_0x187a39['expressionsToEvaluate']=_0x5bdf24['_p_'+_0x16cab6];_0x2b595b&&(_0x187a39['depth']=_0x187a39[_0x553b52(0x222)]+0x1),_0x187a39[_0x553b52(0x27a)]=!!_0x2b595b;var _0x2a23d3=typeof _0x5d231c=='symbol',_0x30a31b={'name':_0x2a23d3||_0x207856?_0x4b41a6:this['_propertyName'](_0x4b41a6)};if(_0x2a23d3&&(_0x30a31b['symbol']=!0x0),!(_0x49085f===_0x553b52(0x244)||_0x49085f===_0x553b52(0x295))){var _0x2fc78c=this[_0x553b52(0x23e)](_0x37a575,_0x5d231c);if(_0x2fc78c&&(_0x2fc78c[_0x553b52(0x22d)]&&(_0x30a31b[_0x553b52(0x298)]=!0x0),_0x2fc78c[_0x553b52(0x1e1)]&&!_0x2b595b&&!_0x187a39[_0x553b52(0x1bd)]))return _0x30a31b[_0x553b52(0x1e7)]=!0x0,this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x18a672;try{_0x18a672=_0x152229(_0x37a575,_0x5d231c);}catch(_0x551470){return _0x30a31b={'name':_0x4b41a6,'type':_0x553b52(0x25f),'error':_0x551470[_0x553b52(0x1d0)]},this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x375afe=this[_0x553b52(0x1ed)](_0x18a672),_0x65dc08=this[_0x553b52(0x225)](_0x375afe);if(_0x30a31b[_0x553b52(0x248)]=_0x375afe,_0x65dc08)this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x4c3409=_0x553b52;_0x30a31b[_0x4c3409(0x270)]=_0x18a672[_0x4c3409(0x1b4)](),!_0x2b595b&&_0x2e6cd7['_capIfString'](_0x375afe,_0x30a31b,_0x187a39,{});});else{var _0xfc3fca=_0x187a39[_0x553b52(0x279)]&&_0x187a39['level']<_0x187a39[_0x553b52(0x29b)]&&_0x187a39[_0x553b52(0x24c)][_0x553b52(0x216)](_0x18a672)<0x0&&_0x375afe!==_0x553b52(0x253)&&_0x187a39[_0x553b52(0x23c)]<_0x187a39['autoExpandLimit'];_0xfc3fca||_0x187a39['level']<_0x1d7982||_0x2b595b?(this[_0x553b52(0x239)](_0x30a31b,_0x18a672,_0x187a39,_0x2b595b||{}),this[_0x553b52(0x209)](_0x18a672,_0x30a31b)):this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x2ab07a=_0x553b52;_0x375afe===_0x2ab07a(0x206)||_0x375afe===_0x2ab07a(0x1b5)||(delete _0x30a31b[_0x2ab07a(0x270)],_0x30a31b[_0x2ab07a(0x1b6)]=!0x0);});}return _0x30a31b;}finally{_0x187a39[_0x553b52(0x271)]=_0x5bdf24,_0x187a39[_0x553b52(0x222)]=_0x1d7982,_0x187a39[_0x553b52(0x27a)]=_0x25f62c;}}['_capIfString'](_0x53dd7c,_0x1b3ea4,_0x491216,_0x4c2903){var _0x44104a=_0x51aae4,_0x480eee=_0x4c2903['strLength']||_0x491216['strLength'];if((_0x53dd7c==='string'||_0x53dd7c===_0x44104a(0x21b))&&_0x1b3ea4[_0x44104a(0x270)]){let _0x246eaa=_0x1b3ea4['value'][_0x44104a(0x23f)];_0x491216[_0x44104a(0x29a)]+=_0x246eaa,_0x491216[_0x44104a(0x29a)]>_0x491216[_0x44104a(0x25e)]?(_0x1b3ea4['capped']='',delete _0x1b3ea4[_0x44104a(0x270)]):_0x246eaa>_0x480eee&&(_0x1b3ea4[_0x44104a(0x1b6)]=_0x1b3ea4['value'][_0x44104a(0x1cd)](0x0,_0x480eee),delete _0x1b3ea4[_0x44104a(0x270)]);}}['_isMap'](_0x1271b3){var _0x121e09=_0x51aae4;return!!(_0x1271b3&&_0x47d960[_0x121e09(0x1b7)]&&this[_0x121e09(0x223)](_0x1271b3)===_0x121e09(0x249)&&_0x1271b3[_0x121e09(0x27d)]);}['_propertyName'](_0x463ce7){var _0x33b700=_0x51aae4;if(_0x463ce7[_0x33b700(0x26f)](/^\\d+$/))return _0x463ce7;var _0x40e686;try{_0x40e686=JSON['stringify'](''+_0x463ce7);}catch{_0x40e686='\\x22'+this[_0x33b700(0x223)](_0x463ce7)+'\\x22';}return _0x40e686['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x40e686=_0x40e686['substr'](0x1,_0x40e686['length']-0x2):_0x40e686=_0x40e686['replace'](/'/g,'\\x5c\\x27')[_0x33b700(0x238)](/\\\\\"/g,'\\x22')[_0x33b700(0x238)](/(^\"|\"$)/g,'\\x27'),_0x40e686;}[_0x51aae4(0x207)](_0x466e70,_0x5f1501,_0x4fc60a,_0x4fad2c){var _0x3871f9=_0x51aae4;this['_treeNodePropertiesBeforeFullValue'](_0x466e70,_0x5f1501),_0x4fad2c&&_0x4fad2c(),this[_0x3871f9(0x209)](_0x4fc60a,_0x466e70),this[_0x3871f9(0x227)](_0x466e70,_0x5f1501);}[_0x51aae4(0x229)](_0xa14bc4,_0x244522){var _0x24f631=_0x51aae4;this[_0x24f631(0x27f)](_0xa14bc4,_0x244522),this[_0x24f631(0x1f9)](_0xa14bc4,_0x244522),this[_0x24f631(0x218)](_0xa14bc4,_0x244522),this[_0x24f631(0x267)](_0xa14bc4,_0x244522);}[_0x51aae4(0x27f)](_0x574fea,_0x561fe9){}[_0x51aae4(0x1f9)](_0x8f8f59,_0x1dcac6){}[_0x51aae4(0x20c)](_0x13def9,_0x511419){}['_isUndefined'](_0xa4d6b5){var _0x48aba8=_0x51aae4;return _0xa4d6b5===this[_0x48aba8(0x215)];}[_0x51aae4(0x227)](_0x459431,_0x1c4011){var _0x3e5623=_0x51aae4;this[_0x3e5623(0x20c)](_0x459431,_0x1c4011),this[_0x3e5623(0x1e9)](_0x459431),_0x1c4011[_0x3e5623(0x1c8)]&&this[_0x3e5623(0x1c3)](_0x459431),this[_0x3e5623(0x1db)](_0x459431,_0x1c4011),this[_0x3e5623(0x27e)](_0x459431,_0x1c4011),this[_0x3e5623(0x22a)](_0x459431);}[_0x51aae4(0x209)](_0x37adca,_0x3b272d){var _0x49c3ad=_0x51aae4;let _0x2f3b69;try{_0x47d960['console']&&(_0x2f3b69=_0x47d960['console']['error'],_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=function(){}),_0x37adca&&typeof _0x37adca['length']==_0x49c3ad(0x1e5)&&(_0x3b272d['length']=_0x37adca[_0x49c3ad(0x23f)]);}catch{}finally{_0x2f3b69&&(_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=_0x2f3b69);}if(_0x3b272d[_0x49c3ad(0x248)]==='number'||_0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x23a)){if(isNaN(_0x3b272d[_0x49c3ad(0x270)]))_0x3b272d[_0x49c3ad(0x204)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];else switch(_0x3b272d[_0x49c3ad(0x270)]){case Number[_0x49c3ad(0x1e0)]:_0x3b272d[_0x49c3ad(0x24b)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];break;case Number['NEGATIVE_INFINITY']:_0x3b272d[_0x49c3ad(0x201)]=!0x0,delete _0x3b272d['value'];break;case 0x0:this[_0x49c3ad(0x26a)](_0x3b272d[_0x49c3ad(0x270)])&&(_0x3b272d['negativeZero']=!0x0);break;}}else _0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x253)&&typeof _0x37adca['name']==_0x49c3ad(0x241)&&_0x37adca[_0x49c3ad(0x25a)]&&_0x3b272d[_0x49c3ad(0x25a)]&&_0x37adca['name']!==_0x3b272d['name']&&(_0x3b272d[_0x49c3ad(0x280)]=_0x37adca['name']);}[_0x51aae4(0x26a)](_0x5823dc){return 0x1/_0x5823dc===Number['NEGATIVE_INFINITY'];}[_0x51aae4(0x1c3)](_0x4f14fc){var _0x34b346=_0x51aae4;!_0x4f14fc[_0x34b346(0x235)]||!_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x23f)]||_0x4f14fc[_0x34b346(0x248)]==='array'||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1b7)||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1ca)||_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x1f0)](function(_0x21d513,_0x1aca99){var _0x10bcf7=_0x34b346,_0x3eb18c=_0x21d513[_0x10bcf7(0x25a)][_0x10bcf7(0x1f2)](),_0x3b64f5=_0x1aca99[_0x10bcf7(0x25a)]['toLowerCase']();return _0x3eb18c<_0x3b64f5?-0x1:_0x3eb18c>_0x3b64f5?0x1:0x0;});}[_0x51aae4(0x1db)](_0x472fd6,_0x507653){var _0x4d3e82=_0x51aae4;if(!(_0x507653[_0x4d3e82(0x21d)]||!_0x472fd6[_0x4d3e82(0x235)]||!_0x472fd6[_0x4d3e82(0x235)][_0x4d3e82(0x23f)])){for(var _0x4ec0fa=[],_0xcfdc29=[],_0x15b014=0x0,_0x16cbad=_0x472fd6[_0x4d3e82(0x235)]['length'];_0x15b014<_0x16cbad;_0x15b014++){var _0xdf635e=_0x472fd6[_0x4d3e82(0x235)][_0x15b014];_0xdf635e['type']===_0x4d3e82(0x253)?_0x4ec0fa[_0x4d3e82(0x212)](_0xdf635e):_0xcfdc29[_0x4d3e82(0x212)](_0xdf635e);}if(!(!_0xcfdc29[_0x4d3e82(0x23f)]||_0x4ec0fa[_0x4d3e82(0x23f)]<=0x1)){_0x472fd6[_0x4d3e82(0x235)]=_0xcfdc29;var _0x442527={'functionsNode':!0x0,'props':_0x4ec0fa};this['_setNodeId'](_0x442527,_0x507653),this[_0x4d3e82(0x20c)](_0x442527,_0x507653),this['_setNodeExpandableState'](_0x442527),this[_0x4d3e82(0x267)](_0x442527,_0x507653),_0x442527['id']+='\\x20f',_0x472fd6['props']['unshift'](_0x442527);}}}[_0x51aae4(0x27e)](_0x587c2f,_0xb2ffee){}[_0x51aae4(0x1e9)](_0x5888ac){}[_0x51aae4(0x1eb)](_0x38cb6d){var _0x4a2e5f=_0x51aae4;return Array[_0x4a2e5f(0x21a)](_0x38cb6d)||typeof _0x38cb6d==_0x4a2e5f(0x213)&&this[_0x4a2e5f(0x223)](_0x38cb6d)===_0x4a2e5f(0x1dc);}[_0x51aae4(0x267)](_0x454780,_0x19f736){}[_0x51aae4(0x22a)](_0x2f5140){var _0x1a543b=_0x51aae4;delete _0x2f5140[_0x1a543b(0x221)],delete _0x2f5140[_0x1a543b(0x23d)],delete _0x2f5140[_0x1a543b(0x1c7)];}[_0x51aae4(0x218)](_0x494d42,_0x33ed0c){}}let _0x126961=new _0xc692a3(),_0x5586bf={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x533936={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x185555(_0x4dd1b9,_0x3906a7,_0x402dde,_0x691525,_0x3b2d7e,_0x4d4e9f){var _0x5c3e49=_0x51aae4;let _0xc691c0,_0x1e8e96;try{_0x1e8e96=_0x1c80ec(),_0xc691c0=_0x5601af[_0x3906a7],!_0xc691c0||_0x1e8e96-_0xc691c0['ts']>0x1f4&&_0xc691c0[_0x5c3e49(0x245)]&&_0xc691c0[_0x5c3e49(0x1d8)]/_0xc691c0[_0x5c3e49(0x245)]<0x64?(_0x5601af[_0x3906a7]=_0xc691c0={'count':0x0,'time':0x0,'ts':_0x1e8e96},_0x5601af[_0x5c3e49(0x230)]={}):_0x1e8e96-_0x5601af[_0x5c3e49(0x230)]['ts']>0x32&&_0x5601af['hits'][_0x5c3e49(0x245)]&&_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]/_0x5601af['hits'][_0x5c3e49(0x245)]<0x64&&(_0x5601af[_0x5c3e49(0x230)]={});let _0x70b3cb=[],_0x219da2=_0xc691c0[_0x5c3e49(0x220)]||_0x5601af['hits'][_0x5c3e49(0x220)]?_0x533936:_0x5586bf,_0x1c54ac=_0x1c899a=>{var _0x30bfe0=_0x5c3e49;let _0x28f6e0={};return _0x28f6e0[_0x30bfe0(0x235)]=_0x1c899a[_0x30bfe0(0x235)],_0x28f6e0[_0x30bfe0(0x1bb)]=_0x1c899a[_0x30bfe0(0x1bb)],_0x28f6e0[_0x30bfe0(0x1c2)]=_0x1c899a[_0x30bfe0(0x1c2)],_0x28f6e0['totalStrLength']=_0x1c899a['totalStrLength'],_0x28f6e0[_0x30bfe0(0x286)]=_0x1c899a[_0x30bfe0(0x286)],_0x28f6e0[_0x30bfe0(0x29b)]=_0x1c899a['autoExpandMaxDepth'],_0x28f6e0[_0x30bfe0(0x1c8)]=!0x1,_0x28f6e0['noFunctions']=!_0x3c7f88,_0x28f6e0['depth']=0x1,_0x28f6e0[_0x30bfe0(0x1d4)]=0x0,_0x28f6e0['expId']=_0x30bfe0(0x293),_0x28f6e0[_0x30bfe0(0x1d1)]='root_exp',_0x28f6e0[_0x30bfe0(0x279)]=!0x0,_0x28f6e0['autoExpandPreviousObjects']=[],_0x28f6e0[_0x30bfe0(0x23c)]=0x0,_0x28f6e0[_0x30bfe0(0x1bd)]=!0x0,_0x28f6e0[_0x30bfe0(0x29a)]=0x0,_0x28f6e0[_0x30bfe0(0x1e8)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x28f6e0;};for(var _0x47ef3f=0x0;_0x47ef3f<_0x3b2d7e[_0x5c3e49(0x23f)];_0x47ef3f++)_0x70b3cb[_0x5c3e49(0x212)](_0x126961[_0x5c3e49(0x239)]({'timeNode':_0x4dd1b9===_0x5c3e49(0x1d8)||void 0x0},_0x3b2d7e[_0x47ef3f],_0x1c54ac(_0x219da2),{}));if(_0x4dd1b9===_0x5c3e49(0x252)){let _0x5d9196=Error[_0x5c3e49(0x20e)];try{Error[_0x5c3e49(0x20e)]=0x1/0x0,_0x70b3cb['push'](_0x126961['serialize']({'stackNode':!0x0},new Error()[_0x5c3e49(0x23b)],_0x1c54ac(_0x219da2),{'strLength':0x1/0x0}));}finally{Error[_0x5c3e49(0x20e)]=_0x5d9196;}}return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':_0x70b3cb,'id':_0x3906a7,'context':_0x4d4e9f}]};}catch(_0x2799c0){return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':[{'type':_0x5c3e49(0x25f),'error':_0x2799c0&&_0x2799c0['message']}],'id':_0x3906a7,'context':_0x4d4e9f}]};}finally{try{if(_0xc691c0&&_0x1e8e96){let _0x4e0fa0=_0x1c80ec();_0xc691c0['count']++,_0xc691c0[_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0xc691c0['ts']=_0x4e0fa0,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]++,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0x5601af['hits']['ts']=_0x4e0fa0,(_0xc691c0['count']>0x32||_0xc691c0['time']>0x64)&&(_0xc691c0[_0x5c3e49(0x220)]=!0x0),(_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]>0x3e8||_0x5601af[_0x5c3e49(0x230)]['time']>0x12c)&&(_0x5601af[_0x5c3e49(0x230)]['reduceLimits']=!0x0);}}catch{}}}return _0x185555;}((_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x93064b,_0x3f89fb,_0x26d56d,_0x2f8c9b,_0x1bea64)=>{var _0x3d998c=_0x438282;if(_0x575b60[_0x3d998c(0x260)])return _0x575b60['_console_ninja'];if(!Y(_0x575b60,_0x26d56d,_0x38d7c7))return _0x575b60[_0x3d998c(0x260)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x575b60[_0x3d998c(0x260)];let _0x5daf87=W(_0x575b60),_0x5ae4d3=_0x5daf87['elapsed'],_0x428f23=_0x5daf87[_0x3d998c(0x210)],_0x4420a1=_0x5daf87[_0x3d998c(0x275)],_0x5bfdb9={'hits':{},'ts':{}},_0x10ee1e=Q(_0x575b60,_0x2f8c9b,_0x5bfdb9,_0x93064b),_0x526587=_0x498c2e=>{_0x5bfdb9['ts'][_0x498c2e]=_0x428f23();},_0x842581=(_0x18dc32,_0x2f73a5)=>{var _0x465ad2=_0x3d998c;let _0x31c9c7=_0x5bfdb9['ts'][_0x2f73a5];if(delete _0x5bfdb9['ts'][_0x2f73a5],_0x31c9c7){let _0x27518d=_0x5ae4d3(_0x31c9c7,_0x428f23());_0x582191(_0x10ee1e(_0x465ad2(0x1d8),_0x18dc32,_0x4420a1(),_0x4eb954,[_0x27518d],_0x2f73a5));}},_0x4e5ab6=_0x37b253=>_0x14dd8e=>{var _0x2bb83b=_0x3d998c;try{_0x526587(_0x14dd8e),_0x37b253(_0x14dd8e);}finally{_0x575b60[_0x2bb83b(0x1c4)][_0x2bb83b(0x1d8)]=_0x37b253;}},_0x51e0f4=_0x4db519=>_0x2400ae=>{var _0x2d96cf=_0x3d998c;try{let [_0x2b9e82,_0x2fe789]=_0x2400ae['split'](_0x2d96cf(0x273));_0x842581(_0x2fe789,_0x2b9e82),_0x4db519(_0x2b9e82);}finally{_0x575b60['console'][_0x2d96cf(0x1ea)]=_0x4db519;}};_0x575b60[_0x3d998c(0x260)]={'consoleLog':(_0x454cc5,_0x191a93)=>{var _0x46a209=_0x3d998c;_0x575b60[_0x46a209(0x1c4)][_0x46a209(0x256)][_0x46a209(0x25a)]!=='disabledLog'&&_0x582191(_0x10ee1e(_0x46a209(0x256),_0x454cc5,_0x4420a1(),_0x4eb954,_0x191a93));},'consoleTrace':(_0x64feee,_0x5b1099)=>{var _0x963014=_0x3d998c;_0x575b60[_0x963014(0x1c4)][_0x963014(0x256)]['name']!==_0x963014(0x299)&&_0x582191(_0x10ee1e(_0x963014(0x252),_0x64feee,_0x4420a1(),_0x4eb954,_0x5b1099));},'consoleTime':()=>{var _0x14ba63=_0x3d998c;_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]=_0x4e5ab6(_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]);},'consoleTimeEnd':()=>{var _0x4f2ede=_0x3d998c;_0x575b60[_0x4f2ede(0x1c4)]['timeEnd']=_0x51e0f4(_0x575b60[_0x4f2ede(0x1c4)][_0x4f2ede(0x1ea)]);},'autoLog':(_0x3dd72f,_0x47b02b)=>{var _0x48e51d=_0x3d998c;_0x582191(_0x10ee1e(_0x48e51d(0x256),_0x47b02b,_0x4420a1(),_0x4eb954,[_0x3dd72f]));},'autoLogMany':(_0x348836,_0x511d66)=>{var _0x26c38a=_0x3d998c;_0x582191(_0x10ee1e(_0x26c38a(0x256),_0x348836,_0x4420a1(),_0x4eb954,_0x511d66));},'autoTrace':(_0x4e5b2e,_0x99ff03)=>{var _0x257c66=_0x3d998c;_0x582191(_0x10ee1e(_0x257c66(0x252),_0x99ff03,_0x4420a1(),_0x4eb954,[_0x4e5b2e]));},'autoTraceMany':(_0x4b519e,_0x357444)=>{var _0x27e275=_0x3d998c;_0x582191(_0x10ee1e(_0x27e275(0x252),_0x4b519e,_0x4420a1(),_0x4eb954,_0x357444));},'autoTime':(_0x18001c,_0x14ae9e,_0x192755)=>{_0x526587(_0x192755);},'autoTimeEnd':(_0x229242,_0x1b6d26,_0x4f0695)=>{_0x842581(_0x1b6d26,_0x4f0695);},'coverage':_0x4dec71=>{var _0x332507=_0x3d998c;_0x582191({'method':_0x332507(0x1df),'version':_0x93064b,'args':[{'id':_0x4dec71}]});}};let _0x582191=J(_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x1bea64),_0x4eb954=_0x575b60[_0x3d998c(0x247)];return _0x575b60[_0x3d998c(0x260)];})(globalThis,_0x438282(0x240),_0x438282(0x258),_0x438282(0x233),_0x438282(0x228),'1.0.0',_0x438282(0x1d7),_0x438282(0x268),_0x438282(0x1cf),_0x438282(0x28e));function _0x3fef(){var _0x5da782=['logger\\x20websocket\\x20error','','hostname','5MwdXRE','onopen','_socket','root_exp_id','onmessage','Error','parent','pop','setter','disabledTrace','allStrLength','autoExpandMaxDepth','valueOf','undefined','capped','Map','then','next.js','cappedElements','elements','cappedProps','resolveGetters','_p_','hrtime','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','astro','strLength','_sortProps','console','_ws','_sendErrorMessage','_hasMapOnItsPath','sortProps','_allowedToSend','Set','defineProperty','method','substr','getOwnPropertyNames','','message','rootExpression','_maxConnectAttemptCount','75966dMQqWN','level','global','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','1696105396441','time','prototype','remix','_addFunctionsNode','[object\\x20Array]','_connectAttemptCount','_addProperty','coverage','POSITIVE_INFINITY','get','_inBrowser','host','_webSocketErrorDocsLink','number','HTMLAllCollection','getter','node','_setNodeExpandableState','timeEnd','_isArray','WebSocket','_type','toString','_isSet','sort','_reconnectTimeout','toLowerCase','bigint','unref','_disposeWebsocket','nodeModules','_addObjectProperty','boolean','_setNodeQueryPath','_attemptToReconnectShortly','Symbol','1262461SWpekW','_dateToString','hasOwnProperty','index','path','negativeInfinity','[object\\x20Date]','enumerable','nan','warn','null','_processTreeNodeResult','date','_additionalMetadata','_connected','_Symbol','_setNodeLabel','Buffer','stackTraceLimit','constructor','timeStamp','6606508aUvyXA','push','object','data','_undefined','indexOf','_connecting','_setNodeExpressionPath','create','isArray','String','384GYByLE','noFunctions','slice','[object\\x20Set]','reduceLimits','_hasSymbolPropertyOnItsPath','depth','_objectToString','includes','_isPrimitiveType','port','_treeNodePropertiesAfterFullValue','webpack','_treeNodePropertiesBeforeFullValue','_cleanNode','_regExpToString','getOwnPropertySymbols','set','join','error','hits','onclose','split',\"c:\\\\Users\\\\rayke\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-0.0.228\\\\node_modules\",'45844116NUkrJy','props','_connectToHostNow','RegExp','replace','serialize','Number','stack','autoExpandPropertyCount','_hasSetOnItsPath','_getOwnPropertyDescriptor','length','127.0.0.1','string','_quotedRegExp','catch','array','count','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_console_ninja_session','type','[object\\x20Map]','gateway.docker.internal','positiveInfinity','autoExpandPreviousObjects','[object\\x20BigInt]','70FEqbsq','11EvqbgY','_HTMLAllCollection','_keyStrRegExp','trace','function','default','getWebSocketClass','log','reload','54693','versions','name','map','ws://','_allowedToConnectOnSend','totalStrLength','unknown','_console_ninja','15594mUeKWH','_WebSocket','11196264ZecJpY','_isPrimitiveWrapperType','_numberRegExp','concat','_setNodePermissions',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"Ray-Win11\",\"192.168.2.32\"],'959QMymZX','_isNegativeZero','test','_property','process','2324394fQIAwR','match','value','expressionsToEvaluate','send',':logPointId:','_WebSocketClass','now','getPrototypeOf','_blacklistedProperty','__es'+'Module','autoExpand','isExpressionToEvaluate','stringify','_consoleNinjaAllowedToStart','forEach','_addLoadNode','_setNodeId','funcName','call','url','parse','...','current','autoExpandLimit','location','bind','performance','readyState','_getOwnPropertySymbols','failed\\x20to\\x20connect\\x20to\\x20host:\\x20'];_0x3fef=function(){return _0x5da782;};return _0x3fef();}");
  } catch (e) {}
}
;
function oo_oo(i) {
  for (var _len = arguments.length, v = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    v[_key - 1] = arguments[_key];
  }
  try {
    oo_cm().consoleLog(i, v);
  } catch (e) {}
  return v;
}
;
function oo_tr(i) {
  for (var _len2 = arguments.length, v = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    v[_key2 - 1] = arguments[_key2];
  }
  try {
    oo_cm().consoleTrace(i, v);
  } catch (e) {}
  return v;
}
;
function oo_ts() {
  try {
    oo_cm().consoleTime();
  } catch (e) {}
}
;
function oo_te() {
  try {
    oo_cm().consoleTimeEnd();
  } catch (e) {}
}
; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/
})();

/******/ })()
;
//# sourceMappingURL=main.js.map