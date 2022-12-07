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

export default htmlTemplates;
