var fs = require("fs");
var ldap = require("ldapjs");

var helpers = require("../helpers/helpers.js");

const ldapdiscordClient = ldap.creatediscordClient({
  url: process.env.LDAP_HOST
});

const ldapSecret = typeof process.env.LDAP_SECRET_FILE !== "undefined"
    ? fs.readFileSync(process.env.LDAP_SECRET_FILE, "utf-8")
    : process.env.LDAP_SECRET;

module.exports = {
    verifyCommand: function(bot, args, receivedMessage) {
        if (args.length == 0) {
            receivedMessage.channel.send("!verify your-redbrick-username your-dcu-email-address");
            return;
        }

        const searchOptions = {
            scope: "sub",
            filter: (`uid=${args[0]}`)
        };

        ldapdiscordClient.bind("cn=root,ou=ldap,o=redbrick", ldapSecret, function(err) {
            if (err) {
                receivedMessage.channel.send(
                    Utils.embed(
                        bot,
                        "Could not connect to Redbrick LDAP server, please contact a member of Committee."
                    )
                );
            } else {
                ldapdiscordClient.search("o=redbrick", searchOptions, function(error, result) {
                    result.on("searchEntry", function(entry) {
                        if (entry.object.altmail == args[1]) {
                            const serverNumber = fs.readFileSync(
                                "/etc/discord.server.number",
                                "utf-8"
                            ).replace(/\n$/, "");
                            const memberRole = fs.readFileSync("/etc/discord.member.role", "utf-8").replace(/\n$/, "");
                            bot.guilds.get(serverNumber).members.get(receivedMessage.author.id).addRole(memberRole);
                            receivedMessage.channel.send(Utils.embed(bot, "Verified!"));
                        } else {
                            receivedMessage.channel.send(
                                Utils.embed(bot,"Username and Email Address do not match.")
                            );
                        }
                    });
                });    
            }
        });
    }
};
