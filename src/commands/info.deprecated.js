var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    infoCommand: function(bot, args, receivedMessage) {
        if (args.length > 0) {
            helpers.noArgumentsUsedExample(bot, receivedMessage, "!info");
        }
        else if (args.length == 0) {
            request.get({
                url:     "https://faas.jamesmcdermott.ie/function/info",
            }, 
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
        }
    }
};
