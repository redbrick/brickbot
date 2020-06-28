const helpers = require("../helpers/helpers.js");
const Command = require("../Command");

class CoinFlip extends Command {
    constructor(bot) {
        super(bot, {
            help: {
                blurb: "This command performs a coinflip in the cloud for all you indecisive people",
                example: "!coinflip"
            },
            name: "coinflip"
        });
    }

    execute() {
        return helpers.embedify(
            this.bot,
            "Came up " + `${Math.random() >= 0.5 ? "heads" : "tails"}`
        );
    }
}

module.exports = (bot) => new CoinFlip(bot);
