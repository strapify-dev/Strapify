import Strapify from "./Strapify";

function requiresTemplating(arg) {
	return arg.includes("{{") && arg.includes("}}");
}

function parseFieldPath(identifer, isSingleType) {
	let result = {
		singleTypeName: null,
		fieldPath: null,
	}

	//first substitute the query string variables
	//identifer = Strapify.substituteQueryStringVariables(identifer);

	//if the identifier is a single type, then we need to split it into the single type name and field path string
	let singleTypeName = null;
	let fieldPathString = identifer;

	//extract the single type name if it is a single type
	if (isSingleType) {
		const split = identifer.split(".");
		singleTypeName = split[0];
		fieldPathString = split.slice(1).join(".");
	}

	//parse the field path string
	let fieldPathNodes = fieldPathString.split(".");
	const fieldPath = [];
	for (let i = 0; i < fieldPathNodes.length; i++) {
		fieldPath.push({
			name: fieldPathNodes[i],
			leaf: i === fieldPathNodes.length - 1
		});
	}

	//return the result
	result.singleTypeName = singleTypeName;
	result.fieldPath = fieldPath;
	return result;
}

function parseArgument(
	argument,
	parseDetails = {
		multipleArguments: false,
		subArguments: false,
		subArgumentDelimiter: ""
	}
) {
	//split argument string into multiple arguments if necessary
	let args = []
	parseDetails.multipleArguments ? args = argument.split("|") : args.push(argument)
	args = args.map(arg => arg.trim())

	//map arguemnts to return object
	return args.map(arg => {
		//split argument into sub arguments if necessary
		let split = [arg]
		if (parseDetails.subArguments) {
			split = arg.split(parseDetails.subArgumentDelimiter)
		}

		return {
			argument: arg,
			subArguments: split.map(subArg => {
				return {
					argument: subArg.trim(),
					requiresTemplating: requiresTemplating(subArg)
				}
			})
		}
	})
}

function applyQueryStringVariables(parseDatas) {
	//prevent mutation of the original parse data
	let newParseDatas = parseDatas.map(parseData => JSON.parse(JSON.stringify(parseData)))

	newParseDatas.forEach(parseData => {
		//prevent mutation of the original parse data
		parseData = JSON.parse(JSON.stringify(parseData));

		//apply query string variables to the argument
		parseData.argument = Strapify.substituteQueryStringVariables(parseData.argument);

		//apply query string variables to the sub arguments
		parseData.subArguments = parseData.subArguments.map(subArg => {
			subArg.argument = Strapify.substituteQueryStringVariables(subArg.argument);
			return subArg;
		})
	});

	return newParseDatas;
}

export default {
	parseFieldPath,
	parseArgument,
	applyQueryStringVariables
}