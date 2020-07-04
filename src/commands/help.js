const helpers = require("../helpers/helpers.js");
const Command = require("../Command");

class Help extends Command {
    constructor(bot) {
        super(bot, {
            args: {
                optional: 1
            },
            help: {
                // eslint-disable-next-line max-len
                blurb: "This command can be used to get the full list of commands, or given and argument, the help information for that command",
                example: "!help <optional command>"
            },
            name: "help"
        });
    }

    execute(args) {
        const commands = this.bot.commands;
        let ret = Object.keys(commands)
            .sort()
            .map((key) => {
                const commandBlurb = commands[key].opts.help.blurb;
                const commandName = commands[key].opts.name;
                return `\`${commandName}\`\n└ ${commandBlurb}`;
            })
            .join("\n");

        if (args.length === 1) {
            const command = commands[args[0]];
            if(command) {
                const {name, help} = command.opts;
                ret = `\`${name}\`: ${help.blurb}\n\n**Example**:\n\`\`\`${help.example}\`\`\``;
            }
            else {
                ret = "command not found";
            }
        }

        ret = helpers.embedify(
            this.bot,
            ret
        );

        return ret;
    }
}

module.exports = Help;
