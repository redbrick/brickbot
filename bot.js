const fs = require("fs");
const path = require("path");

const Discord = require("discord.js");
const commandDir = `${__dirname}/commands`;

const {
    argumentsUsedExample,
    embedify,
    tooManyArgs
} = require("./helpers/helpers.js");

require("dotenv").config();

const bot = new Discord.Client();
let commands = {};

fs.readdirSync(commandDir)
    .filter(file => !(RegExp("deprecated", "gi")).test(file))
    .forEach(function (file) {
    let command = require(path.join(commandDir, file))(bot);
    if(command.initCommand && command.initCommand()) {
        commands[command.opts.name] = command;
    }
});

bot.on("message", (receivedMessage) => {
    if (receivedMessage.author === bot.user) {
        return;
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }
});

function testAndExecute(command, args) {
    const commandOpts = command.opts;
    const {args: commandArgs} = commandOpts;
    const {help: commandHelp} = commandOpts;

    if (
        args.length >= commandArgs.required &&
        args.length <= commandArgs.required + commandArgs.optional
    ) {
        return command.execute();
    }
    else {
        switch (false) {
            case !args.length < commandArgs.required:
                return argumentsUsedExample(bot, commandHelp);
            case !args.length > commandArgs.require + commandArgs.optional:
                return tooManyArgs(bot, commandHelp);
            default:
                return `command: ${commandOpts.name} - ${commandHelp.blurb}\nusage: ${commandOpts.help.example}`;
        }
    }
}

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let args = splitCommand.slice(1);

    console.log("Command received: " + primaryCommand);
    console.log("args: " + args);

    const {channel} = receivedMessage;

    console.log(commands[primaryCommand]);

    if (commands[primaryCommand]) {
        channel.send(testAndExecute(commands[primaryCommand], args));
    }
    else {
        channel.send(
            embedify(
                bot,
                `I don't understand the command.
                    Try \`!help [command]\``
            )
        );
    }
}

const bot_secret_token = typeof process.env.DISCORD_SECRET_FILE !== "undefined"
    ? fs.readFileSync(process.env.DISCORD_SECRET_FILE, "utf-8").replace(/\n$/, "")
    : process.env.DISCORD_SECRET;

bot.login(bot_secret_token);
