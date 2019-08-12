var Discord = require("discord.js");
var request = require("request");
var fs = require("fs");

var bot = new Discord.Client();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LISTEN AND PARSE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", (receivedMessage) => {
	if (receivedMessage.author == bot.user) { 
		return;
	}
	if (receivedMessage.content.startsWith("!")) {
		processCommand(receivedMessage);
	}
});

function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1);
	let splitCommand = fullCommand.split(" ");
	let primaryCommand = splitCommand[0];
	let args = splitCommand.slice(1);

	console.log("Command received: " + primaryCommand);
	console.log("args: " + args);

        switch (primaryCommand) {
            case "help":
                helpCommand(args, receivedMessage);
                break;
            case "bus":
                busCommand(args, receivedMessage);
                break;
            case "coinflip":
                coinflipCommand(args, receivedMessage);
                break;
            case "isitup":
                isItUpCommand(args, receivedMessage);
                break;
            case "luas":
                luasCommand(args, receivedMessage);
                break;
            case "nslookup":
                nslookupCommand(args, receivedMessage);
                break;
            case "pwgen":
                pwgenCommand(args, receivedMessage);
                break;
            case "pwned":
                pwnedCommand(args, receivedMessage);
                break;
            case "ssl":
                sslCommand(args, receivedMessage);
                break;
            case "wiki":
                wikiCommand(args, receivedMessage);
                break;
            default:
                receivedMessage.channel.send("I don't understand the command. Try `!help [command]`");
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOT COMMAND FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function helpCommand(args, receivedMessage) {
	if (args.length > 1) {
		receivedMessage.channel.send("Please specify one single command. Try `!help [command]`");
	} else if (args.length == 1) {
            switch (args) {
                case "bus":
                    receivedMessage.channel.send(embedify(`bus - check the schedule of a Dublin Bus stop.\n\nExample: '!bus 1635'\n\n
                                                        The nearest bus stops to DCU are 7516 (The Helix) and 37 (Ballymun Road).`));
                break;
                case "coinflip":
                    receivedMessage.channel.send(embedify("coinflip - toss a coin.\n\nExample: '!coinflip'"));
                    break;
                case "isitup":
                    receivedMessage.channel.send(embedify("isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"));
                    break;
                case "luas":
                    receivedMessage.channel.send(embedify("luas - check the schedule of a Luas stop.\n\nExample: '!luas harcourt'"));
                    break;
                case "nslookup":
                    receivedMessage.channel.send(embedify("nslookup - uses nslookup to return any IP address info on domains.\n\nExample: '!nslookup redbrick.dcu.ie'"));
                    break;
                case "pwgen":
                    receivedMessage.channel.send(embedify("pwgen - uses pwgen to generate a password and privately send it to you.\n\nExample: '!pwgen'`"));
                    break;
                case "pwned":
                    receivedMessage.channel.send(embedify("pwned - check if an email has been pwned.\n\nExample: '!pwned bertie@redbrick.dcu.ie'"));
                    break;
                case "ssl":
                    receivedMessage.channel.send(embedify("ssl - check the certificate info of a website.\n\nExample: '!ssl redbrick.dcu.ie'"));
                    break;
                case "wiki":
                    receivedMessage.channel.send(embedify("wiki - return a random page from wiki.redbrick.dcu.ie.\n\nExample: '!wiki'"));
                    break;
            }
        } else {
            receivedMessage.channel.send(embedify("Here is the list of brickbot commands:\n • bus \n • coinflip\n • isitup\n • luas\n • nslookup\n • pwgen\n • pwned\n • ssl\n • help\n • wiki"));
        }
}

function busCommand(args, receivedMessage) {
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "stop", "!bus 7571");
		return;
	}
	else if (args.length > 0) {
		request.post({
                    url:     "https://faas.jamesmcdermott.ie/function/transport",
                    body:    "127.0.0.1:8000/bus/stop/" + args
                }, function(error, response, body) {
                        var buses = JSON.parse(body).departures;
                        var schedule = "";
                        for(var n in buses){
                            var parsed = busParseTime(buses[n].MonitoredCall_ExpectedArrivalTime.substring(11, 16).split(":"));
                            var timeTo = busGetTimeTo(parsed[0], parsed[1], parsed[2], parsed[3]);
                            schedule += (buses[n].MonitoredVehicleJourney_PublishedLineName + " (" + buses[n].MonitoredVehicleJourney_DestinationName + ") - " + timeTo + "\n");
                        }
                        receivedMessage.channel.send(embedify(schedule));
                }); 
	}
}

function coinflipCommand(args, receivedMessage) {
	request.get({
		url:     "https://faas.jamesmcdermott.ie/function/coinflip",
	}, function(error, response, body) {
		receivedMessage.channel.send(embedify("Came up " + body));
	}); 
}

function isItUpCommand(args, receivedMessage) {
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "URL", "!isitup redbrick.dcu.ie");
		return;
	}
	else if (args.length > 0) {
		request.post({
                    url:     "https://faas.jamesmcdermott.ie/function/isitup",
                    body:    args
                }, function(error, response, body) {
                    receivedMessage.channel.send(embedify(body));
                }); 
        }
}

function luasCommand(args, receivedMessage) {
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "stop", "!luas harcourt");
		return;
	}
	else if (args.length > 0) {
		request.post({
                    url:     "https://faas.jamesmcdermott.ie/function/transport",
                    body:    "127.0.0.1:8000/luas/stop/" + args
                }, function(error, response, body) {
                    var schedule = luasScheduleBuilder(body);
                    receivedMessage.channel.send(embedify(schedule));
		}); 
	}
}

function nslookupCommand(args, receivedMessage) {
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "URL", "!nslookup redbrick.dcu.ie");
		return;
	}
	else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/nslookup",
			body:    args
		}, function(error, response, body) {
			receivedMessage.channel.send(embedify(body));
		});
	}
}

function pwgenCommand(args, receivedMessage) {
	request.get({
		url:     "https://faas.jamesmcdermott.ie/function/pwgen",
	}, function(error, response, body) {
		receivedMessage.author.send(embedify("Generated Password: " + body));
	});
}

function pwnedCommand(args, receivedMessage) {
	var email = args;
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "email", "!pwned bertie@redbrick.dcu.ie");
		return;
	} else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/haveibeenpwned",
			body:    args
		}, function(error, response, body) {
			var n = JSON.parse(body).found;
			if (n == 0) { 
                            receivedMessage.channel.send(embedify(email + " has not been pwned"));
                        } else {
                            receivedMessage.channel.send(embedify(email + " has been pwned"));
                        }
                });
        } 
}

function sslCommand(args, receivedMessage) {
	if (args.length == 0) {
		argumentsUsedExample(receivedMessage, "URL", "!ssl redbrick.dcu.ie");
		return;
	}
	else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/certinfo",
			body:    args
		}, function(error, response, body) {
			receivedMessage.channel.send(embedify(body));
		});
	}
}

function wikiCommand(args, receivedMessage) {
	if (args.length > 0) {
                noArgumentsUsedExample(receivedMessage, "!wiki");
		return;
	}
	else if (args.length == 0) {
		request.get({
			url:     "https://faas.jamesmcdermott.ie/function/wiki",
		}, function(error, response, body) {
			receivedMessage.channel.send(embedify(body));
		});
	}  
}

var bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, "");
bot.login(bot_secret_token);




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function embedify(contents) {
	return {embed: {
		color: 0xAA0202,
		author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                },
                description: contents,
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© Redbrick"
                }
            }
        };
}

function argumentsUsedExample(receivedMessage, required, command) {
    receivedMessage.channel.send(embedify("No " + required + " supplied. " + "Try `" + command + "`"));
}

function noArgumentsUsedExample(receivedMessage, command) {
    receivedMessage.channel.send(embedify("Too many arguments supplied. Try `" + command + "`"));
}

function busParseTime(arr) {
	var date = new Date(); var h = date.getHours(); var m = date.getMinutes();
	return [parseInt(arr[0]), h, parseInt(arr[1]), m];
}

function busGetTimeTo(hr, h, min, m) {
	var hour = hr - h - 2;
	var minute; 
	var timeTo;
	if (min - m < 0){
		minute = 60 + (min - m);
	} else {
		minute = min - m;
	}
	if (hour <= 0 && minute == 0) {
		timeTo = "Due";
	} else if (hour <= 0) {
		timeTo = minute + " mins";
	} else {
		timeTo = hour + " hr " + minute + " mins";
	}
	return timeTo;
}

function luasScheduleBuilder(body) {
	try {
		var stopName = JSON.parse(body).stop;
		var directions = JSON.parse(body).direction;
		var schedule = "";
		schedule += "Stop Name: " + stopName + "\n\n";
		for(var direction in directions){
			var details = directions[direction];
			schedule += "> " + details.name + "\n";
			for (var tram in details.tram) {
				var journey = "";
				var mins = details.tram[tram].dueMins;
				var destination = details.tram[tram].destination;
				if (mins != undefined && destination != undefined) {
					if (mins == "DUE") {
						journey += "   • " + destination + " - " + mins + "\n";
					} else {
						journey += "   • " + destination + " - " + mins + " mins\n";
					}
				} else {
					journey += "   • No trams forecast\n";
				}
				schedule += journey;
			}
		}
		return schedule;
	} catch (err) {
            return "That stop doesn't exist.";
	}
}

