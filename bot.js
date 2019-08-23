var Discord = require("discord.js");
var fs = require("fs");

var path = require("path");
var __dirname = path.resolve() + "/home/bots/brickbot/commands";
fs.readdirSync(__dirname).forEach(function (file) {
  module.exports[path.basename(file, ".js")] = require(path.join(__dirname, file));
});

var commands = module.exports;
var helpers = require("./helpers/helpers.js");
var bot = new Discord.Client();

bot.on("message", (receivedMessage) => {
    if (receivedMessage.author == bot.user) { 
        return;
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    }
});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let args = splitCommand.slice(1);

    console.log("Command received: " + primaryCommand);
    console.log("args: " + args);

    switch (primaryCommand) {
        case "help":
            commands.help.helpCommand(bot, args, receivedMessage);
            break;
        case "bus":
            commands.bus.busCommand(bot, args, receivedMessage);
            break;
        case "coinflip":
            commands.coinflip.coinflipCommand(bot, args, receivedMessage);
            break;
        case "isitup":
            commands.isitup.isItUpCommand(bot, args, receivedMessage);
            break;
        case "luas":
            commands.luas.luasCommand(bot, args, receivedMessage);
            break;
        case "nslookup":
            commands.nslookup.nslookupCommand(bot, args, receivedMessage);
            break;
        case "pwgen":
            commands.pwgen.pwgenCommand(bot, args, receivedMessage);
            break;
        case "pwned":
            commands.pwned.pwnedCommand(bot, args, receivedMessage);
            break;
        case "room":
            commands.room.roomCommand(bot, args, receivedMessage);
            break;
        case "ssl":
            commands.ssl.sslCommand(bot, args, receivedMessage);
            break;
        case "uptime":
            commands.uptime.uptimeCommand(bot, args, receivedMessage);
            break;
        case "wiki":
            commands.wiki.wikiCommand(bot, args, receivedMessage);
            break;
        default:
            receivedMessage.channel.send(helpers.embedify(bot, "I don't understand the command. Try `!help [command]`"));
    }
}

var bot_secret_token = fs.readFileSync("/tmp/brickbot.token", "utf-8").replace(/\n$/, "");
bot.login(bot_secret_token);
