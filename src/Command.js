const {
    Utils
} = require("./helpers/helpers.js");

class Command {
    constructor(bot, opts) {
        this.bot = bot;
        this.opts = Utils.mergeObj({
            args: {
                required: [],
                optional: []
            },
            help: {
                blurb:   "Command placeholder",
                example: "!command"
            },
            isDM: false,
            name: "command"
        }, opts);
    }

    initCommand() {
        // Connect to service, create database, etc.
        return true;
    }

    execute() {
        return Utils.embed(
            this.bot,
            "Some command output"
        );
    }
}

module.exports = Command;
