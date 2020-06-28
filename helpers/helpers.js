function argumentsUsedExample(bot, receivedMessage, required, example) {
    return embedify(bot, `No ${required} supplied. Try ${example}`);
}

function embedify(bot, contents) {
    return {
        embed: {
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

function tooManyArgs(bot, example) {
    return embedify(bot, `Too many arguments supplied. Try ${example}`);
}

module.exports = {
    argumentsUsedExample,
    embedify,
    tooManyArgs,
};
