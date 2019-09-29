var helpers = require("../helpers/helpers.js");
var fs = require("fs");
module.exports = {
    verifyCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            receivedMessage.channel.send("!verify your-redbrick-username your-dcu-email-address");
            return;
	}
	else if (args.length > 0) {
            const exec = require("child_process").exec;
            exec("/home/brickbot/verify " + args[0] + "| grep altmail", (error, stdout, stderr) => {
                console.log(error, stderr);
                var altmail = stdout.trim().split(":")[1];
                if (args[1] == altmail.trim()) {
                    var serverNumber = fs.readFileSync("/tmp/discord.server.number", "utf-8").replace(/\n$/, "");
                    var memberRole = fs.readFileSync("/tmp/discord.member.role", "utf-8").replace(/\n$/, "");
                    bot.guilds.get(serverNumber).members.get(receivedMessage.author.id).addRole(memberRole);
                    receivedMessage.channel.send(helpers.embedify(bot, "Verified!"));
                } else {
                    receivedMessage.channel.send(helpers.embedify(bot, "username and email address do not match"));
                }
                console.log(args[1], altmail);
            });
	}
    }
};
