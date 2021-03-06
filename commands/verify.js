var fs = require("fs");
var ldap = require("ldapjs");

var helpers = require("../helpers/helpers.js");

const ldapClient = ldap.createClient({
  url: "ldap://ldap.internal"
});

const ldapSecret = fs.readFileSync("/etc/ldap.secret", "utf-8");

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

        ldapClient.bind("cn=root,ou=ldap,o=redbrick", ldapSecret, function(err) {
            if (err) {
                receivedMessage.channel.send(helpers.embedify(bot,"Could not connect to Redbrick LDAP server, please contact a member of Committee."));
            } else {
                ldapClient.search("o=redbrick", searchOptions, function(error, result) {
                    result.on("searchEntry", function(entry) {
                        if (entry.object.altmail == args[1]) {
                            const serverNumber = fs.readFileSync("/etc/discord.server.number", "utf-8").replace(/\n$/, "");
                            const memberRole = fs.readFileSync("/etc/discord.member.role", "utf-8").replace(/\n$/, "");
                            bot.guilds.get(serverNumber).members.get(receivedMessage.author.id).addRole(memberRole);
                            receivedMessage.channel.send(helpers.embedify(bot, "Verified!"));
                        } else {
                            receivedMessage.channel.send(helpers.embedify(bot,"Username and Email Address do not match."));
                        }
                    });
                });    
            }
        });
    }
};
