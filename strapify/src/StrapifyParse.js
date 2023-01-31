import Strapify from "./Strapify";

const debugMode = Strapify.debugMode;
const debugStrict = true;
const validateStrapiEndpoints = true;//Strapify.debugValidateStrapiEndpoints;

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
		const collectionName = parseDetails.htmlElement
			.closest("[strapi-collection]")
			.getAttribute("strapi-collection");

		//attempt to fetch collection

	}
}

function splitArguments(attributeValue, parseDetails) {
	//split at single occurences of pipe, but not double or more pipes
	let argValues = attributeValue.split(/(?<!\|)\|(?!\|)/);
	let args = argValues.map((arg, i) => {
		return {
			index: i,
			value: arg.trim()
		}
	});

	//DEBUG -- check if multiple arguments were given when not allowed
	if (debugMode) {
		if (!parseDetails.multipleArguments && args.length > 1) {
			const joinedArgs = args.map(arg => arg.value).join(", ");
			emitError(
				`\nThe ${parseDetails.attributeName} attribute only accepts a single argument, but multiple arguments were given: [${joinedArgs}]`
			);
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
	let subArgsValues = arg.value.split(parseDetails.subArgumentDeliminator)

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
			emitError(
				`\nThe ${parseDetails.attributeName} attribute expects ${subArgCount} sub-arguments, but ${subArgsValues.length - 1} were given: [${subArgsValues.join(", ")}]`
			);
		}
	}

	const subArgs = subArgsValues.map((subArg, i) => {
		return {
			index: i,
			value: subArg,
			templateMatches: null,
			details: parseDetails.subArgumentDetails[i]
		}
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
			}
		});

		//DEBUG -- check if any of the matches are empty
		if (debugMode) {
			matches.forEach(match => {
				if (match.contents === "") {
					emitError(
						`\nThe ${subArg.details.name} sub-argument of the ${subArg.details.attributeName} attribute contains an empty template: ${match.value}`
					);
				}
			});
		}
	}

	return matches;
}

function substituteSubArgWithQueryStringVariables(subArg, parseDetails) {
	const subArgValue = subArg.value;

	if (debugMode) {
		const queryStringVariables = Strapify.getQueryStringVariables();

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
			emitError(
				`\nError for sub argument: ${subArgValue}.\nUndefined query string variables: ${missingQueryStringVariables.join(", ")}`
			);
		}
	}

	//replace all query string variables with their values
	const populatedSubArgValue = Strapify.substituteQueryStringVariables(subArgValue);
	subArg.value = populatedSubArgValue;
}

function parseAttribute(
	attributeValue, 							//value of the html attribute to parse
	parseDetails = { 							//grouped for convenience
		attributeName: "strapi-attribute", 			//name of the attribute to parse
		htmlElement: undefined, 							//html element the attribute containing the attribute
		subArgumentDeliminator: ",", 				//deliminator to split subarguments by
		multipleArguments: false, 					//whether or not multiple arguments are allowed
		subArgumentDetails: [ 						//array of sub argument details
			{
				name: "sub-argument", 					//human readable name for error messages
				type: SUB_ARG_TYPE.COLLECTION, 			//type of sub argument, see enum above
				substituteQueryStringVariables: true, 	//whether or not to substitute query string variables
			}
		]
	}
) {
	//set the default parseDetails
	parseDetails.attributeName == null && (parseDetails.attributeName = "missing-attribute-name");
	parseDetails.subArgumentDetails == null && (parseDetails.subArgumentDetails = []);
	parseDetails.subArgumentDeliminator == null && (parseDetails.subArgumentDeliminator = ",");
	parseDetails.multipleArguments == null && (parseDetails.multipleArguments = false);

	//DEBUG -- check if the attribute value is empty when it shouldn't be
	if (debugMode) {
		if (attributeValue.trim() === "") {
			emitError(
				`\nThe ${parseDetails.attributeName} attribute was given an empty value.`
			);
		}
	}

	//split the attribute value into multiple arguments if necessary
	let args = splitArguments(attributeValue, parseDetails);

	//parse out the subarguments of each argument
	args.forEach(arg => {
		//split argument into subarguments
		const subArgs = splitSubArguments(arg, parseDetails)

		//substitute query string variables
		for (let subArg of subArgs) {
			if (subArg.details.substituteQueryStringVariables && subArg.details.type !== SUB_ARG_TYPE.STRING) {
				substituteSubArgWithQueryStringVariables(subArg, parseDetails)
			}
		}

		//parse out the matches from templatable sub arguments
		for (let subArg of subArgs) {
			if (
				subArg.details.type === SUB_ARG_TYPE.SINGLE_TYPE_TEMPLATE || subArg.details.type === SUB_ARG_TYPE.COLLECTION_TEMPLATE
			) {
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

	return args
}

export default {
	SUB_ARG_TYPE,
	parseAttribute
}