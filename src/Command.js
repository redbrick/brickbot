const helpers = require("./helpers/helpers.js");

class Command {
    constructor(bot, opts) {
        this.bot = bot;
        this.opts = {
            args: {
                required: 0,
                optional: 0
            },
            help: {
                blurb:   "Command placeholder",
                example: "!command"
            },
            isDM: false,
            name: "command",
            ...opts
        };
    }

    initCommand() {
        // Connect to service, create database, etc.
        return true;
    }

    execute() {
        return helpers.embedify(
            this.bot,
            "Some command output"
        );
    }
}

module.exports = Command;
