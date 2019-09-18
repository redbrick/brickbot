var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    infoCommand: function(bot, args, receivedMessage) {
	request.get({
            url:     "https://faas.jamesmcdermott.ie/function/info",
	}, 
        function(error, response, body) {
            receivedMessage.channel.send(helpers.embedify(bot, body));
	});
    }
};
