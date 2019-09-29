module.exports = {
    argumentsUsedExample: function (bot, receivedMessage, required, example) {
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
                    name: "brickbot",
                    icon_url: "https://images-ext-2.discordapp.net/external/U96vTgPVOO4aF73RHF1HdfGTEbx4LDqbuALdp2VTBA0/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/601104306132746251/16890e5b329b7088868f42e3ada368a9.png"
		},
		description: contents,
		timestamp: new Date(),
		footer: {
                    icon_url: "https://images-ext-2.discordapp.net/external/U96vTgPVOO4aF73RHF1HdfGTEbx4LDqbuALdp2VTBA0/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/601104306132746251/16890e5b329b7088868f42e3ada368a9.png",
                    text: "© Redbrick"
                }
            }
	};
    }
};
