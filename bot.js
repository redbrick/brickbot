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

class Log {
    static error(str) {
        const dt = new Date();
        process.env.debug
            ? console.trace(`${dt.toLocaleDateString()}[${dt.toLocaleTimeString()}]: ${str}`)
            : console.trace(str);
    }
    static log(str) {
        const dt = new Date();
        process.env.debug
            ? console.info(`${dt.toLocaleDateString()}[${dt.toLocaleTimeString()}]: ${str}`)
            : console.info(str);
    }
}

const client_secret_token = typeof process.env.DISCORD_SECRET_FILE !== "undefined"
    ? fs.readFileSync(process.env.DISCORD_SECRET_FILE, "utf-8").replace(/\n$/, "")
    : process.env.DISCORD_SECRET;

class BrickBot {
    constructor() {
        this.client = new Discord.Client();
        this.commands = {};
    }

    async build() {
        const commandReadPromise = fs.promises.readdir(commandDir)
            .then(files => {
                let commands = {};
                files.filter(file => !(RegExp("deprecated", "gi")).test(file))
                    .forEach((file) => {
                        let commandClass = require(path.join(commandDir, file));
                        let command = new commandClass(this);
                        if(command.initCommand && command.initCommand()) {
                            commands[command.opts.name] = command;
                        }
                    });
                this.commands = commands;
            })
            .catch(err => Log.error(`Error reading command dir: ${err}`))
            .finally(() => Log.log("Commands loaded"));

        const clientLoginPromise = this.client.login(client_secret_token)
            .catch(err => Log.error(`Error logging into discord: ${err}`))
            .finally(() => Log.log("Logged into discord"));

        return Promise.all([commandReadPromise, clientLoginPromise])
            .then(() => Log.log("Bot ready"))
            .catch(err => Log.error(err))
            .finally(() => this.bindListeners());
    }

    testAndExecute(command, args) {
        const commandOpts = command.opts;
        const {args: commandArgs} = commandOpts;
        const {help: commandHelp} = commandOpts;

        if (args.length < commandArgs.required)
            return argumentsUsedExample(this, commandHelp);
        else if (args.length > commandArgs.required + commandArgs.optional)
            return tooManyArgs(this, commandHelp.example);
        else
            return command.execute(args);
    }

    processCommand(receivedMessage) {
        let fullCommand = receivedMessage.content.substr(1);
        let splitCommand = fullCommand.split(" ");
        let primaryCommand = splitCommand[0];
        let args = splitCommand.slice(1);

        const {author, channel} = receivedMessage;
        Log.log(`${author.username}#${author.discriminator} - ID: ${author.id}`);
        Log.log(`  Command received: ${primaryCommand}`);
        Log.log(`  args: ${args.length ? args : "None Supplied"}`);

        if (this.commands[primaryCommand]) {
            return channel.send(this.testAndExecute(
                this.commands[primaryCommand],
                args
            ));
        }
        else {
            return channel.send(
                embedify(
                    this,
                    `I don't understand the command.
                    Try \`!help [command]\``
                )
            );
        }
    }

    bindListeners() {
        this.client.on("message", (receivedMessage) => {
            if (receivedMessage.author === this.client.user) {
                return;
            }
            if (receivedMessage.content.startsWith("!")) {
                this.processCommand(receivedMessage)
                    .catch(err => Log.error(`Error processing message: ${receivedMessage}\n${err}`));
            }
        });
    }
}

new BrickBot().build()
    .catch(err => `Error constructing brickbot: \n${err}`);
