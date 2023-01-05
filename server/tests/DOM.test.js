import { fail } from 'assert'
import htmlTemplates from './html-templates'
const fs = require('fs')
const path = require('path')

function writeFile(filePath, contents) {
	//delete the file if it already exists
	if (fs.existsSync(filePath)) {
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error(err)
			}
		})
	}

	//create the file
	fs.writeFile(filePath, contents, (err) => {
		if (err) {
			console.error(err)
		}
	})
}

describe("DOM tests", () => {
	Object.keys(htmlTemplates).forEach((htmlTemplateName) => {
		//test each of the test definitions
		test(htmlTemplateName, async () => {
			//gernerate the DOM string
			const domString = htmlTemplates[htmlTemplateName]

			const filePath = path.join(__dirname, `./html-templates/${htmlTemplateName}.html`)
			const unvalidatedFilePath = path.join(__dirname, `./html-tests-unvalidated/${htmlTemplateName}.html`)
			const validatedFilePath = path.join(__dirname, `./html-tests-validated/${htmlTemplateName}.html`)

			//use this to block until strapify is finished
			const strapifyInitializedPromise = new Promise(async (resolve, reject) => {
				await page.exposeFunction("onStrapifyInitialized", (event) => {
					resolve()
				})
			})

			//add a listener for strapifyInitialized
			await page.evaluateOnNewDocument(() => {
				document.addEventListener("strapifyInitialized", () => {
					window.onStrapifyInitialized("working")
				})
			})

			//navigate to the template file
			await page.goto(filePath)

			//wait for strapify to finish
			await strapifyInitializedPromise

			//wait one second for good measure
			await page.waitForTimeout(1000)

			//write the unvalidated file
			const pageContents = await page.content()
			writeFile(unvalidatedFilePath, pageContents)

			//check for the validated file
			if (!fs.existsSync(validatedFilePath)) {
				fail(`No validated file to compare to. Create the validated file with path ${validatedFilePath}`)
			}

			//read the validated file
			const validatedFileContents = fs.readFileSync(validatedFilePath, 'utf8')

			//remove all whitespace including tabs, newlines, and spaces
			const pageContentsNoWhitespace = pageContents.replace(/\s/g, '')
			const validatedFileContentsNoWhitespace = validatedFileContents.replace(/\s/g, '')

			//compare the two files
			expect(pageContentsNoWhitespace).toEqual(validatedFileContentsNoWhitespace)
		})
	})
})