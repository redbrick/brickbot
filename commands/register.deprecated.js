var helpers = require("../helpers/helpers.js");

module.exports = {
    registerCommand: function(bot, args, receivedMessage) {
        receivedMessage.author.send(
            helpers.embedify(
                bot,
                "To verify, run the following command:\n\n '!verify your-redbrick-username your-dcu-email-address")
        );
    }
};
