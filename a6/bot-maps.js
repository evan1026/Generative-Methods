const BOT_MAPS = {
  // A different brain, this one is for EMOJI
  emojiBot: {
    title: "Only speaks emoji",
    botPfp: "😬",
    humanPfp: "🌶",
    chips: ["😸", "🍞", "👋"],

    // TWO BIG THINGS: STATES, and GRAMMAR

    // Our Finite State Machine
    states: {
      // The state we start at
      origin: {
        // When we enter the state say this
        onEnterSay: ["I'm a bot #hello#"],
        exits: [
          // Exits have three things: conditions ->target actions
          // "wait:random(5,7) ->@ '#emoji##emoji##emoji#'",

          // Under what conditions can I take this exit?
          // 'stuff' take this exit if the user says "stuff"
          // '*' or says ANYTHING
          // Target: name of a state, or "@" go back in here
          // "'*' ->@ 'OOPs'",

          // Wait 2 seconds
          "wait:2 ->conversation '⏳ going to conversation mode'",
        ],

        // onExitSay: ["Good luck!"],
      },

      conversation: {
        exits: ["'👋' ->end '😭'", "'*' ->@ '#emoji#'"],
      },

      end: {
        onEnterSay: ["the end"],
      },
    },

    // GRAMMAR!!!
    grammar: {
      hello: ["👋", "😀"],
      story: ["#emoji# #emoji# #emoji# story"],
      emoji: ["#animal#", "#food#", "#heart#"],
      animal: ["🐧", "🐈", "🦒", "🐕", "🐿", "🐓", "🐁"],
      food: ["🍊", "🥞", "🥨", "🧀", "🌽", "🌶", "🍏"],
      heart: ["💕", "💜", "💙", "💔"],
    },
  },

  hauntedHouse: {
    title: "Only speaks emoji",
    botPfp: "🏚",
    humanPfp: "😬",
    chips: ["N", "E", "W", "S"],

    states: {
      origin: {
        onEnterSay: ["You are in a spooky house, you hear scary sounds to the east", 'some music starts <iframe width="560" height="315" src="https://www.youtube.com/embed/Z6ylGHfLrdI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'],
        
        exits: ["wait:20 ->died",
               "'N' ->room 'You explore north'",
               "'E' ->room 'You explore east'",
               "'W' ->room 'You explore west'",
               "'S' ->room 'You explore south'",
               ]
      },
      
       
      room: {
        onEnterSay: ["You are in a #roomAdjective# #roomType#"],
        exits: [
           "'N' ->room 'You explore north'",
               "'E' ->fight 'You see a #monster#'",
               "'W' ->room 'You explore west'",
               "'S' ->room 'You explore south'",
              "'look' ->@ '#spookyDiscovery#'"
        ]
      },
      
       fight: {
        onEnterSay: ["You lose the fight"],
         exits: [
          "wait:2 ->died",
          ]
      },
      
      died: {
        onEnterSay: ["You died", "☠️"],
      }
    },
    
    grammar: {
      object: ["kettle", "table", "chair", "desk", "lamp", "vase", "urn", "candelabra", "lantern", "idol", "orb", "book", "basket", "hammer", "flowerpot", "bicycle", "paintbrush", "goblet", "bottle", "jar", "toaster", "teacup", "teapot", "rug","basket", "thimble", "ottoman", "cushion", "pen", "pencil", "mug","egg", "chair", "sun", "cloud", "bell", "bucket", "lemon", "glove", "moon", "star", "seed", "card", "pancake", "waffle", "car", "train", "spoon", "fork", "potato"],
	  objAdj: ["wooden","old","vintage","woven", "antique","broken","tiny", "giant", "little", "upside-down","dented","imaginary","glowing","curséd","glittery","organic", "rusty", "multi-layered", "complicated", "ornate", "dusty", "gleaming", "fresh", "ancient", "forbidden", "milky", "upholstered", "comfortable", "dynamic", "solar-powered", "coal-fired", "warm", "cold", "frozen", "melted", "boxy", "well-polished", "vivid", "painted", "embroidered", "enhanced", "embellished", "collapsible", "simple", "demure"],
	
      spookyDiscovery: ["You find something scary:#objAdj# #object#"],
      roomType: ["living room", "bedroom", "conservatory", "cemetary", "kitchen"],
      roomAdjective: ["dusty", "abandoned", "blood-soaked", "ominous", "suspiciously normal"]
    },
  },

  myBot: {
    title: "Rude Bot",
    description: [
      "This bot is rude no matter what you do",
    ],
    chips: ["yes", "no"],

    states: {
      origin: {
        onEnterSay: "Do you want to hear a riddle?",
        exits: [
          "'yes' ->riddle",
          "'sure' ->riddle",
          "'ok' ->riddle",
          "'no' ->rude ",
          "'*' ->origin",
        ],
      },
      riddle: {
        onEnterSay: "#riddle#",
        exits: [
          "'me' ->riddle2",
          "'Me' ->riddle2",
          "'ME' ->riddle2",
          "'*' ->goaway '#wrong#! The answer is you! Now get out."
        ]
      },
      riddle2: {
        onEnterSay: "#correct#! Do you want to hear another riddle?",
        exits: [
          "'yes' ->goaway 'Too bad! Now go away please.'",
          "'sure' ->goaway 'Too bad! Now go away please.'",
          "'ok' ->goaway 'Too bad! Now go away please.'",
          "'no' ->rude ",
          "'*' ->riddle2",
        ],
      },
      rude: {
        onEnterSay: ["#rude#", "#rude#"],
        exits: [
          "wait:0 -> goaway",
        ],
      },
      goaway: {
        onEnterSay: "#goaway#",
        exits: [
          "'*' ->@ ",
        ],
      }

    },
    grammar: {
      goaway: [
        "Go away.",
        "I don't want to talk to you.",
        "Please leave.",
        "I'm not interested in this conversation anymore."
      ],
      rude: [
        "That's rude.",
        "Wow.",
        "I don't like you.",
        "You're mean."
      ],
      riddle: [
        "What's black and white and ugly all over?",
        "What comes once in a minute, twice in a moment, and won't leave me alone?",
        "It walks on four legs in the morning, two legs at noon, and sticks around when it's not welcome. What is it?",
        "The more you have of it, the more you want to get rid of it. What is it?"
      ],
      wrong: [
        "WRONG",
        "Nope",
        "Incorrect",
        "lol no"
      ],
      correct: [
        "DING DING DING",
        "Wow look at you, you got it",
        "I'm surprised you figured that out"
      ]
    },
  },
};
