module.exports = {
    argumentsUsedExample: function (receivedMessage, required, example) {
        return self.embedify(`No ${required} supplied. Try ${example}`);
    },
    noArgumentsUsedExample: function(receivedMessage, example) {
        return self.embedify(`Too many arguments supplied. Try ${example}`);
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
