const fs = require('fs');
const path = require('path');

const htmlTemplatePath = path.join(__dirname, 'html-templates');
const htmlTemplates = {};

//read in all the files in ./html-templates
const files = fs.readdirSync(htmlTemplatePath);

//for each file, read it in and add it to the htmlTemplates object
files.forEach((file) => {
	const filePath = path.join(htmlTemplatePath, file);
	const fileContents = fs.readFileSync(filePath, 'utf8');
	htmlTemplates[file.replace(".html", "")] = fileContents;
});

function composeTemplates(templateNames, development = true) {
	//choose the base template
	const base = development ? htmlTemplates["base-development"] : htmlTemplates["base"];

	//content is inserted into the base template before the occurance of this string
	const insertBeforeString = "<!-- insert here -->";

	//insert the content into the base template
	const insertionString = templateNames.reduce((acc, templateName) => {
		acc += htmlTemplates[templateName];
		acc += "\n"
		return acc;
	}, "");

	//insert the insertionString into the base template and return the result
	return base.replace(insertBeforeString, insertionString);
}

export default htmlTemplates
