var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    luasCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            helpers.argumentsUsedExample(receivedMessage, "stop", "!luas harcourt");
            return;
        }
        else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/transport",
		body:    "127.0.0.1:8000/luas/stop/" + args
            },
            function(error, response, body) {
                var schedule = luasScheduleBuilder(body);
		receivedMessage.channel.send(helpers.embedify(bot, schedule));
            });
	}
    }
};

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
