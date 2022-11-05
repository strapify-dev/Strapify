import strapiRequest from "./util/strapiRequest";

const collectionEls = document.body.querySelectorAll("[strapi-collection]");

// Loop through all elements with the strapi-collection attribute
collectionEls.forEach(async (el) => {
  // Get the collection name from the attribute
  const collectionName = el.getAttribute("strapi-collection");
  const strapiData = await strapiRequest(collectionName);
  console.log(strapiData);
  //NOTE - if childNodes[0] is not our template element, it will cause a bug
  const templateEl = el.children[0].cloneNode(true);
  el.children[0].remove();
  // for loop that iterates through the mock data
    for (let i = 0; i < strapiData.length; i++) {
        const { id, attributes } = strapiData[i];
        const clone = templateEl.cloneNode(true);
        el.appendChild(clone);
        const fieldEls = clone.querySelectorAll("[field-id]");
        // Loop through all the field elements
        fieldEls.forEach((fieldEl) => {
            // Get the field id from the attribute
            const fieldId = fieldEl.getAttribute("field-id");
            // Get the field value from the mock data
            const fieldValue = attributes[fieldId];
            // Set the field value
            fieldEl.innerHTML = fieldValue;
        });
    }
});
