require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const htmlParser = require("node-html-parser");
const port = process.env.PORT || 3000;
const fs = require("fs");
const archiver = require('archiver');

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

function archiveFolder(folderPath, archivePath, archiveName) {
	//create the archive folder if it doesn't exist
	if (!fs.existsSync(archivePath)) {
		fs.mkdirSync(archivePath);
	}

	//delete everything in the archive folder
	fs.readdirSync(archivePath).forEach((file) => {
		fs.unlinkSync(path.join(archivePath, file));
	});

	//create the archive
	const archive = archiver("zip", {
		zlib: { level: 9 }, // Sets the compression level.
	});

	//create a write stream
	const output = fs.createWriteStream(path.join(archivePath, `${archiveName}.zip`));

	//pipe the archive to the output
	archive.pipe(output);

	//append the folder to the archive
	archive.directory(folderPath, false);

	//finalize the archive
	archive.finalize();
}

/*-------------------------------------------------------- express routes --------------------------------------------------------*/
app.post("/api/test", async (req, res) => {
	//check url validity
	const urlExist = (await import("url-exist")).default;
	const validURL = await urlExist(req.body.webflowURL);

	//if the url is invalid return an error
	if (!validURL) {
		res.status(400).send("invalid webflow url given.");
		return;
	}

	//collect the webflow site data and convert it to a file ready content
	let siteData
	let fileReadyContent

	//try to collect the webflow site data
	try {
		siteData = await extractSiteData(req.body.webflowURL);
	} catch (error) {
		console.log(error)
		res.status(500).send("error extracting site data");
		return;
	}

	//try to convert the webflow site data to a file ready content
	try {
		fileReadyContent = convertSiteDataToFileReadyContent(siteData);
	} catch (error) {
		console.log(error)
		res.status(500).send("error converting site data to file ready content");
		return;
	}

	//generate and write site files
	let outputFolder = req.body.webflowURL.replace(/(^\w+:|^)\/\//, "");
	outputFolder = outputFolder.replace(/[^a-z0-9]/gi, "");

	try {
		writeFileReadyContent(fileReadyContent, `output/${outputFolder}`);
	} catch (error) {
		console.log(error);
		res.status(500).send("error writing files on server.");
		return;
	}

	//if bundle/main.js doesn't exist, return an error
	if (!fs.existsSync("bundle/main.js")) {
		res.status(500).send("could not find bundle/main.js. Please bundle injector.js on the server.");
	}

	//copy the main.js file from the bundle folder to the output folder
	try {
		fs.copyFileSync(
			path.join(__dirname, "bundle", "main.js"),
			path.join(`output/${outputFolder}`, "main.js")
		);
	} catch (error) {
		res.status(500).send("failed to copy bundle/main.js to output folder.");
		return;
	}

	//archive the output folder
	try {
		archiveFolder(`output/${outputFolder}`, `output/download`, outputFolder);
	} catch (error) {
		console.log(error);
		res.status(500).send("error archiving generated site files.");
		return;
	}

	//delete the output folder
	try {
		fs.rmdirSync(`output/${outputFolder}`, { recursive: true });
	} catch (error) {
		console.log(error);
		res.status(500).send("error deleting generated site files.");
		return;
	}

	//return success message and the download link
	res.status(200).json({
		message: `successfully generated static website with strapi injection from ${req.body.webflowURL}`,
		downloadURL: `http://localhost:3000/api/download?filename=${outputFolder}.zip`,
	});
});

app.get('/api/download', function (req, res) {
	const fileName = req.query.filename;

	console.log(fileName)

	//if the file doesn't exist, return an error
	if (!fs.existsSync(`output/download/${fileName}`)) {
		res.status(404).send("file not found");
		return;
	}

	const file = `${__dirname}/output/download/${fileName}`;
	res.download(file);
});

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "/output/index.html"));
});

app.listen(port, () => {
	console.log(`Express app listening on port ${port}`);
});
