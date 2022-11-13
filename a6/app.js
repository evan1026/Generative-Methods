/**
 * Starter code
 * Chat application with a bot
 */

/* globals Vue, p5, BOT_MAPS, BotSimulator */

window.addEventListener("load", function () {
	//------------------------------------------------------
	//------------------------------------------------------
	//------------------------------------------------------
	//------------------------------------------------------
	// VUE!!!
	// Create a new vue interface



	new Vue({
		template: `<div id="app">
			
			<section class="bot-data">
			 
				<select v-model="mapID" >
					<option v-for="(map,id) in maps">{{id}}</option>
				</select>
				
				<bot-debug v-for="bot in chatBots" :bot="bot" />
			</section>

		 <chat :chatBots="chatBots" :messages="messages" :class="{['bot-' + mapID]:true}" />
			
		 
		</div>`,
   

		mounted() {
//       Create a new simulated agent for this bot
		 this.setUser(0, this.mapID)

			setInterval(() => {
				let t = Date.now()*.001
				this.chatBots.forEach(bot => bot.update(t))
			}, 50);
		},
		
		watch: {
			map() {
				console.log("Map changed")
				this.setUser(0, this.mapID)
        this.messages = []
        localStorage.setItem("a6-mapID", this.mapID)
			}
		},
		
		computed: {
			
			// The current bot
			map() {
				return this.maps[this.mapID]
			}
		},

		methods: {
			setUser(index, mapID) {
			let messages = this.messages

			// Create a new bot, with this info
			let bot = new BotSimulator(mapID, 
				this.maps[mapID], 
				{
					startTime: Date.now()*.001,
					onPost(message) {
						messages.push(message)
					}
				})
			Vue.set( this.chatBots, index, bot)
			},
			
		},

		data() {
      let last = localStorage.getItem("a6-mapID")
      console.log(last)
			return {
				chatBots: [],
				mapID:  last || Object.keys(BOT_MAPS)[0],
				maps: BOT_MAPS,
				messages: [],
				name: "Kate",
				currentMsg: "",
			};
		},
		el: "#app",
	});
});
