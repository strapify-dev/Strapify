import { fail } from 'assert'
import { DiffDOM } from "diff-dom"
import htmlTemplates from './html-templates'
import { writeFile, readFile, fileExists } from './util'
const path = require('path')

describe("DOM tests", () => {
	Object.keys(htmlTemplates).forEach((htmlTemplateName) => {
		//test each of the test definitions
		test(htmlTemplateName, async () => {
			console.log(htmlTemplateName)

			//we read the template into filePath, write the unvalidated file to unvalidatedFilePath, and compare it to the validated file at validatedFilePath
			const filePath = path.join(__dirname, `./html-templates/${htmlTemplateName}.html`)
			const unvalidatedFilePath = path.join(__dirname, `./html-tests-unvalidated/${htmlTemplateName}.html`)
			const validatedFilePath = path.join(__dirname, `./html-tests-validated/${htmlTemplateName}.html`)

			//restart puppeteer
			await jestPuppeteer.resetBrowser()

			//use this to block until strapify is finished
			const strapifyInitializedPromise = new Promise(async (resolve, reject) => {
				await page.exposeFunction("onStrapifyInitialized", () => {
					resolve()
				})
			})

			//add a listener for strapifyInitialized
			await page.evaluateOnNewDocument(() => {
				document.addEventListener("strapifyInitialized", () => {
					window.onStrapifyInitialized()
				})
			})

			//navigate to the template file
			await page.goto(filePath)

			//wait for strapify to finish
			await strapifyInitializedPromise

			//wait a bit for good measure
			await page.waitForTimeout(100)

			//remove the strapify script element
			await page.evaluate(() => {
				document.querySelector("script").remove()
			})

			//write the unvalidated file
			const pageContents = await page.content()
			writeFile(unvalidatedFilePath, pageContents)

			//check for the validated file
			if (!fileExists(validatedFilePath)) {
				fail(`No validated file to compare to. Create the validated file with path ${validatedFilePath}`)
			}

			//read the validated file
			const validatedFileContents = readFile(validatedFilePath)

			//remove all whitespace including tabs, newlines, and spaces, then diff the two DOMs
			const diff = new DiffDOM().diff(pageContents.replace(/\s/g, ''), validatedFileContents.replace(/\s/g, ''))
			await expect(diff).toEqual([])
		})
	})
})