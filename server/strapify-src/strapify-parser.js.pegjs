{
	const operatorDict = {
		"&&": "and", "||": "or",
		"==": "eq", "!=": "ne",
		"<=": "le", ">=": "ge",
		"<": "lt", ">": "gt"
	}
}

entry = 
	operator / comparison

group = 
	"(" _ exp: (comparison / operator) _ ")"
	{ 
		return exp
	}

/* operators */
operator =
	left: (group / comparison) _ op: ("||" / "&&") _ right: (group / comparison)
	{
		return { 
			type: operatorDict[op], 
			left: left, 
			right: right 
		}
	}

comparison =
	left: (literal / variable) _ 
	op: ("==" / "<=" / ">=" / "!=" / "<" / ">") _
	right: (literal / variable) _ 
	{ 
		return {
			type: operatorDict[op],
			left: left,
			right: right
		}
	}


/* variables */
variable =
	variables: (simpleVariable "."?)+
	{
		let val = ""
		for(let i = 0; i < variables.length; i++) {
			val += variables[i][0].value
			if(variables[i][1]) {
				val += "."
			}
		}

		return {
			type: "variable",
			value: val
		}
	}

simpleVariable =
	variable: [A-Za-z0-9\-\_]+
	{
		return {
			type: "variable",
			value: variable.join("")
		}
	}

/* literals */
literal =
	val: (string / number / boolean)

string = 
	"'" string: [^']* "'"
	{
		return {
			type: "string",
			value: string.join("")
		}
	}

boolean =
	bool: ("true" / "false")
	{
		return {
			type: "boolean",
			value: bool
		}
	}

number =
	num: float / integer

float =
	first: integer '.' second: integer
	{	
		return {
			type: "float",
			value: first.value + "." + second.value
		}
	}

integer = 
	digits: [0-9]+ 
	{	
		return {
			type: "integer",
			value: digits.join("")
		}
	}

_ "whitespace"
  = [ \t\n\r]*