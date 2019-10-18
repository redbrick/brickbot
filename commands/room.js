var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    roomCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "room", "!room GLA.LG26");
            return;
	}
	else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/dcurooms",
                body:    args
            },
            function(error, response, body) {
                if (error) {
		    receivedMessage.channel.send(helpers.embedify(bot, "Couldn't retrieve information"));
                } else {
		    receivedMessage.channel.send(helpers.embedify(bot, body));
		}
            });
	}
    }
};
