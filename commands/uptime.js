var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    uptimeCommand: function(bot, args, receivedMessage) {
        if (args.length > 0) {
            helpers.noArgumentsUsedExample(bot, receivedMessage, "!uptime");
            return;
        }
        else if (args.length == 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/uptime",
                body:    String(bot.uptime / 1000)
            }, 
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
	}
    }
};
