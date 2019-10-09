module.exports = {
    argumentsUsedExample: function(bot, receivedMessage, required, example) {        
        receivedMessage.channel.send(module.exports.embedify(bot, `No ${required} supplied. Try ${example}`));
    },
    noArgumentsUsedExample: function(bot, receivedMessage, example) {
        receivedMessage.channel.send(module.exports.embedify(bot, `Too many arguments supplied. Try ${example}`));
    },
    embedify: function(bot, contents) {
	return {embed: 
            {
                color: 0xAA0202,
                author: {
                    name: bot.user.username,
                    icon_url: bot.user.avatarURL
                },
                description: contents,
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© Redbrick"
                }
            }
	};
    }
};
