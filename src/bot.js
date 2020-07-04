// Std lib packages
const fs = require("fs");
const path = require("path");
// External packages
const Discord = require("discord.js");
const JWT = require("jsonwebtoken");
const NodeMailer = require("nodemailer");
// Our libs
const {
    argumentsUsedExample,
    embedify,
    tooManyArgs
} = require("./helpers/helpers.js");
// Load .env file info into process.env
//  will clobber anything set in the parent environment
require("dotenv").config();
// Constants
const commandDir = `${__dirname}/commands`;
const client_secret_token = typeof process.env.DISCORD_SECRET_FILE !== "undefined"
    ? fs.readFileSync(process.env.DISCORD_SECRET_FILE, "utf-8").replace(/\n$/, "")
    : process.env.DISCORD_SECRET;

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

class BrickBot {
    constructor() {
        this.discordClient = new Discord.Client();
        // Unlike the discord client - the mail client only auths on send.
        //  email is transactional like that
        this.mailClient = NodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: Boolean(process.env.MAIL_SECURE), // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASS, // generated ethereal password
            },
        });
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

        const clientLoginPromise = this.discordClient.login(client_secret_token)
            .catch(err => Log.error(`Error logging into discord: ${err}`))
            .finally(() => Log.log("Logged into discord"));

        return Promise.all([commandReadPromise, clientLoginPromise])
            .then(() => Log.log("Bot ready"))
            .catch(err => Log.error(err))
            .finally(() => this.bindListeners());
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
            let ret = this.testAndExecute(
                this.commands[primaryCommand],
                args
            );
            return this.commands[primaryCommand].isDM
                ? author.send(ret)
                : channel.send(ret);
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

    async tokenFactory(discordUsername, claimedUsername, claimedEmail) {
        return new Promise(function (resolve, reject) {
            return JWT.sign(
                {
                    discordUsername,
                    claimedUsername,
                    claimedEmail,
                    claimedDate: (new Date()).toUTCString()
                },
                process.env.JWT_SECRET,
                {
                    // End of the current academic year can be defined as after May
                    expiresIn: `${(new Date()).getUTCFullYear()}-06-01T00:00:00Z`
                },
                function (err, token) {
                    if(err) reject(err);
                    resolve(token);
                }
            );
        });
    }

    bindListeners() {
        this.discordClient.on("message", (receivedMessage) => {
            if (receivedMessage.author === this.discordClient.user) {
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
