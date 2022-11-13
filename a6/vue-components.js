/* globals Vue */

/**==================================================
 * Bot simulator debugging
 **/


Vue.component("timer", {
	template: ` <span class="timer">
		<div v-if="showDebug">
			{{timer.pct.toFixed(2)}}
				{{timer.elapsed.toFixed(2)}}/	{{timer.totalTime.toFixed(2)}}
		</div>
		<div class="clock" :style="clockStyle" v-if="showClock">

		</div>
	</span> `,

	computed: {
		clockStyle() {
			return {
				borderRadius: "100px",
			width: this.radius + "px",
			height: this.radius + "px",
			display: "inline-block",
			boxShadow: "1px 2px 3px 1px rgba(0, 0, 0, .4)",
			 background: `conic-gradient(${this.color0} ${this.timer.pct*98}%, ${this.color1} ${this.timer.pct}%)`
			}
		}
	},
	
	props: {
		showDebug: {default:false},
		showClock: {default:true},
		timer:{require: true},
		color0:{default: "cyan"},
		color1:{default: "black"},
		radius:{default: 20}
	},
});

Vue.component("bot-chip", {
	template: ` <span class="chip bot-chip" :class="{['bot-chip-' + bot.stateID]:true}"> Bot{{bot.idNumber}}</span> `,

	props: ["bot"],
});

Vue.component("state-chip", {
	template: ` <span class="chip state-chip" :class="{['state-chip-' + stateID]:true}"> {{stateID}}</span> `,

	props: ["stateID"],
});

Vue.component("bot-debug", {
	template: ` <div class="panel bot-debug">
	<header>
		<h3><bot-chip :bot="bot"/> running map '{{bot.mapID}}' </h3>

		<button @click="pause">PAUSE</button>
	</header>
	<div>
		currently in: <state-chip :stateID="bot.stateID"/>

		<select v-model="selectedState" @change="bot.setState(selectedState)">
			<option v-for="(state,stateID) in bot.map.states">{{stateID}}</option>
		</select>
		
	
		<div v-if="bot.currentInput">
			INPUT: <div class="quote">{{bot.currentInput}}</div>
		</div>

		
		<div>
		</div>
		
		<details class="panel">
		<summary>queue</summary>
		<conact-watcher v-for="action in bot.actionQueue" :watcher="action" :key="action.idNumber" />
		</details>
		
		<details class="panel">
		<summary>exits</summary>
		<exit-watcher v-for="ew in bot.exitWatchers" :ew="ew" :key="ew.idNumber" />
		</details>

	</div>
</div>`,
	methods: {
		pause() {
			this.bot.isPaused = !this.bot.isPaused
		}
	},
	
	
	data() {
		return {
			selectedState: this.bot.stateID
		}
	},

	props: ["bot"],
});


Vue.component("parse-node", {
	template: `
		<div v-if="node === undefined">
			NONE
		</div>
		<div v-else-if="node.value !== undefined" :class="{[node.type]:true}">
			{{node.value}}
		</div>
		<div v-else-if="node.type === 'text'" class="text">
			{{node.raw}}
		</div>
		<div class="parse-node" v-else :class="{['parse-node-' + node.type]:true}">

			<parse-node v-if="node.address" :node="node.address" />
			<parse-node v-if="node.expression" :node="node.expression" />
			<parse-node v-if="node.rule" :node="node.rule"  />
			<parse-node v-if="node.key" :node="node.key"  />
			
			<div v-if="node.sections" class="sectionholder">
				<parse-node v-for="(s,si) in node.sections" :node="s" :key="si" />
			</div>

			<div v-if="node.parameters" class="parameterholder">
				<div v-for="(s,si) in node.parameters" class="puncpair-item">
					<span v-if='si>0'>,</span>
					<parse-node  :node="s" :key="si" />
				</div>
			</div>

			<div v-if="node.modifiers" class="modifierholder">
				<span v-for="s in node.modifiers" >
				.<parse-node :node="s" />
				</span>
			</div>

			<div v-if="node.op">
				<parse-node class="opside" :node="node.lhs" />
				<div class="op">{{node.op}}</div> 
				<parse-node class="opside" :node="node.rhs" />
				
			</div>

			
	 </div>
	
	`,
	props: ["node"]
 })

Vue.component("conact-watcher", {
	template: `<div class="conact-watcher" :class="classes">

		<div class="overlay">
			<div class="fill" :style="fillStyle">
				
			</div>
		</div>

		<header>
			<pre class="minicode">{{watcher.template.raw}}</pre>
			<div class="toptag">
				{{watcher.type}}
			</div>


			<timer v-if="watcher.timer" :timer="watcher.timer" />
			
		</header>
		<div v-if="watcher.target">->{{watcher.target}}</div>
		
		<parse-node :node="watcher.template" />
		
		
	</div>`,

	computed: {

		fillStyle() {
			return {
				background: `hsla(100, 100%, 50%, .4)`,
				width: `${this.watcher.activePct*100}%`
			}
		},
		classes() {
			return {
				['conact-' + this.watcher.template.subtype]:true,
				active: this.watcher.isActive
			}
		}
	},

	props: ["watcher"]
})

Vue.component("exit-watcher", {
	template: `<div class="exit-watcher" :class="{[status]:true}">
			<header v-if="false">
			<span>{{status}}</span>
			<pre class="minicode">{{ew.template}}</pre>
			</header>


			<div class="exit-item">
				<conact-watcher 
					v-for="(w,index) in ew.conditions"  :watcher="w" :key="w.idNumber" />
					
			</div>

			<div class="exit-item">
			-><span class="chip">{{ew.target}}</span>
			</div>

			<div class="exit-item">
				<conact-watcher 
					v-for="(w,index) in ew.actions" :watcher="w" :key="w.idNumber"  />
					
			</div>
			
		 
			
			<div class="errors">
				<div class="error" v-for="e in ew.errors">{{e}}</div>
			</div>
	 </div>`,

	 computed: {
	 	status() {
	 		if (this.ew.isActive) {
	 			return "active"
	 		} 
	 		if (!this.ew.isOpen) {
	 			return "closed"
	 		} 
	 		if (this.ew.isOpen) {
	 			return "open"
	 		} 
	 		return "unknown"
	 	}
	 },

	props: ["ew"],
});

/**==================================================
 * Chat message
 **/

Vue.component("chat-message", {
	template: `<div class="chat-row" :class="{['msg-' + message.fromType]:true,['msg-' + message.type]:true}">
				<div class="pfp">{{userPfp}}</div>
				<div class="chat-bubble" :class="{user:message.fromUser}" v-html="message.text">
				
				</div>
			 
			</div>`,

	mounted() {
		// console.log(this.message)
	},
	computed: {
		userPfp() {
			// console.log("get pfp", this.bot.getPfp(this.message.fromType, this.message.from))
			return this.bot.getPfp(this.message.fromType, this.message.from)
		},
	},

	props: ["message", "bot"],
});

/**==================================================
 * Chat window
 **/
Vue.component("chat", {
	template: ` <div class="chat">
				<section class="chat-messages" ref="messageholder">
					
					<chat-message v-for="msg in messages" :message="msg" :bot="bot" />
				 
				</section>
				
				<section class="chat-controls">	

					<input v-model="currentInput" @keyup.enter="send()" /><button @click="send()">▶</button>
					<div class="chip-holder">
						<button v-for="chip in chips" @click="send(chip)">{{chip}}</button>
					</div>

				</section>
			</div>`,

	watch: {
		messages() {
			// console.log("MESSAGES UPDATES")
			let messageholderEl = this.$refs.messageholder
			// console.log(this.$refs, messageholderEl)

			// console.log("scroll to bottom")
			Vue.nextTick(() => {
				messageholderEl.scrollTo({ top: messageholderEl.scrollHeight, behavior: 'smooth' })

			}) 
			 
		}
	},

	computed: {
		bot() {
			return this.chatBots[0]
		},
		chips() {
			// chatBots[0]
      return this.bot.map.chips || ["hi"]
			// return ["a", "b", "hi"]
		}
	},
	methods: {
		send(overwrite) {
			let text = overwrite || this.currentInput
			
			text = text.trim()
			if (text.length > 0) {
				// Send a message from the user's side
				this.messages.push({
					type: "chat",
					fromType: "human",
					text: text
				});
				this.currentInput = "";

				// Send to the bot
				if (this.bot)
					this.bot.input(text)
			}
		},
	},

	mounted() {
// 		this.send("sda")
// 		this.send("sda")
// 		this.send("sda")
// 		this.send("sdaf sda I cannot agree with you, papa; you know I cannot. Mr. Weston is such a good-humoured, pleasant, excellent man, that he thoroughly deserves a good wife;--and you would not have had Miss Taylor live with us for ever, and bear all my odd humours, when she might have a house of her own?")

// 		console.log(this.messages)
	},
	data() {
		return {
			currentInput: "",
		};
	},

	props: ["messages", "chatBots"],
});
