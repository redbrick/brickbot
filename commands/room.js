var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    roomCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "room", "!room LG26");
            return;
	}
	else if (args.length > 0) {
            request.post({
                url:     "https://brickbot.seanfradl.com/timetable/",
                body:    args
            },
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
	}
    }
};
