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
    } else if (primaryCommand == "bus") {
        busCommand(arguments, receivedMessage)
    } else if (primaryCommand == "coinflip") {
        coinflipCommand(arguments, receivedMessage)
    } else if (primaryCommand == "isitup") {
        isItUpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "luas") {
        luasCommand(arguments, receivedMessage)
    } else if (primaryCommand == "nslookup") {
        nslookupCommand(arguments, receivedMessage)
    } else if (primaryCommand == "pwgen") {
        pwgenCommand(arguments, receivedMessage)
    } else if (primaryCommand == "pwned") {
        pwnedCommand(arguments, receivedMessage)
    } else if (primaryCommand == "ssl") {
        sslCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help [command]`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 1) {
        receivedMessage.channel.send("Please specify one single command. Try `!help [command]`")
    } else if (arguments.length == 1) {
            if (arguments == "bus") {
                
	    	receivedMessage.channel.send(codify("bus - check the schedule of a Dublin Bus stop.\n\nExample: '!bus 1635'\n\nThe nearest bus stops to DCU are 7516 (The Helix) and 37 (Ballymun Road)."))
	    } else if (arguments == "coinflip") {
	    	receivedMessage.channel.send(codify("coinflip - toss a coin.\n\nExample: '!coinflip'"))
	    } else if (arguments == "isitup") {
	    	receivedMessage.channel.send(codify("isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"))
            } else if (arguments == "luas") {
	    	receivedMessage.channel.send(codify("luas - check the schedule of a Luas stop.\n\nExample: '!luas harcourt'"))
            } else if (arguments == "nslookup") {
	    	receivedMessage.channel.send(codify("nslookup - uses nslookup to return any IP address info on domains.\n\nExample: '!nslookup redbrick.dcu.ie'"))
	    } else if (arguments == "pwgen") {
	    	receivedMessage.channel.send(codify("pwgen - uses pwgen to generate a password and privately send it to you.\n\nExample: '!pwgen'`"))
	    } else if (arguments == "pwned") {
	    	receivedMessage.channel.send(codify("pwned - check if an email has been pwned.\n\nExample: '!pwned bertie@redbrick.dcu.ie'"))
            } else if (arguments == "ssl") {
                receivedMessage.channel.send(codify("ssl - check the certificate info of a website.\n\nExample: '!ssl redbrick.dcu.ie'"))
            }
    } else {
        receivedMessage.channel.send(codify("Here is the list of brickbot commands:\n • bus \n • coinflip\n • isitup\n • luas\n • nslookup\n • pwgen\n • pwned\n • ssl\n • help"))
    }
}

function busCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No stop supplied. Try `!bus 7571`")
	return
    }
    else if (arguments.length > 0) {
	request.post({
	    url:     'https://faas.jamesmcdermott.ie/function/transport',
  	    body:    "127.0.0.1:8000/bus/stop/" + arguments
        }, function(error, response, body) {
	    buses = JSON.parse(body).departures
            var schedule = ""
            for(var n in buses){
                var parsed = busParseTime(buses[n].MonitoredCall_ExpectedArrivalTime.substring(11, 16).split(":"))
                var timeTo = busGetTimeTo(parsed[0], parsed[1], parsed[2], parsed[3])
                schedule += (buses[n].MonitoredVehicleJourney_PublishedLineName + " (" + buses[n].MonitoredVehicleJourney_DestinationName + ") - " + timeTo + "\n")
            }
            receivedMessage.channel.send(codify(schedule))
        }); 
    }
}

function coinflipCommand(arguments, receivedMessage) {
    request.get({
        url:     'https://faas.jamesmcdermott.ie/function/coinflip',
    }, function(error, response, body) {
        receivedMessage.channel.send(codify("Came up " + body))
    }); 
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
	    receivedMessage.channel.send(codify(body))
        }); 
    }
}

function luasCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No stop supplied. Try `!luas harcourt`")
        return
    }
    else if (arguments.length > 0) {
	request.post({
	    url:     'https://faas.jamesmcdermott.ie/function/transport',
  	    body:    "127.0.0.1:8000/luas/stop/" + arguments
        }, function(error, response, body) {
                schedule = luasScheduleBuilder(body)
                receivedMessage.channel.send(codify(schedule))
        }); 
    }
}

function nslookupCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!nslookup redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/nslookup',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(codify(body))
        });
    }
}

function pwgenCommand(arguments, receivedMessage) {
    request.get({
        url:     'https://faas.jamesmcdermott.ie/function/pwgen',
    }, function(error, response, body) {
        receivedMessage.author.send(codify("Generated Password: " + body))
    });
}

function pwnedCommand(arguments, receivedMessage) {
    email = arguments
    if (arguments.length == 0) {
	receivedMessage.channel.send("No email supplied. Try `!pwned bertie@redbrick.dcu.ie`")
        return
    } else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/haveibeenpwned',
            body:    arguments
        }, function(error, response, body) {
		n = JSON.parse(body).found
		if (n == 0) { 
                	receivedMessage.channel.send(codify(email + " has not been pwned"))
            	} else {
                	receivedMessage.channel.send(codify(email + " has been pwned"))
            	}
        });
    } 
}

function sslCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
	receivedMessage.channel.send("No URL supplied. Try `!ssl redbrick.dcu.ie`")
	return
    }
    else if (arguments.length > 0) {
        request.post({
            url:     'https://faas.jamesmcdermott.ie/function/certinfo',
            body:    arguments
        }, function(error, response, body) {
            receivedMessage.channel.send(codify(body))
        });
    }
}

bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, '')
bot.login(bot_secret_token)



////////////////////
// HELPER FUNCTIONS
///////////////////

function codify(contents) {
	return "```" + contents + "```"
}

function busParseTime(arr) {
    var date = new Date(); var h = date.getHours(); var m = date.getMinutes()
    var hr = parseInt(arr[0])
    var min = parseInt(arr[1])
    return [parseInt(arr[0]), h, parseInt(arr[1]), m]
}

function busGetTimeTo(hr, h, min, m) {
    var hour = hr - h - 2
    if (min - m < 0){
        var minute = 60 + (min - m)
    } else {
        var minute = min - m
    }
    if (hour <= 0 && minute == 0) {
        var timeTo = "Due"
    } else if (hour <= 0) {
        var timeTo = minute + " mins"
    } else {
        var timeTo = hour + " hr " + minute + " mins"
    }
    return timeTo
}

function luasScheduleBuilder(body) {
    try {
        var stopName = JSON.parse(body).stop
        var directions = JSON.parse(body).direction
        var schedule = ""
        schedule += "Stop Name: " + stopName + "\n\n"
        for(var direction in directions){
            details = directions[direction]
            schedule += "> " + details.name + "\n"
            for (tram in details.tram) {
                var journey = ""
                var mins = details.tram[tram].dueMins
                var destination = details.tram[tram].destination
                if (mins != undefined && destination != undefined) {
                    if (mins == "DUE") {
                        journey += "   • " + destination + " - " + mins + "\n"
                    } else {
                        journey += "   • " + destination + " - " + mins + " mins\n"
                    }
                } else {
                    journey += "   • No trams forecast\n"
                }
                schedule += journey
            }
        }
        return schedule
    } catch (err) {
        receivedMessage.channel.send(codify("That stop doesn't exist."))
        return
    }
}


