var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    isitupCommand: function(bot, args, receivedMessage) {
	if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "URL", "!isitup redbrick.dcu.ie");
            return;
	}
	else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/isitup",
                body:    args
            },
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            }); 
        }
    }
};
