import Strapify from "./Strapify.js";
import StrapifyTemplate from "./StrapifyTemplate"
import strapiRequest from "./util/strapiRequest";

class StrapifyControl {
	#controlElement;
	#collectionElement
	#strapifyCollection
	#mutationObserver;

	#controlType;

	#attributes = {
		"strapi-page-control": undefined,
		"strapi-filter-control": undefined,
		"strapi-sort-control": undefined,
	}

	constructor(controlElement, collectionElement, strapifyCollection) {
		this.#controlElement = controlElement;
		this.#collectionElement = collectionElement;
		this.#strapifyCollection = strapifyCollection;
		this.#updateAttributes();

		this.#mutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				// if (mutation.type === "attributes") {
				// 	this.#updateAttributes();
				// 	this.process();
				// }
			});
		});

		this.#mutationObserver.observe(this.#controlElement, {
			attributes: true,
			attributeFilter: Strapify.validStrapifyControllAttributes
		});

		if (this.#controlElement.hasAttribute("strapi-page-control")) {
			this.#controlType = "strapi-page";
		} else if (this.#controlElement.hasAttribute("strapi-filter-control")) {
			this.#controlType = "strapi-filter";
		} else if (this.#controlElement.hasAttribute("strapi-sort-control")) {
			this.#controlType = "strapi-sort";
		}

		if (this.#controlElement.tagName === "BUTTON" || this.#controlElement.tagName === "A") {
			this.#controlElement.addEventListener("click", this.#onButtonEvent.bind(this));
		}
		else if (this.#controlElement.tagName === "SELECT") {
			this.#controlElement.addEventListener("change", this.#onSelectEvent.bind(this));
		}
	}

	destroy() {
		this.#mutationObserver.disconnect();
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#controlElement.getAttribute(attribute);
		})
	}

	#updateCollectionAttribute(attributeValue) {
		this.#collectionElement.setAttribute(this.#controlType + "-internal-control", attributeValue);
	}

	#onButtonEvent(e) {
		if (this.#controlType === "strapi-page") {
			const pageArg = this.#attributes["strapi-page-control"];

			if (!pageArg.includes("+") && !pageArg.includes("-")) {
				this.#strapifyCollection.setPage(parseInt(pageArg));
				return;
			}

			const reg = /([\+-])(\d+)/;
			const match = reg.exec(pageArg);

			const operator = match[1].trim();
			const pageDiff = parseInt(match[2].trim());
			const curPage = this.#strapifyCollection.getPage();

			let newPage = curPage;
			if (operator === "+") {
				newPage += pageDiff;
			}
			else if (operator === "-") {
				newPage -= pageDiff;
			}

			this.#strapifyCollection.setPage(newPage);
		}
		else if (this.#controlType === "strapi-filter") {
			const filter = this.#attributes["strapi-filter-control"];

			this.#updateCollectionAttribute(filter)
		}
		else if (this.#controlType === "strapi-sort") {
			const sort = this.#attributes["strapi-sort-control"];

			this.#updateCollectionAttribute(sort)
		}
	}

	#onSelectEvent(e) {
		if (this.#controlType === "strapi-page") {
			this.#strapifyCollection.setPage(parseInt(e.target.value));
		}
		else if (this.#controlType === "strapi-filter") {
			const filter = e.target.value
			this.#updateCollectionAttribute(filter)
		}
		else if (this.#controlType === "strapi-sort") {
			const sort = e.target.value
			this.#updateCollectionAttribute(sort)
		}
	}

	#onRadioEvent(e) {

	}

	#onCheckboxEvent(e) {

	}
}

export default StrapifyControl;