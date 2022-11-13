let botCount = 0

function forAll(obj, fxn) {
	if (Array.isArray(obj))
		obj.forEach(item => fxn(item))
	else if (obj)
		fxn(obj)
}

let FUNCTIONS = {
	random(a, b) {
		if (a === undefined) 
			return Math.random()
		if (b === undefined) 
			return Math.random()*a
		return Math.random()*(b - a) + a
	},

	randomInt(a, b) {
		return Math.floor(random(a, b))
	}
}

class BotSimulator {
	constructor(mapID, map, {onPost, startTime}) {
		this.idNumber = botCount++
		this.map = map
		this.mapID = mapID
		
		this.isPaused = false

		console.log("CREATING BOT", this.map.title)
		
		this.stateID = "origin"
		
		this.exitWatchers = []
		this.onPost = onPost
		
		this.timeEnteredState = startTime
		this.timeInState = 0
		this.currentTime = startTime
		this.actionQueue = []
		
		this.currentInput = "hi there"

		this.post("starting Bot for " + mapID, "system")

		// Enther the state LAST
		this.enterState("origin")
		
		
	}

	input(text) {
		console.log(`-- Bot hears '${text}' from the user --`)
		this.currentInput = text
		this.checkExits()
	}

	getPfp(type, id) {
		if (type === "bot")
			return this.map.botPfp?this.map.botPfp:"🤖"
		if (type === "human")
			return this.map.humanPfp?this.map.humanPfp:"👤"
		return "🍊"
	}
	
	setState(stateID) {
		// TODO: should do any actions?
		this.enterState(stateID)
	}
	
	expand(rule) {
		if (Array.isArray(rule)) {
			rule = getRandom(rule)
		}
		
		return this.grammar.flatten(rule)
		// return rule
	}
	
	get id() {
		return "Bot" + this.mapID + this.idNumber
	}
	
	get cooldownPct() {
		if (this.cooldown)
			return (this.time - this.cooldown.start)
	}
	
	post(msg, type = "chat") {
		console.log("POST!", msg)
		//     Add a cooldown
		// this.cooldown =  {
		// 	start:  this.currentTime,
		// 	length : (msg.length*.1 + 1)*(this.map.postingRate || 1)
		// }

		if (typeof msg === "string") {
			msg = {
				type: type,
				fromType: "bot",
				from: this.id,
				text: msg
			}
		}
		this.onPost(msg)

	}

	update(time) {
		if (this.isPaused)
			return 

		/**
		* Time has passed.... see if there are any exits opened or closed
		*/
		
		this.currentTime = time
		// console.log("BOT TIME", time)
		this.timeInState = this.currentTime - this.timeEnteredState
		
		if (this.state.onTickSay) {
			this.post(this.expand(this.state.onTickSay))
		}
		
		// Check the exits
		this.checkExits() 

		// Manage the action queue

		// Start the first action
		if (this.actionQueue.length > 0) {
			let action = this.actionQueue[0]
			if (!action.isActive) {
				action.activate()
			}   

			// Update all
			this.actionQueue.forEach(action => action.update())

			// Remove dead actions
			if (action.isFinished) {
				action.isActive = false
				this.actionQueue.splice(0, 1)
			}
		}
	}
	
	checkExits() {
		// No updating while in transit
		if (this.activeExit == undefined) {
			this.exitWatchers.forEach(ew => ew.update(this))

			let open = this.exitWatchers.filter(ew => ew.isOpen)
			if (open.length > 0) {
				this.takeExit(open[0])
			}
		}
	}

	takeExit(ew) {
		// console.log("TAKE EXIT", ew.template)
		this.activeExit = ew
		this.activeExit.isActive = true

		// Add all the exit actions of this state
		// this.actionQueue = []
		forAll(this.state.onExitSay, (raw) => {
			// console.log("RAW", raw)
			this.actionQueue.push(new ActionWatcher(this, {
				type: "action",
				subtype:"say",
				raw: raw,
				rule : chancery.parseRule(raw)
			}))
		})

		// console.log(this.actionQueue )
		// Add all the exit actions of this *exit*
		this.activeExit.actions.forEach(action => this.actionQueue.push(action))

		
		// console.log(this.activeExit)
		this.actionQueue.push(new ActionWatcher(this, {
			type: "action",
			target: this.activeExit.target, // TODO: calculate on the fly
			subtype:"stateChange",
		}))
		// console.log(this.actionQueue)

		
		// this.state.onExit.forEach(action => actions)
	}
	
	hasState(stateID) {
		return this.map.states[stateID] !== undefined
	}
	
	enterState(stateID) {
		/**
		 * Enter a state normally.  
		 * Activate all of its onEnter actions
		 **/

		// Re-enter current state
		console.log("ENTER STATE ID", stateID)
		if (stateID == "@")
			stateID = this.stateID


		if (typeof stateID !== "string")
			console.warn("Non-string state ID")



		//     Handle missing states
		if (!this.hasState(stateID)) {
			this.post(`No state named '${stateID}'`, "error")

			return
		}

		this.stateID = stateID
		this.currentInput = undefined
		this.activeExit = undefined

		forAll(this.state.onEnterSay, (raw) => {
			// console.log("RAW", raw)
			this.actionQueue.push(new ActionWatcher(this, {
				type: "action",
				subtype:"say",
				raw: raw,
				rule : chancery.parseRule(raw)
			}))
		})

		this.timeEnteredState = Date.now()
		console.log("Entering state", stateID)

		// Set up all the exit watchers
		this.exitWatchers.splice(0, this.exitWatchers.length)
		// Add them all for this state
		// Also add any global exits
		if (this.map.exits)
			this.map.exits.forEach(ex => {
				this.exitWatchers.push(new ExitWatcher(this, ex))
			})
		if (this.state.exits)
			this.state.exits.forEach(ex => {
				this.exitWatchers.push(new ExitWatcher(this, ex))
			})
		
		// console.log("MADE EXIT WATCHERS", this.exitWatchers)
	}
	
	get state() {
		return this.map.states[this.stateID]
	}

	evaluate(template, context) {
		// console.log("EVALUATE", template, template.type)
		switch(template.type) {
			case "function":
				let parameters = template.parameters.map(p => this.evaluate(p))
				let fxnName = this.evaluate(template.address)
				let fxn = FUNCTIONS[fxnName]
				if (fxn) {
					return fxn(...parameters)
				} else {
					this.error(`No fxn named ${fxnName}`)
				}
				return 0

			case "number":
			case "key":
					return template.value
			
			default:
				console.warn("unknown type", template.type)
				return 0
		}
		// Calculate something
	} 
}

function getRandom(arr) {
	return arr[(Math.floor(Math.random()*arr.length))]
}


let watcherCount = 0

class Timer {
	constructor(startTime, totalTime, onFinish) {
		this.startTime = startTime
		this.time = startTime
		this.totalTime = totalTime
		this.onFinish = onFinish
		this.isFinished = false
		if (isNaN(startTime) || isNaN(totalTime)) {
			console.warn("NaN timer", startTime, totalTime)
		}
		// console.log("new timer", startTime, totalTime)
	}

	setTime(t) {
		this.time = t
	} 

	get pct() {
		let pct = Math.max(0, Math.min(1, this.elapsed/this.totalTime))

		if (pct >= 1 && !this.isFinished) {
			this.isFinished = true
			this.onFinish?.()
		}
		
		return pct
	}
	get elapsed() {
		return this.time - this.startTime
	}
}

class ConditionWatcher {
	constructor(bot, template) {
		this.bot = bot
		this.idNumber = watcherCount++
		this.activePct = 0


		if (template === undefined)
			console.warn("undefined condition template")
		this.template = template
		// Watch to see when this condition is fulfilled
		// console.log("CONDITION WATCHER", this.template)

		// If wait, figure out the wait time
		switch(this.template.subtype) {

			case "wait":
				let total = bot.evaluate(this.template.waitTime)
				this.timer = new Timer(bot.currentTime, total)
				
				break;

			case "say":
				this.rule = this.template.rule.sections[0].raw
				break;
		}
	}  

	get isActive() {
		return this.activePct >= 1
	}

	get type() {
		return this.template.subtype
	}

	update() {
		// console.log('Update cond watcher', this.template.subtype)
		switch(this.template.subtype) {

			case "wait":
				this.timer.setTime(this.bot.currentTime)
				this.activePct = this.timer.pct
				// console.log(this.activePct)
				break;

			case "say":

				let input = this.bot.currentInput
				if (input) {
					console.log("TODO: check say", this.bot.currentInput)
					console.log(this.rule)
					// Check if it contains the text we want
					if (input.includes(this.rule))
						this.activePct = 1
          if (this.rule === "*")
						this.activePct = 1
					
				}
				break;

			default: 
				console.warn("Unknown exit type")
		}
		

		
	}
}

class ActionWatcher {
	constructor(bot, template) {
		this.bot = bot
		
		this.timer = undefined
		this.isActive = false
		this.idNumber = watcherCount++

		// How long does this action take to complete?
		// (or is it a callback?)
		this.length = Math.random()*1000 + 1000

		if (template === undefined)
			console.warn("undefined action template")
		this.template = template

		// console.log("TEMPLATE", template)
		// Go....here! TODO
		if (this.template.target)
			this.target = this.template.target

		// Watch to see when this condition is started or completed
		// if (Math.random() > .1)
		// 	this.activate()
	}  

	get type() {
		return this.template.subtype
	}

	get isFinished() {
		// TODO: more non-timer actions
		return this.timer && this.timer.pct >= 1
	}

	get timeActive() {
		return this.currentTime - this.activationTime
	}

	activate() {
		// console.log("ACTIVATE ACTION") 
		this.isActive = true
		// This action has started!

		this.timer = new Timer(this.bot.currentTime, Math.random()*1 + 1, () => {
			// console.log("FINISHED")
		})
		// console.log("TIMER", this.timer)

		// Do these actions
		switch(this.type) {
			case "say":
				// console.log("EXPAND", this.template.rule)
				// TODO: contexts
				let expanded = chancery.flatten(this.bot.map.grammar, this.template.rule)
				this.bot.post(expanded)
				break;

			case "stateChange":
				console.log("Activate state change", this.template.target)
				this.bot.enterState(this.template.target)
				break;
			default:
				console.warn("TODO: DO ACTION", this.template.subtype)
		}
	}

	update() {
		if (this.timer) {
			this.timer.setTime(this.bot.currentTime)
		}
	}


}


class ExitWatcher {
	constructor(bot, exit) {
		this.bot = bot
		this.idNumber = watcherCount++
		// console.log(`****New exit watcher for "${exit}"`)
		// console.log(exit)
		this.isOpen = false
		this.isActive = false
		

		let parsed = chancery.parseExit(exit)
		this.template = exit
		this.conditions = parsed.conditions.map(c => new ConditionWatcher(bot, c))
		this.actions = parsed.actions.map(c => new ActionWatcher(bot, c))
		this.target = parsed.target
		this.errors = []
		
	}


	update() {
		// What's up, bot?
		this.conditions.forEach(c => c.update())

		this.isOpen = this.conditions.every(c => c.isActive);

		if (this.isActive && !this.isOpen) {
			// Oh no closed while in use????
		}
	}
}

