var Discord = require("discord.js");
var request = require("request");
var fs = require("fs");

var bot = new Discord.Client();

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

	if (primaryCommand == "help") {
		helpCommand(args, receivedMessage);
	} else if (primaryCommand == "bus") {
		busCommand(args, receivedMessage);
	} else if (primaryCommand == "coinflip") {
		coinflipCommand(args, receivedMessage);
	} else if (primaryCommand == "wiki") {
		wikiCommand(args, receivedMessage);
	} else if (primaryCommand == "isitup") {
		isItUpCommand(args, receivedMessage);
	} else if (primaryCommand == "luas") {
		luasCommand(args, receivedMessage);
	} else if (primaryCommand == "nslookup") {
		nslookupCommand(args, receivedMessage);
	} else if (primaryCommand == "pwgen") {
		pwgenCommand(args, receivedMessage);
	} else if (primaryCommand == "pwned") {
		pwnedCommand(args, receivedMessage);
	} else if (primaryCommand == "ssl") {
		sslCommand(args, receivedMessage);
	} else {
		receivedMessage.channel.send("I don't understand the command. Try `!help [command]`");
	}
}

function helpCommand(args, receivedMessage) {
	if (args.length > 1) {
		receivedMessage.channel.send("Please specify one single command. Try `!help [command]`");
	} else if (args.length == 1) {
            if (args == "bus") {
                receivedMessage.channel.send(codify("bus - check the schedule of a Dublin Bus stop.\n\nExample: '!bus 1635'\n\nThe nearest bus stops to DCU are 7516 (The Helix) and 37 (Ballymun Road)."));
            } else if (args == "coinflip") {
                receivedMessage.channel.send(codify("coinflip - toss a coin.\n\nExample: '!coinflip'"));
            } else if (args == "isitup") {
                receivedMessage.channel.send(codify("isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"));
            } else if (args == "luas") {
                receivedMessage.channel.send(codify("luas - check the schedule of a Luas stop.\n\nExample: '!luas harcourt'"));
            } else if (args == "nslookup") {
                receivedMessage.channel.send(codify("nslookup - uses nslookup to return any IP address info on domains.\n\nExample: '!nslookup redbrick.dcu.ie'"));
            } else if (args == "pwgen") {
                receivedMessage.channel.send(codify("pwgen - uses pwgen to generate a password and privately send it to you.\n\nExample: '!pwgen'`"));
            } else if (args == "pwned") {
                receivedMessage.channel.send(codify("pwned - check if an email has been pwned.\n\nExample: '!pwned bertie@redbrick.dcu.ie'"));
            } else if (args == "ssl") {
                receivedMessage.channel.send(codify("ssl - check the certificate info of a website.\n\nExample: '!ssl redbrick.dcu.ie'"));
            } else if (args == "wiki") {
		        receivedMessage.channel.send(codify("wiki - return a random page from wiki.redbrick.dcu.ie.\n\nExample: '!wiki'"));
	    	}
        } else {
            receivedMessage.channel.send(codify("Here is the list of brickbot commands:\n • bus \n • coinflip\n • isitup\n • luas\n • nslookup\n • pwgen\n • pwned\n • ssl\n • help\n • wiki"));
        }
}

function busCommand(args, receivedMessage) {
	if (args.length == 0) {
		receivedMessage.channel.send("No stop supplied. Try `!bus 7571`");
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
                        receivedMessage.channel.send(codify(schedule));
                }); 
	}
}

function coinflipCommand(args, receivedMessage) {
	request.get({
		url:     "https://faas.jamesmcdermott.ie/function/coinflip",
	}, function(error, response, body) {
		receivedMessage.channel.send(codify("Came up " + body));
	}); 
}

function isItUpCommand(args, receivedMessage) {
	if (args.length == 0) {
		receivedMessage.channel.send("No URL supplied. Try `!isitup redbrick.dcu.ie`");
		return;
	}
	else if (args.length > 0) {
		request.post({
                    url:     "https://faas.jamesmcdermott.ie/function/isitup",
                    body:    args
                }, function(error, response, body) {
                    receivedMessage.channel.send(codify(body));
                }); 
        }
}

function luasCommand(args, receivedMessage) {
	if (args.length == 0) {
		receivedMessage.channel.send("No stop supplied. Try `!luas harcourt`");
		return;
	}
	else if (args.length > 0) {
		request.post({
                    url:     "https://faas.jamesmcdermott.ie/function/transport",
                    body:    "127.0.0.1:8000/luas/stop/" + args
                }, function(error, response, body) {
                    var schedule = luasScheduleBuilder(body);
                    receivedMessage.channel.send(codify(schedule));
		}); 
	}
}

function nslookupCommand(args, receivedMessage) {
	if (args.length == 0) {
		receivedMessage.channel.send("No URL supplied. Try `!nslookup redbrick.dcu.ie`");
		return;
	}
	else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/nslookup",
			body:    args
		}, function(error, response, body) {
			receivedMessage.channel.send(codify(body));
		});
	}
}

function pwgenCommand(args, receivedMessage) {
	request.get({
		url:     "https://faas.jamesmcdermott.ie/function/pwgen",
	}, function(error, response, body) {
		receivedMessage.author.send(codify("Generated Password: " + body));
	});
}

function pwnedCommand(args, receivedMessage) {
	var email = args;
	if (args.length == 0) {
		receivedMessage.channel.send("No email supplied. Try `!pwned bertie@redbrick.dcu.ie`");
		return;
	} else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/haveibeenpwned",
			body:    args
		}, function(error, response, body) {
			var n = JSON.parse(body).found;
			if (n == 0) { 
                            receivedMessage.channel.send(codify(email + " has not been pwned"));
                        } else {
                            receivedMessage.channel.send(codify(email + " has been pwned"));
                        }
                });
        } 
}

function sslCommand(args, receivedMessage) {
	if (args.length == 0) {
		receivedMessage.channel.send("No URL supplied. Try `!ssl redbrick.dcu.ie`");
		return;
	}
	else if (args.length > 0) {
		request.post({
			url:     "https://faas.jamesmcdermott.ie/function/certinfo",
			body:    args
		}, function(error, response, body) {
			receivedMessage.channel.send(codify(body));
		});
	}
}

function wikiCommand(args, receivedMessage) {
	if (args.length > 0) {
		receivedMessage.channel.send("Too many arguments. Try '!wiki' on it's own (New features on the way!)");
		return;
	}
	else if (args.length == 0) {
		request.get({
			url:     "https://faas.jamesmcdermott.ie/function/wiki",
		}, function(error, response, body) {
			receivedMessage.channel.send(codify(body));
		});
	}  
}

var bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, "");
bot.login(bot_secret_token);



////////////////////
// HELPER FUNCTIONS
///////////////////

function codify(contents) {
	return "```" + contents + "```";
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

