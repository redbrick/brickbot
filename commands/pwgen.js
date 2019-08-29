var request = require("request");
var helpers = require("../helpers/helpers.js");

module.exports = {
    pwgenCommand: function(bot, args, receivedMessage) {
	request.get({
            url:     "https://faas.jamesmcdermott.ie/function/pwgen",
	}, 
        function(error, response, body) {
            receivedMessage.author.send(helpers.embedify(bot, "Generated Password: " + body));
	});
    }
};
