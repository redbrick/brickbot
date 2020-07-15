var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    wikiCommand: function(bot, args, receivedMessage) {
        if (args.length > 0) {
            helpers.noArgumentsUsedExample(bot, receivedMessage, "!wiki");
            return;
	} else if (args.length == 0) {
            request.get({
                url:     "https://faas.jamesmcdermott.ie/function/wiki",
            }, function(error, response, body) {
                receivedMessage.channel.send(Utils.embed(bot, body));
            });
	}   
    }
};
