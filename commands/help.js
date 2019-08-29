var helpers = require("../helpers/helpers.js");

module.exports = {
    helpCommand: function (bot, args, receivedMessage) {
	if (args.length > 1) {
		receivedMessage.channel.send(helpers.embedify(bot, "Please specify one single command. Try `!help [command]`"));
	} else if (args.length == 1) {
            switch (args[0]) {
                case "bus":
                    receivedMessage.channel.send(helpers.embedify(bot, "bus - check the schedule of a Dublin Bus stop.\n\nExample: '!bus 1635'\n\nThe nearest bus stops to DCU are 7516 (The Helix) and 37 (Ballymun Road)"));
                    break;
                case "coinflip":
                    receivedMessage.channel.send(helpers.embedify(bot, "coinflip - toss a coin.\n\nExample: '!coinflip'"));
                    break;
                case "isitup":
                    receivedMessage.channel.send(helpers.embedify(bot, "isitup - check if a site is up or down.\n\nExample: '!isitup redbrick.dcu.ie'"));
                    break;
                case "luas":
                    receivedMessage.channel.send(helpers.embedify(bot, "luas - check the schedule of a Luas stop.\n\nExample: '!luas harcourt'"));
                    break;
                case "nslookup":
                    receivedMessage.channel.send(helpers.embedify(bot, "nslookup - uses nslookup to return any IP address info on domains.\n\nExample: '!nslookup redbrick.dcu.ie'"));
                    break;
                case "pwgen":
                    receivedMessage.channel.send(helpers.embedify(bot, "pwgen - uses pwgen to generate a password and privately send it to you.\n\nExample: '!pwgen'`"));
                    break;
                case "pwned":
                    receivedMessage.channel.send(helpers.embedify(bot, "pwned - check if an email has been pwned.\n\nExample: '!pwned bertie@redbrick.dcu.ie'"));
                    break;
                case "room":
                    receivedMessage.channel.send(helpers.embedify(bot, "room - provides timetable information for a specified room or building in DCU.\n\nExample: '!room GLA.LG26'"));
                    break;
                case "ssl":
                    receivedMessage.channel.send(helpers.embedify(bot, "ssl - check the certificate info of a website.\n\nExample: '!ssl redbrick.dcu.ie'"));
                    break;
                case "uptime":
                    receivedMessage.channel.send(helpers.embedify(bot, "uptime - check the uptime of brickbot.\n\nExample '!uptime'"));
                    break;
                case "wiki":
                    receivedMessage.channel.send(helpers.embedify(bot, "wiki - return a random page from wiki.redbrick.dcu.ie.\n\nExample: '!wiki'"));
                    break;
            }
        } else {
            receivedMessage.channel.send(helpers.embedify(bot, "Here is the list of brickbot commands:\n • bus \n • coinflip\n • isitup\n • luas\n • nslookup\n • pwgen\n • pwned\n • room\n • ssl\n • uptime\n • wiki\n • help\n"));
        }
    }
};
