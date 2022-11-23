import Strapify from "./Strapify";

function filterNestedElements(element, selectedElements, blockingAttributes) {
	const blockingSelector = blockingAttributes.map(attribute => `[${attribute}]`).join(", ");

	return selectedElements.filter(selectedElement => {
		const closestBlockingElement = selectedElement.parentElement.closest(blockingSelector)
		return (
			!selectedElement.parentElement ||
			closestBlockingElement === element ||
			closestBlockingElement === null
		)
	})
}

function findUnnestedCollectionElements(rootElement) {
	const blockingAttributes = ["strapi-collection", "strapi-relation", "strapi-repeatable", "strapi-template"]

	let collectionElms = Array.from(rootElement.querySelectorAll("[strapi-collection]"));
	return filterNestedElements(rootElement, collectionElms, blockingAttributes);
}

/*-------------------------------------------------------- parse functions ------------------------------------------------------*/
//parse the root element for collections and single types
function parse(rootElement) {
	const strapifyParseData = {
		strapifyCollectionDatas: [],
		strapifySingleTypeDatas: []
	}

	//find the collection elements
	let collectionElms = Array.from(rootElement.querySelectorAll("[strapi-collection]"));
	collectionElms = findUnnestedCollectionElements(rootElement);

	//get single type elements
	let singleTypeElms = Array.from(rootElement.querySelectorAll(
		Strapify.validStrapifySingleTypeAttributes.map(attribute => `[${attribute}]`).join(", "))
	);

	//parse the collections
	collectionElms.forEach(collectionElm => {
		const strapifyCollectionParseData = parseCollection(collectionElm);
		strapifyParseData.strapifyCollectionDatas.push(strapifyCollectionParseData);
	})

	return strapifyParseData;
}

function parseStrapifyCollection(rootElement) {
	const strapifyCollectionParseData = {
		strapifyCollectionParseDatas: [],
		strapifyTemplateParseDatas: [],
		strapifyControlParseData: null
	}

	//find the collection elements
	let collectionElms = Array.from(rootElement.querySelectorAll("[strapi-collection]"));
	collectionElms = findUnnestedCollectionElements(rootElement);

	return strapifyCollectionParseData;
}

export default { parse }