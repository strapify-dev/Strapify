require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const htmlParser = require("node-html-parser");
const port = process.env.PORT || 3000;
const fs = require("fs");

/*-------------------------------------------------------- express setup --------------------------------------------------------*/
const app = express();

app.use(express.static(path.join(__dirname, "output")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.disable("x-powered-by");

/*-------------------------------------------------------- helper functions -----------------------------------------------------*/
async function extractScriptData(scriptElement, name) {
	//first check if the script uses a src attribute
	if (scriptElement.attributes.src) {
		const srcValue = scriptElement.attributes.src;

		//fetch the script and get the text data
		const scriptFetchResponse = await fetch(srcValue);
		const scriptContentString = await scriptFetchResponse.text();

		return {
			element: scriptElement,
			name: name,
			text: scriptContentString,
		};
	}

	//otherwise just return the script's text content
	return {
		element: scriptElement,
		name: name,
		text: scriptElement.text,
	};
}

async function extractStyleSheetData(linkElement, name) {
	//first check if the link uses a href attribute
	if (linkElement.attributes.href) {
		const hrefValue = linkElement.attributes.href;

		//fetch the stylesheet and get the text data
		const styleFetchResponse = await fetch(hrefValue);
		const styleContentString = await styleFetchResponse.text();

		return {
			element: linkElement,
			name: name,
			text: styleContentString,
		};
	}

	//otherwise just return the link's text content
	return {
		element: linkElement,
		name: name,
		text: linkElement.text,
	};
}

async function extractSiteData(url) {
	const siteResponse = await fetch(url);
	const siteText = await siteResponse.text();

	//parse the html
	const parsedDataRoot = htmlParser.parse(siteText, {
		//voidTag: { tags: [] },
		blockTextElements: {
			script: true, // keep text content when parsing
			noscript: true, // keep text content when parsing
			style: true, // keep text content when parsing
			pre: true, // keep text content when parsing
		},
	});

	//get the primary elements
	const htmlElement = parsedDataRoot.querySelector("html");
	const headElement = parsedDataRoot.querySelector("head");
	const bodyElement = parsedDataRoot.querySelector("body");

	//get the script elements
	const headScriptElements = headElement.querySelectorAll("script");
	const bodyScriptElements = bodyElement.querySelectorAll("script");

	//get the style link elements
	const headStyleLinkElements = headElement.querySelectorAll(
		'link[rel="stylesheet"]'
	);
	const bodyStyleLinkElements = bodyElement.querySelectorAll(
		'link[rel="stylesheet"]'
	);

	//extract the script data from the head
	const headScriptsData = [];
	for (let i = 0; i < headScriptElements.length; i++) {
		const scriptData = await extractScriptData(
			headScriptElements[i],
			`head-script${i}`
		);
		headScriptsData.push(scriptData);
	}

	//extract the script data from the body
	const bodyScriptsData = [];
	for (let i = 0; i < bodyScriptElements.length; i++) {
		const scriptData = await extractScriptData(
			bodyScriptElements[i],
			`body-script${i}`
		);
		bodyScriptsData.push(scriptData);
	}

	//extract the style data from the head
	const headStylesData = [];
	for (let i = 0; i < headStyleLinkElements.length; i++) {
		const styleData = await extractStyleSheetData(
			headStyleLinkElements[i],
			`head-style${i}`
		);
		headStylesData.push(styleData);
	}

	//extract the style data from the body
	const bodyStylesData = [];
	for (let i = 0; i < bodyStyleLinkElements.length; i++) {
		const styleData = await extractStyleSheetData(
			bodyStyleLinkElements[i],
			`body-style${i}`
		);
		bodyStylesData.push(styleData);
	}

	//return the extracted data
	return {
		parsedDataRoot: parsedDataRoot,
		htmlElement: htmlElement,
		headElement: headElement,
		bodyElement: bodyElement,
		headScriptsData: headScriptsData,
		bodyScriptsData: bodyScriptsData,
		headStylesData: headStylesData,
		bodyStylesData: bodyStylesData,
	};
}

function convertSiteDataToFileReadyContent(siteData) {
	//remove the style elements from the head and create a new link tag for each style
	for (let i = 0; i < siteData.headStylesData.length; i++) {
		const parentNode = siteData.headStylesData[i].element.parentNode;
		parentNode.insertAdjacentHTML(
			"beforeend",
			`<link rel="stylesheet" href=./${siteData.headStylesData[i].name}.css>`
		);
		siteData.headStylesData[i].element.remove();
	}

	//remove the style elements from the body and create a new link tag for each style
	for (let i = 0; i < siteData.bodyStylesData.length; i++) {
		const parentNode = siteData.bodyStylesData[i].element.parentNode;
		parentNode.insertAdjacentHTML(
			"beforeend",
			`<link rel="stylesheet" href=./${siteData.bodyStylesData[i].name}.css>`
		);
		siteData.bodyStylesData[i].element.remove();
	}

	//remove the script elements from the head and create a new script tag for each script
	for (let i = 0; i < siteData.headScriptsData.length; i++) {
		const parentNode = siteData.headScriptsData[i].element.parentNode;
		parentNode.insertAdjacentHTML(
			"beforeend",
			`<script src=./${siteData.headScriptsData[i].name}.js>${"" /*siteData.headScriptsData[i].text*/
			}</script>`
		);
		siteData.headScriptsData[i].element.remove();
	}

	//remove the script elements from the body create a new script tag for each script
	for (let i = 0; i < siteData.bodyScriptsData.length; i++) {
		const parentNode = siteData.bodyScriptsData[i].element.parentNode;
		parentNode.insertAdjacentHTML(
			"beforeend",
			`<script src=./${siteData.bodyScriptsData[i].name}.js>${"" /*siteData.bodyScriptsData[i].text*/
			}</script>`
		);
		siteData.bodyScriptsData[i].element.remove();
	}

	//add script
	siteData.headElement.insertAdjacentHTML(
		"beforeend",
		`<script src=./main.js defer>${""}</script>`
	);

	//return the converted data
	return {
		html: {
			name: "html",
			content: siteData.parsedDataRoot.toString(),
		},
		headScripts: siteData.headScriptsData.map((scriptData) => {
			return { name: scriptData.name, content: scriptData.text };
		}),
		bodyScripts: siteData.bodyScriptsData.map((scriptData) => {
			return { name: scriptData.name, content: scriptData.text };
		}),
		headStyles: siteData.headStylesData.map((styleData) => {
			return { name: styleData.name, content: styleData.text };
		}),
		bodyStyles: siteData.bodyStylesData.map((styleData) => {
			return { name: styleData.name, content: styleData.text };
		}),
	};
}

function writeFileReadyContent(fileReadyContent, folderPath) {
	//create the folder if it doesn't exist
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
	}

	//delete everything in the folder
	fs.readdirSync(folderPath).forEach((file) => {
		if (file !== "main.js" && file !== ".gitkeep") {
			fs.unlinkSync(path.join(folderPath, file));
		}
	});

	//write the html file
	fs.writeFileSync(
		path.join(folderPath, "index.html"),
		fileReadyContent.html.content
	);

	//write the head scripts
	for (let i = 0; i < fileReadyContent.headScripts.length; i++) {
		fs.writeFileSync(
			path.join(folderPath, `${fileReadyContent.headScripts[i].name}.js`),
			fileReadyContent.headScripts[i].content
		);
	}

	//write the body scripts
	for (let i = 0; i < fileReadyContent.bodyScripts.length; i++) {
		fs.writeFileSync(
			path.join(folderPath, `${fileReadyContent.bodyScripts[i].name}.js`),
			fileReadyContent.bodyScripts[i].content
		);
	}

	//write the head styles
	for (let i = 0; i < fileReadyContent.headStyles.length; i++) {
		fs.writeFileSync(
			path.join(folderPath, `${fileReadyContent.headStyles[i].name}.css`),
			fileReadyContent.headStyles[i].content
		);
	}

	//write the body styles
	for (let i = 0; i < fileReadyContent.bodyStyles.length; i++) {
		fs.writeFileSync(
			path.join(folderPath, `${fileReadyContent.bodyStyles[i].name}.css`),
			fileReadyContent.bodyStyles[i].content
		);
	}
}

/*-------------------------------------------------------- express routes --------------------------------------------------------*/
app.post("/api/test", async (req, res) => {
	//need to update this to check url validity
	const siteData = await extractSiteData(req.body.webflowURL);
	const fileReadyContent = convertSiteDataToFileReadyContent(siteData);

	writeFileReadyContent(fileReadyContent, "output");

	res.status(200).send("post works: " + JSON.stringify(req.body));
});

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "/output/index.html"));
});

app.listen(port, () => {
	console.log(`Express app listening on port ${port}`);
});
