import Strapify from "./Strapify.js";
import StrapifyTemplate from "./StrapifyTemplate"
import strapiRequest from "./util/strapiRequest";

class StrapifyControl {
	//the control element that this object manages
	#controlElement;
	//the collection element that the control element controls
	#collectionElement
	//the StrapifyCollection object that manages the collection element
	#strapifyCollection

	//radio buttons elements and checkboxes which are children of the control element
	#radioButtons
	#checkboxes

	//either "strapi-page", "strapi-filter", or "strapi-sort"
	#controlType;

	//the strapify data attributes of the control element
	#attributes = {
		"strapi-page-control": undefined,
		"strapi-filter-control": undefined,
		"strapi-sort-control": undefined,
		"strapi-control-preserve-initial": undefined,
	}

	constructor(controlElement, collectionElement, strapifyCollection) {
		this.#controlElement = controlElement;
		this.#collectionElement = collectionElement;
		this.#strapifyCollection = strapifyCollection;
		this.#updateAttributes();

		//determine the type of control
		if (this.#controlElement.hasAttribute("strapi-page-control")) {
			this.#controlType = "strapi-page";
		} else if (this.#controlElement.hasAttribute("strapi-filter-control")) {
			this.#controlType = "strapi-filter";
		} else if (this.#controlElement.hasAttribute("strapi-sort-control")) {
			this.#controlType = "strapi-sort";
		}

		//add event listeners to trigger the correct action when the control element is interacted with
		//for button or a elements
		if (this.#controlElement.tagName === "BUTTON" || this.#controlElement.tagName === "A") {
			this.#controlElement.addEventListener("click", this.#onButtonEvent.bind(this));
		}
		//for select elements
		else if (this.#controlElement.tagName === "SELECT") {
			this.#controlElement.addEventListener("change", this.#onSelectEvent.bind(this));
		}
		//for radio or checkbox elements
		else {
			//look for radio buttons
			this.#radioButtons = Array.from(this.#controlElement.querySelectorAll("input[type='radio']"));

			//look for checkboxes
			this.#checkboxes = Array.from(this.#controlElement.querySelectorAll("input[type='checkbox']"));

			//if there are radio buttons
			if (this.#radioButtons.length > 0) {
				this.#radioButtons.forEach((radio) => {
					radio.addEventListener("change", this.#onRadioEvent.bind(this));
				});
			}

			//if there are checkboxes
			if (this.#checkboxes.length > 0) {
				this.#checkboxes.forEach((checkbox) => {
					checkbox.addEventListener("change", this.#onCheckboxEvent.bind(this));
				});
			}
		}

		// if the control type is strapi-filter or strapi-sort, we need to reset the page to 1 when the control is interacted with
		if (this.#controlType === "strapi-filter" || this.#controlType === "strapi-sort") {
			this.#controlElement.addEventListener("click", () => {
				this.#strapifyCollection.setPage(1);
			})
			this.#controlElement.addEventListener("change", () => {
				this.#strapifyCollection.setPage(1);
			})
		}
	}

	destroy() {
	}

	#updateAttributes() {
		Object.keys(this.#attributes).forEach((attribute) => {
			this.#attributes[attribute] = this.#controlElement.getAttribute(attribute);
		})
	}

	#updateCollectionAttribute(attributeValue) {
		let attribName = this.#controlType;
		if (this.#controlElement.hasAttribute("strapi-control-preserve-initial")) {
			attribName += "-internal-control"
		}
		this.#collectionElement.setAttribute(attribName, attributeValue);
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
		const optionElm = e.target.options[e.target.selectedIndex];

		if (this.#controlType === "strapi-page") {
			let page = e.target.value;
			if (optionElm.hasAttribute("strapi-control-value")) {
				page = optionElm.getAttribute("strapi-control-value")
			}
			this.#strapifyCollection.setPage(parseInt(page));
		}
		else if (this.#controlType === "strapi-filter") {
			let filter = e.target.value
			if (optionElm.hasAttribute("strapi-control-value")) {
				filter = optionElm.getAttribute("strapi-control-value")
			}
			this.#updateCollectionAttribute(filter)
		}
		else if (this.#controlType === "strapi-sort") {
			let sort = e.target.value
			if (optionElm.hasAttribute("strapi-control-value")) {
				sort = optionElm.getAttribute("strapi-control-value")
			}
			this.#updateCollectionAttribute(sort)
		}
	}

	#onRadioEvent(e) {
		if (this.#controlType === "strapi-page") {
			let page = e.target.value;
			if (e.target.hasAttribute("strapi-control-value")) {
				page = e.target.getAttribute("strapi-control-value")
			}
			this.#strapifyCollection.setPage(parseInt(page));
		}
		else if (this.#controlType === "strapi-filter") {
			let filter = e.target.value
			if (e.target.hasAttribute("strapi-control-value")) {
				filter = e.target.getAttribute("strapi-control-value")
			}
			this.#updateCollectionAttribute(filter)
		}
		else if (this.#controlType === "strapi-sort") {
			let sort = e.target.value
			if (e.target.hasAttribute("strapi-control-value")) {
				sort = e.target.getAttribute("strapi-control-value")
			}
			this.#updateCollectionAttribute(sort)
		}
	}

	#onCheckboxEvent(e) {
		if (this.#controlType === "strapi-page") {
			if (Strapify.debugMode) console.error("strapi-page-control cannot be used with checkboxes");
		}
		else if (this.#controlType === "strapi-filter") {
			const filters = []
			this.#checkboxes.forEach((checkbox) => {
				if (checkbox.checked) {
					filters.push(checkbox.getAttribute("strapi-control-value"))
				}
			})
			this.#updateCollectionAttribute(filters.join(" | "))
		}
		else if (this.#controlType === "strapi-sort") {
			const sorts = []
			this.#checkboxes.forEach((checkbox) => {
				if (checkbox.checked) {
					sorts.push(checkbox.getAttribute("strapi-control-value"))
				}
			})
			this.#updateCollectionAttribute(sorts.join(" | "))
		}
	}
}

export default StrapifyControl;