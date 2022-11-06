import strapiRequest from "./util/strapiRequest";

//find all the elements with the strapi-collection attribute
const collectionElms = document.body.querySelectorAll("[strapi-collection]");

//for each collection element 
collectionElms.forEach(async (collectionElm) => {
	//clone the template item elm and remove it from the dom
	const itemTemplateElm = collectionElm.children[0].cloneNode(true)
	collectionElm.children[0].remove()

	//get the collection item data from strapi
	const collectionData = await strapiRequest(collectionElm.getAttribute("strapi-collection"))

	//loop through the collection data and add it to a new clone of the template item elm
	for (let i = 0; i < collectionData.length; i++) {
		const { id, attributes } = collectionData[i];
		const itemElm = itemTemplateElm.cloneNode(true);

		//find all the field elements in the item elm
		const fieldElms = itemElm.querySelectorAll("[field-id]");

		//loop through the field elements and set the inner html to the field value from the collection data
		fieldElms.forEach((fieldElm) => {
			const fieldId = fieldElm.getAttribute("field-id");
			const fieldValue = attributes[fieldId];
			fieldElm.innerHTML = fieldValue;
		});

		//add the item elm to the collection elm
		collectionElm.appendChild(itemElm);
	}
})


