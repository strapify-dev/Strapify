// internal state that keeps track of how many errors have been logged
let errorCount = 0;

// internal function to increment the error count
function incrementErrorCount() {
	errorCount++;
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

function log(...args) {
	console.group(
		"%cSTRAPIFY LOG",
		"background-color: #6d6d6d; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach((arg) => {
		console.log(arg);
	});
	console.groupEnd();
}

function warn(...args) {
	console.group(
		"%cSTRAPIFY WARNING",
		"background-color: #9b9023; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach((arg) => {
		console.warn(arg);
	});
	console.groupEnd();
}

function error(...args) {
	incrementErrorCount();
	console.group(
		"%cSTRAPIFY ERROR",
		"background-color: #aa3d3d; color: #ffffff; font-weight: bold; padding: 4px;"
	);
	args.forEach((arg) => {
		if (errorCount > 0) {
			toast(
				`${errorCount} Strapify error${
					errorCount > 1 ? "s" : ""
				} logged.  See console for details.`
			);
		}
		console.error(arg);
	});
	console.groupEnd();
}

function checkForTemplateElement(templateElms, containerElement) {
	console.log(templateElms, containerElement);
	if (templateElms.length === 0) {
		if (containerElement.getAttribute("strapi-collection")) {
			error(
				`No template element found for collection "${containerElement.getAttribute(
					"strapi-collection"
				)}"`
			);
		}
	}
}

function checkIfText(strapiData, elm) {
	if (typeof strapiData === "object") {
		warn(
			`The field "${elm.getAttribute(
				"strapi-field"
			)}" is set on a text element (p, span, h) but does not contain text.  If you are trying to set an image or video field, set it on an img or div element instead.`
		);
	}
}

function checkIfSingleMedia(strapiData, elm) {
	if (typeof strapiData !== "object") {
		error(
			`The field "${elm.getAttribute("strapi-field")}" in the "${elm
				.closest("[strapi-collection]")
				.getAttribute(
					"strapi-collection"
				)}" collection is not a media field, but is set on an <img /> element.`
		);
	}
}

function isMultipleMedia(strapiData, elm) {
	if (Array.isArray(strapiData.data)) {
		warn(
			`The field "${elm.getAttribute("strapi-field")}" in the "${elm
				.closest("[strapi-collection]")
				.getAttribute(
					"strapi-collection"
				)}" collection is a multiple media field.  strapi-field only works on single media fields.  To display multiple media fields, use strapi-repeatable with a strapi-template and strapi-field inside`
		);
		return true;
	} else {
		return false;
	}
}

function checkIfUndefinedStrapiDataValue(
	strapiDataValue,
	fieldPath,
	fieldElement
) {
	if (strapiDataValue === undefined) {
		error(
			`Error fetching strapi data for field "${fieldPath}" in collection "${fieldElement
				.closest("[strapi-collection]")
				.getAttribute("strapi-collection")}.  Check that the field exists.`
		);
	}
}

function checkIfRichText(strapiData, elm) {
  console.log("checking if rich text");
	// if the strapiData contains a new line character, it is likely rich text.  If it doesn't, it is likely a string.  Throw a warning if it is a string.
	if (
		typeof strapiData === "string" &&
		!/#+/.test(strapiData) &&
		!strapiData.includes("\n") &&
		!strapiData.includes("\r")
	) {
    // if the strapiData is a youtube link, don't throw a warning
    if (strapiData.includes("http")) {
      return;
    }
		warn(
			`The text field "${elm.getAttribute("strapi-field")}" in the "${elm
				?.closest("[strapi-collection]")
				?.getAttribute(
					"strapi-collection"
				)}" collection is set on a div element rather than a p, span, or h.  This may alter the styling of the text.  If "${elm.getAttribute(
				"strapi-field"
			)}" is a rich text field, ignore this warning.`
		);
	}
}

const ErrorHandler = {
	checkForTemplateElement,
	checkIfText,
	checkIfSingleMedia,
	isMultipleMedia,
	checkIfUndefinedStrapiDataValue,
	checkIfRichText,
	log,
	warn,
	error,
	toast,
};

export default ErrorHandler;
