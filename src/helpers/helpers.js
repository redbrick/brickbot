function argumentsUsedExample(bot, receivedMessage, required, example) {
    return embedify(bot, `No ${required} supplied. Try ${example}`);
}

function embedify(bot, contents) {
    const {discordClient} = bot;
    return {
        embed: {
            color: 0xAA0202,
            author: {
                name: discordClient.user.username,
                icon_url: discordClient.user.avatarURL
            },
            description: contents,
            timestamp: new Date(),
            footer: {
                icon_url: discordClient.user.avatarURL,
                text: "© Redbrick"
            }
        }
    };
}

function tooManyArgs(bot, example) {
    return embedify(bot, `Too many arguments supplied, try:\n\`${example}\``);
}

module.exports = {
    argumentsUsedExample,
    embedify,
    tooManyArgs,
};
