var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    pwnedCommand: function(bot, args, receivedMessage) {
        var email = args;
	if (args.length == 0) {
            helpers.argumentsUsedExample(bot, receivedMessage, "email", "!pwned bertie@redbrick.dcu.ie");
            return;
	} else if (args.length > 0) {
            request.post({
                url:     "https://faas.jamesmcdermott.ie/function/haveibeenpwned",
                body:    args
            },
            function(error, response, body) {
		var n = JSON.parse(body).found;
		if (n == 0) { 
                    receivedMessage.channel.send(Utils.embed(bot, email + " has not been pwned"));
                } else {
                    receivedMessage.channel.send(Utils.embed(bot, email + " has been pwned"));
                }
            });
        } 
    }
};
