// Ok, so I need to be able to process text

// UMD return exports

(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["b"], factory);
	} else if (typeof module === "object" && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory(require("b"));
	} else {
		// Browser globals (root is window)
		root.chancery = factory(root.b);
	}
})(typeof self !== "undefined" ? self : this, function (b) {
	// Use b in some fashion.

	//============================================================
	// MODIFIERS

	function isVowel(c) {
		var c2 = c.toLowerCase();
		return (c2 === 'a') || (c2 === 'e') || (c2 === 'i') || (c2 === 'o') || (c2 === 'u');
	};

	function isAlphaNum(c) {
		return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
	};
	function escapeRegExp(str) {
		return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	var MODIFIERS = {

		replace : function(s, params) {
			//http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
			return s.replace(new RegExp(escapeRegExp(params[0]), 'g'), params[1]);
		},

		capitalizeAll : function(s) {
			var s2 = "";
			var capNext = true;
			for (var i = 0; i < s.length; i++) {

				if (!isAlphaNum(s.charAt(i))) {
					capNext = true;
					s2 += s.charAt(i);
				} else {
					if (!capNext) {
						s2 += s.charAt(i);
					} else {
						s2 += s.charAt(i).toUpperCase();
						capNext = false;
					}

				}
			}
			return s2;
		},

		capitalize : function(s) {
			return s.charAt(0).toUpperCase() + s.substring(1);
		},

		a : function(s) {
			if (s.length > 0) {
				if (s.charAt(0).toLowerCase() === 'u') {
					if (s.length > 2) {
						if (s.charAt(2).toLowerCase() === 'i')
							return "a " + s;
					}
				}

				if (isVowel(s.charAt(0))) {
					return "an " + s;
				}
			}

			return "a " + s;

		},

		firstS : function(s) {
			console.log(s);
			var s2 = s.split(" ");

			var finished = baseEngModifiers.s(s2[0]) + " " + s2.slice(1).join(" ");
			console.log(finished);
			return finished;
		},

		s : function(s) {
			switch (s.charAt(s.length -1)) {
			case 's':
				return s + "es";
				break;
			case 'h':
				return s + "es";
				break;
			case 'x':
				return s + "es";
				break;
			case 'y':
				if (!isVowel(s.charAt(s.length - 2)))
					return s.substring(0, s.length - 1) + "ies";
				else
					return s + "s";
				break;
			default:
				return s + "s";
			}
		},
		ed : function(s) {
			switch (s.charAt(s.length -1)) {
			case 's':
				return s + "ed";
				break;
			case 'e':
				return s + "d";
				break;
			case 'h':
				return s + "ed";
				break;
			case 'x':
				return s + "ed";
				break;
			case 'y':
				if (!isVowel(s.charAt(s.length - 2)))
					return s.substring(0, s.length - 1) + "ied";
				else
					return s + "d";
				break;
			default:
				return s + "ed";
			}
		},

	};


	//============================================================
	

	function getRandom(arr) {
		return arr[Math.floor(Math.random()*arr.length)]
	}

	function groupBySplitter(splitter, sections) {
		if (typeof splitter !== 'string') {
			throw(`Wrong splitter type: ${splitter}`)
		}
		if (!Array.isArray(sections)) {
			// console.warn(sections)
			// throw(`Wrong sections type: ${sections}`)
			return [sections]
		}
		let subgroups = [[]];
		for (var i in sections) {
			let s = sections[i];
			if (s.splitter === splitter) {
				subgroups.push([]);
			} else {
				subgroups[subgroups.length - 1].push(s);
			}
		}
		return subgroups.filter(s => s.length !== 0).map((s) => {
			if (s.length == 1) return s[0];
			else return s;
		}).filter(s => s.length !== 0);
	}


	 /**
	 * =========================================================
	 * Parse particular things like rules, sockets, and exits
	 */


	 function compressSections(s) {
	 	if (typeof s === "string")
	 		return s
	 	if (s.type == "text")
	 		return s.raw
	 	if (s.type == "splitter")
	 		return s.splitter
	 	if (s.contextID == "rule")
	 		return s.openChar + s.children.map(s2 => compressSections(s2)).join("") + s.closeChar
	 	if (s.contextID == "socket")
	 		return s.openChar + s.children.map(s2 => compressSections(s2)).join("") + s.closeChar
	 	if (s.contextID == "rg")
	 		return s.openChar + s.children.map(s2 => compressSections(s2)).join("") + s.closeChar
	 	if (s.contextID == "expression")
	 		return s.openChar + s.children.map(s2 => compressSections(s2)).join("") + s.closeChar

	 	if (Array.isArray(s))
	 		return s.map(s2 => compressSections(s2)).join("")
	 }

	 function parseExit(exitRaw) {
	 	if (typeof exitRaw !== "string") {
	 		console.warn(exitRaw)
	 		throw(`Non-string exit to parse: ${exitRaw}`)
	 	}

		// Given an exit, process it
		let parsed = parse("exit", exitRaw);
		let s2 = groupBySplitter("->", parsed.children)
		
		// console.log(exitRaw)
		// Deal with missing "->"
		// console.log(s2)

		let conditionSections = groupBySplitter(" ", s2[0])
		// console.log("S2", s2)
		let [targetSections, ...actionSections] = groupBySplitter(" ", s2[1])

		// console.log("Parse exit", exitRaw)
		// console.log("conditionSections", conditionSections)
		// console.log("targetSections", targetSections)
		// console.log("actionSections", actionSections)
		return {
			raw: compressSections(exitRaw),
			type: "exit",
			actions: actionSections.map(sections => parseConAct(sections, true)),
			target: targetSections.raw, // TODO: ???
			conditions: conditionSections.map(sections => parseConAct(sections, false))
		}
	}
	
	function parseSocket(raw, deferred) {
		let socketSections = groupBySplitter(".", raw.children)

		let socket = {
			key: parseExpression(socketSections[0]),
			modifiers: socketSections.slice(1).map(s => parseExpression(s)),
			deferred: deferred,
			type: "socket",
			raw: raw,
		}
		return socket
	}

	function parseRuleAction(raw) {
		let ruleAction = {
			type: "ruleAction",
			raw: raw,
		}
		return ruleAction
	}


	function parseRule(raw) {
		let sections = raw

		// Evennnntuualllly get to individual sections
		if (typeof sections == "string")
			sections = parse("rule", raw)
		if (sections.children)
			sections = sections.children

		return {
			type: "rule",
			sections: sections.map(s => {
				// console.log("RULE SECTION", s)
				// types: socket, stackaction, text
				if (s.type === "text")  {
					// Rule text is plaintext
					return s
				}
				if (s.contextID === "socket") 
					return parseSocket(s)
				if (s.openChar === "[")  
					return parseRuleAction(s)
				if (s.openChar === "{")  
					return parseSocket(s, true)
			})
		}
	}

	function parseExpression(sections) {
		// console.log("PARSE EXPR", sections)

			// REPARSIGN
			 // This is some expression, 
				//maybe because we didn't parse it in some other context
				if (typeof sections === "string") {
					sections = parse("expression", sections).children
				}
				if (sections.type === "text") {
					sections = parse("expression", sections.raw).children
				}

			// OK, we know we have parsed sections here

			if (sections.length === 1) {
				let s = sections[0]
				// console.log("SINGLE", s)
				// Is this a ...string?
				// Text in an expression is either a number or a key
				if (s.type == "text") {
					if (isNaN(s.raw)) {
						return {
							type: "key",
							value: s.raw,
							raw: s.raw
						}
					}
					return {
						type: "number",
						value: Number(s.raw),
						raw: s.raw
					}
				}


				else {
					console.log("UNKNOWN SINGLE EXP ?????", s)
				}

			}
			

			// More than one section
			// TODO: proper tree, currently just binop
			// console.log("OPTREE?", sections)
			let opIndex = 1
			if (sections[opIndex] && sections[opIndex].splitter) {
				// Valid optree
				let opTree = {
					raw: compressSections(sections),
					op: sections[opIndex].splitter,
					lhs: parseExpression(sections.slice(0, opIndex)),
					rhs: parseExpression(sections.slice(opIndex + 1)),
					type: "expression",
				}
				// console.log("OPTREE!!!", opTree)
				return opTree
			}

			// FUNCTION!
			if (sections.length >= 2 && sections[sections.length - 1].openChar === "(") {
				let paramGroups = groupBySplitter(",", sections[sections.length - 1].children)
				// console.log("paramGroups", paramGroups)
				return {
					type: "function",
					address: parseExpression(sections.slice(0, sections.length - 1)),
					parameters: paramGroups.map(s => parseExpression(s)) 
				}
			}



			// IF we get here, no options
			console.log("UNKNOWN EXP ?????", sections)
		}


		function parseConAct(raw, isAction) {
		// What kind of condition/action is this?

		let conact = {
			type: isAction?"action":"condition",
			raw: compressSections(raw),
			// errors: []
		}
		//     What is this?
		if (Array.isArray(raw) && raw.length == 0) {
			// Single section!
			raw = raw[0]
		}

		// Get rid of easy ones first
		if (raw.contextID == "rule") {
			
			// Its a rule!
			conact.subtype = "say"
			// console.log("SAY", raw)
			conact.rule = parseRule(raw)
			return conact
		}


		conact.expression =  parseExpression(raw.children || raw)
		

			// Deal with: wait, setters, and comparisions
	// conact.subtype = "expression"
	// conact.expression = parseExpression(raw)
	// console.log(conact.expression)
	if (conact.expression.op === ":") {
		// Its a wait expression!
		conact.subtype = "wait"

		// Get the wait time too
		conact.waitTime = conact.expression.rhs
	} else {
		conact.subtype = "expression"
	}

	return conact

		// If last is (), its probably a fxn
		// 
	}

	
	/**
	 * =========================================================
	 * Parse constants
	 */

	 const CLOSE_CHARS = {
	 	"{": "}",
	 	"[": "]",
	 	"(": ")",
	 	"#": "#",
	 	"'": "'",
	 	"`": "`",
	 	'"': '"',
	 };

	 const CONTEXTS = {
	 	expression: {
	 		splitters: [
	 		",",
	 		"?",
	 		":",
	 		"||",
	 		"&&",
	 		"==",
	 		"<=",
	 		">=",
	 		"!=",
	 		"+=",
	 		"-=",
	 		"/=",
	 		"*=",
	 		"%=",
	 		"^=",
	 		"=",
	 		"!",
	 		"-",
	 		"+",
	 		"/",
	 		"*",
	 		"%",
	 		"^",
	 		],
	 		innerContexts: {
	 			"'": "rule",
	 			"`": "rule",
	 			'"': "rule",
	 			"(": "expression",
	 			"[": "expression",
	 			"{": "expression",
	 		},
	 	},

	 	exit: {
	 		splitters: ["->", " ", ":"],
	 		allowWhitespace: false,
	 		innerContexts: {
	 			"'": "rule",
	 			"`": "rule",
	 			'"': "rule",
	 			"(": "expression",
	 			"[": "expression",
	 			"{": "expression",

	 		},
	 	},
	 	rule: {
	 		allowWhitespace: true,
	 		innerContexts: {
	 			"#": "socket",
	 			"[": "rg",
	 		},
	 	},
	 	socket: {
	 		splitters: ["."],
	 		innerContexts: {
	 			"{": "expression",
	 			"(": "expression",
	 			"[": "rg",
	 		},
	 	},
	 	rg: {
	 		splitters: [":", ",", " for ", " in ", " where ", " if ", " else "],
	 		innerContexts: {
	 			"{": "expression",
	 			"(": "expression",
	 			"#": "socket",
	 			"[": "rg",
	 			"'": "rule",
	 			"`": "rule",
	 			'"': "rule",
	 		},
	 	},
	 };


	/**
	 * =========================================================
	 * Heroic parse function
	 */
	 function parse(contextID, s) {
     let context = undefined
		// Go through each character in s
		// If it is the close symbol of our current context, close this context
		// Else if it is the open symbol of a context, open a new context
		// Otherwise....?
		// If a splitter, add that

		if (typeof contextID !== "string") {
			console.warn(s)
			throw "non-string contextID" + contextID.toString();
		}
		if (typeof s !== "string") {
			console.warn(s)
			throw "non-string to parse" + s.toString();
		}

		let root = {
			type: "context",
			start: 0,
			end: s.length,
			errors: [],
			contextID: contextID,
			children: [],
		};

		let stack = [root];

		let section = root;

		function spacer() {
			return "\t".repeat(stack.length);
		}

		function sectionToString(section) {
			return `${
				section.type
			} ${section.openChar} ${section.closeChar} '${s.substring(section.start, section.end)}'`;
		}

		let textStart = 0;

		function addText(i) {
			// Add a text section
			let textSection = {
				type: "text",
				raw: s.substring(textStart, i),
				start: textStart,
				end: i,

			};
			// Skip empty strings
			if (i > textStart) section.children.push(textSection);
		}

		function closeContext(i, c) {
			addText(i);
			section.end = i + 1;
			section.inner = s.substring(section.start + 1, i),
			section.raw = s.substring(section.start, i + 1),

			stack.pop();

			section = stack[stack.length - 1];
			textStart = i + 1;

		}

		function openContext(i, c, newContextID) {
			let newSection = {
				type: "context",
				openChar: c,
				// s: s,
				start: i,
				errors: [],
				contextID: newContextID,
				children: [],
				closeChar: CLOSE_CHARS[c],
			};

			addText(i);
			textStart = i + 1;
			section.children.push(newSection);
			stack.push(newSection);
			section = newSection;
		}

		// Go through each character
		for (var i = 0; i < s.length; i++) {
			let c = s[i];
			context = CONTEXTS[section.contextID];
			if (section.closeChar === c) {
				// Close this context
				closeContext(i, c);
			} else {
				// Is this a context-opener?
				let newContextID = context.innerContexts[c];
				if (newContextID) {
					// Open a new context
					openContext(i, c, newContextID);
				} else {
					// Neither open nor close, test for splitters
					for (var j in context.splitters) {
						let splitter = context.splitters[j];
						if (s.startsWith(splitter, i)) {
							addText(i);
							section.children.push({
								type: "splitter",
								// start: i,
								splitter: splitter,
							});
							textStart = i + splitter.length;
							i += splitter.length - 1;
							break;
						}
					}
				}
			}
		}
		addText(i);

		return root;
	}

	function flatten(grammar, rule) {
		return expand(grammar, rule).finished
	}
	
	function expand(grammar, rule) {
		let root = new TraceryNode({grammar: grammar}, rule)
		root.expand()
		return root
	}

	class TraceryNode {
		constructor(context, template) {
      if (context == undefined || template === undefined)
        console.warn("No context?", template, context)
			this.finished = undefined
			// console.log(`New ${template.type} node`, template)
			this.template = template
			this.context = context

			// Setup whatever we need for this node
			switch(this.template.type) {
				case "text": 
					break;
				case "key": 
					break;

				case "rule": 
					this.sectionNodes = this.template.sections.map(s => new TraceryNode(context, s))
					break;
				case "socket": 
					this.keyNode = new TraceryNode(context, this.template.key)
					this.modifierNodes = this.template.modifiers.map(s => new TraceryNode(context, s))
					break;

				default:
					console.warn("TODO: setup", this.template.type, this.template)
			}
			this.expand()
		}

		expand() {
			switch(this.template.type) {
				case "text": 
					this.finished = this.template.raw
					break;
				case "key": 
					this.finished = this.template.value
					break;

				case "rule": 
					this.sectionNodes.forEach(s => s.expand())
					this.finished = this.sectionNodes.map(s => s.finished).join("")
					// console.log("RULE FINISHED", this.finished)
					break;
				case "socket": 
					// Get the ruleset
					this.key = this.keyNode.finished
					// console.log("GET RULESET FOR", this.key)
          if (this.context.grammar === undefined) {
            console.warn("Missing grammar?", this.context)
            this.finished = "--NO GRAMMAR--"
            return
          }
					this.ruleSet = this.context.grammar[this.key]
					if (this.ruleSet == undefined) {
						// WHOOPS no rules
						this.finished = `((${this.key}))`
					} else {
						this.rule = getRandom(this.ruleSet)


						// console.log(this.ruleSet, this.rule)
						this.ruleNode = new TraceryNode(this.context, parseRule(this.rule))
						this.ruleNode.expand()
						this.finishedRule = this.ruleNode.finished

						this.finished = this.finishedRule

						// Apply modifiers
						this.modifierNodes.forEach(mod => {
							mod.expand()
							let key = mod.finished
							let fxn = MODIFIERS[key]
							this.finished = fxn(this.finished)
						})

					}
					break;
					
				default:

					console.warn("TODO: setup", this.template.type, this.template)
			}

		}
	}	

	return {
		expand,
		flatten,
		parse,
		parseExit,
		parseRule
	}
});
