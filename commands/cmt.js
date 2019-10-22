var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    cmtCommand: function(bot, args, receivedMessage) {
            request.post({
                url:     "https://brickbot.seanfradl.com/cmt",
                body:    args
            },
            function(error, response, body) {
                receivedMessage.channel.send(helpers.embedify(bot, body));
            });
	}
};
