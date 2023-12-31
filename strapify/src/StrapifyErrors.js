// internal state that keeps track of how many errors have been logged
let errorCount = 0;

let thrownLogs = [];

function logIfUnseen(message, logType) {
	// logType can be "warn", or "error"
	if (!thrownLogs.includes(error)) {
		thrownLogs.push(error);
		console.group(
			`%cSTRAPIFY ${logType === "warn" ? "WARNING" : "ERROR"}`,
			`background-color: ${
				logType === "warn" ? "#9b9023" : "#aa3d3d"
			}; color: #ffffff; font-weight: bold; padding: 4px;`
		);
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
		toast(
			`${errorCount} Strapify error${
				errorCount > 1 ? "s" : ""
			} logged.  See console for details.`
		);
	}
	logIfUnseen(message, "error");
}

function checkForTemplateElement(templateElms, containerElement) {
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
	// this is a bit of a hacky way to check if the strapiData is rich text, but it should help the webflow people stop using divs for text (text blocks)
	// if the strapiData contains a new line character or a #, it is likely rich text.  If it doesn't, it is likely a string.  Throw a warning if it is a string.
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
	warn,
	error,
	toast,
};

export default ErrorHandler;
