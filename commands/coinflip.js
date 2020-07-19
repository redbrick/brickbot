var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    coinflipCommand: function (bot, args, receivedMessage) {
        if (args.length > 0) {
            helpers.noArgumentsUsedExample(bot, receivedMessage, "!coinflip");
        }
        else if (args.length == 0) {
            request.get({
                url:     "https://faas.jamesmcdermott.ie/function/bash-collection",
                body:    "-f coinflip.sh"
            }, 
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, "Came up " + body));
            });
        }
    }
};
