const Command = require("Command");
const helpers = require("./helpers/helpers");

const timeoutMax = 86400;

class ServiceConsumerCommand extends Command {
    constructor(bot, opts, serviceOpts) {
        super(bot, {
            ...opts
        });

        this.opts.service = {
            retries: 0,
            timeout: 60,
            ...serviceOpts
        };
    }

    // To be used by execute in the event that execution fails due to a service being down.
    handleDisconnect() {
        const {timeout} = this.opts.service;
        setTimeout(this.initCommand, timeout);
    }

    initCommand() {
        // Connect to service, create database, etc.
        this.opts.service.retries++;
        this.opts.service.timeout = this.opts.service.timeout * 2;

        // If successful please reset the timeout
        return true;
    }

    execute() {
        return helpers.embedify(
            this.bot,
            "Some command output"
        );
    }
}

module.exports = ServiceConsumerCommand;
