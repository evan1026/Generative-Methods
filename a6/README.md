# A6: Chatbot

## Your name
Evan Allan

## Your Glitch link
[my page](https://evan1026-a6.glitch.me)


## Describe your bot's character
The bot is rude and tries to make you go away

## How does the user know what to say to this bot How are you solving the blank slate problem?
The bot starts by asking you a yes/no question

## How have your styled your page to best present this character? What scene or mood are you suggesting?
The mood I'm going for is looking like a text message conversation to feel like you're being attacked

## Describe the first thing this bot can respond to.  What is the expressive range of what you say in response?
The bot can respond to the answer to its question, so the first response is for if you say yes. It asks if
you want to hear a riddle, so if you say yes it will ask the riddle.

## Describe the second thing this bot can respond to
If you say no to the riddle, it will get mad and ask you to leave


## Describe the third thing this bot can respond to
When you are asked the riddle, it can respond to you getting the answer right by congratulating you
and then asking you if you want to hear another riddle


## Describe the fourth thing this bot can respond to
If you get the riddle wrong, it will berate you and then ask you to leave


## Describe the fifth thing this bot can respond to
If you say you want to hear another riddle, it will say too bad and ask you to leave



## What states does this bot move through? Is this a common social script? Why do the states connect like that?
origin -> riddle - if the user wants a riddle
       -> origin - if the user doesn't respond correctly
       -> rude - if the user doesn't want a riddle

riddle -> riddle2 - if the user gets it right
       -> goaway - if the user gets it wrong

riddle2 -> goaway - if the user wants another riddle
        -> rude - if the user doesn't want another riddle
        -> riddle2 - if the user doesn't respond correctly

rude -> goaway

goaway -> goaway


## In what ways does your bot obey or subvert the Gricean maxims
quantity - I guess it mostly subverts it in that the bot keeps telling the user to leave over and over
quality - Subverts because the bot makes it seem like an innocent riddle but then uses it to berate the user
relation - Nothing said is irrelevant
manner - The bot is not clear at all about what it wants in the beginning

## What 3 other bots did you look at? What was interesting, notable or useful about them?
The bots in the example code were useful in learning how the system worked

## List any resources (code, images, etc) you've used, and where you got them from

## List any help you got from classmates or websites, so that you can remember it for later
