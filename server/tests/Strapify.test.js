import Strapify from '../strapify-src/strapify';


describe("Strapify.js", () => {

	describe("query string functions", () => {

		describe("getQueryStringVariables", () => {
			test("works with a single variable", () => {
				delete window.location
				window.location = new URL("https://www.example.com?var=Hello%20World")

				expect(Strapify.getQueryStringVariables()).toStrictEqual({ var: "Hello%20World" })
			})
			test("works with two variables", () => {
				delete window.location
				window.location = new URL("https://www.example.com?var1=Hello&var2=World")

				expect(Strapify.getQueryStringVariables()).toStrictEqual({ var1: "Hello", var2: "World" })
			})
			test("works with no variables", () => {
				delete window.location
				window.location = new URL("https://www.example.com")

				expect(Strapify.getQueryStringVariables()).toStrictEqual({})
			})
		})

		describe("substituteQueryStringVariables", () => {
			test("works with a single variable", () => {
				let input = "qs.var"
				delete window.location
				window.location = new URL("https://www.example.com?var=Hello%20World")

				expect(Strapify.substituteQueryStringVariables(input)).toBe("Hello%20World")
			})
			test("works with two variables", () => {
				let input = "qs.var1.qs.var2"
				delete window.location
				window.location = new URL("https://www.example.com?var1=Hello&var2=World")

				expect(Strapify.substituteQueryStringVariables(input)).toBe("Hello.World")
			})
			test("works with no variables", () => {
				let input = ""
				delete window.location
				window.location = new URL("https://www.example.com?var1=Hello&var2=World")

				expect(Strapify.substituteQueryStringVariables(input)).toBe("")
			})
		})

		describe("removeQueryStringVariableReferences", () => {
			test("works with a single occurance", () => {
				const input = "qs.var"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("")
			})

			test("works with a double occurance", () => {
				const input = "qs.var.qs.var2"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("")
			})

			test("works with leading word", () => {
				const input = "leading.qs.var"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("leading")
			})

			test("works with trailing word", () => {
				const input = "qs.var.trailing"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("trailing")
			})

			test("works with leading and trailing word", () => {
				const input = "leading.qs.var.trailing"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("leading.trailing")
			})

			test("works with complex combination", () => {
				const input = "qs.var0.word0.qs.var1.word1.qs.var2.qs.var3.word2.qs.var4"
				expect(Strapify.removeQueryStringVariableReferences(input)).toBe("word0.word1.word2")
			})

		})

	})

	describe("DOM parsing functions", () => {

	})

})