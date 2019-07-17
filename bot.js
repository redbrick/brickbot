const Discord = require('discord.js')
const request = require('request');
const fs = require("fs");

const bot = new Discord.Client();

bot.on('message', (receivedMessage) => {
    if (receivedMessage.author == bot.user) { 
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "isitup") {
        isItUpCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 1) {
        receivedMessage.channel.send("Please specify one single command. Try `!help [command]`")
    } else if (arguments.length == 1) {
	    if (arguments == "isitup") {
	    	receivedMessage.channel.send("_isitup_ - check if a site is up or down.\nExample: `!isitup redbrick.dcu.ie`")
	    }
    } else {
        receivedMessage.channel.send("Here is the list of brickbot commands:\n • isitup\n • help")
    }
}

function isItUpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!isitup redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/isitup',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(body)
        });
    }
}

bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, '')
bot.login(bot_secret_token)
