var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    pwgenCommand: function(bot, args, receivedMessage) {
        if (args.length > 0) {
            helpers.noArgumentsUsedExample(bot, receivedMessage, "!pwgen");
        }
        else if (args.length == 0) {
            request.get({
                url:     "https://faas.jamesmcdermott.ie/function/bash-collection",
                body:    "-f pwgen.sh"
            }, 
            function(error, response, body) {
                receivedMessage.author.send(helpers.embedify(bot, "Generated Password: " + body));
            });
        }
    }
};
