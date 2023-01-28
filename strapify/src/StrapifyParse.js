import Strapify from "./Strapify";

const debugMode = true;
const debugStrict = true;

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

function splitMultipleArgument(arg, parseDetails, debugDetails) {
	//split the attribute value into multiple arguments if necessary
	let args = [];
	args = arg.split("|");
	args = args.map(arg => { return { value: arg.trim() } });

	//DEBUG -- check if multiple arguments were given when not allowed
	if (debugMode) {
		if (!parseDetails.multipleArguments && args.length > 1) {
			const joinedArgs = args.map(arg => arg.value).join(", ");
			emitError(
				`\nThe ${debugDetails.attributeName} attribute only accepts a single argument, but multiple arguments were given: [${joinedArgs}]`
			);
		}
	}

	return args;
}

function populateSubArguments(args, parseDetails, debugDetails) {
	for (let i = 0; i < args.length; i++) {
		let arg = args[i];
		let argValue = arg.value;

		let subArgs = {};

		//split the argument into sub arguments
		if (parseDetails.subArgumentNames.length > 0) {
			let subArgValues = argValue.split(parseDetails.subArgumentDeliminator);

			//DEBUG -- check if the number of sub arguments is correct
			if (debugMode) {
				if (subArgValues.length !== parseDetails.subArgumentNames.length) {
					const joinedSubArgNames = parseDetails.subArgumentNames.join(parseDetails.subArgumentDeliminator);
					emitError(
						`\nError for argument: ${arg.value}.\nRecieved only ${subArgValues.length} sub arguments but the ${debugDetails.attributeName} attribute expects an argument of the form: ${joinedSubArgNames}`
					);
				}
			}

			for (let j = 0; j < subArgValues.length; j++) {
				let subArgValue = subArgValues[j].trim();
				subArgs[parseDetails.subArgumentNames[j]] = subArgValue;
			}
		} else {
			subArgs[parseDetails.subArgumentNames[0]] = argValue;
		}

		arg.subArgs = subArgs;
	}

	return args;
}

function substituteQueryStringVariables(subArg, parseDetails, debugDetails) {
	if (debugMode) {
		const queryStringVariables = Strapify.getQueryStringVariables();

		const matches = subArg.match(/qs\.([\w\-2]+)/gm);

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
				`\nError for sub argument: ${subArg}.\nUndefined query string variables: ${missingQueryStringVariables.join(", ")}`
			);
		}
	}

	return Strapify.substituteQueryStringVariables(subArg);
}

function parseAttribute(
	attributeValue,
	parseDetails = {
		multipleArguments: false,
		subArgumentNames: [],
		subArgumentDeliminator: ",",
		substituteQueryStringVariables: true
	},
	debugDetails = {
		attributeName: "strapi-attribute",
	}
) {
	//set the default parseDetails
	parseDetails.multipleArguments == null && (parseDetails.multipleArguments = false);
	parseDetails.subArgumentNames == null && (parseDetails.subArgumentNames = []);
	parseDetails.subArgumentDeliminator == null && (parseDetails.subArgumentDeliminator = ",");
	parseDetails.substituteQueryStringVariables == null && (parseDetails.substituteQueryStringVariables = true);

	//set the default debugDetails
	debugDetails.attributeName == null && (debugDetails.attributeName = "strapi-attribute");

	//DEBUG -- check if the attribute value is empty when it shouldn't be
	if (debugMode) {
		if (attributeValue === "") {
			emitError(
				`\nThe ${debugDetails.attributeName} attribute was given an empty value.`
			);
		}
	}

	//parse out the arguments and sub arguments
	let args = splitMultipleArgument(attributeValue, parseDetails, debugDetails);
	args = populateSubArguments(args, parseDetails, debugDetails);

	//substitute query string variables
	if (parseDetails.substituteQueryStringVariables) {
		for (let i = 0; i < args.length; i++) {
			let arg = args[i];

			for (let subArgName in arg.subArgs) {
				let subArg = arg.subArgs[subArgName];
				subArg = substituteQueryStringVariables(subArg, parseDetails, debugDetails);
				arg.subArgs[subArgName] = subArg;
			}
		}
	}

	return args;
}

export default {
	parseAttribute
}