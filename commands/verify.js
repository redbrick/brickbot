var fs = require("fs");
var ldap = require('ldapjs');

var helpers = require("../helpers/helpers.js");

var client = ldap.createClient({
  url: 'ldaps://ldap.internal:389'
});

const ldapSecret = fs.readFileSync('/etc/ldap.secret');
const sanitizer = /[^a-zA-Z0-9]/gi;

let verifyCommand = (bot, args, receivedMessage) => {
  if (args.length == 0) {
    receivedMessage.channel
      .send("!verify your-redbrick-username your-dcu-email-address");
    return;
  }
  client.bind('cn=root,ou=ldap,o=redbrick', ldapSecret,function(err) {
    client.compare(
      `uid=${args[0].replace(sanitizer, '')}`,
      'altmail',
      arg[1].replace(sanitizer, ''),
      (err, matched) => {
        if (!err) {
          console.log(matched);
          const serverNumber = fs
            .readFileSync("/tmp/discord.server.number", "utf-8")
            .replace(/\n$/, "");
          const memberRole = fs
            .readFileSync("/tmp/discord.member.role", "utf-8")
            .replace(/\n$/, "");
          bot.guilds
            .get(serverNumber)
            .members
            .get(receivedMessage.author.id).addRole(memberRole);
          receivedMessage.channel
            .send(helpers.embedify(bot, "Verified!"));
        } else {
          receivedMessage.channel
            .send(helpers.embedify(
              bot,
              "username and email address do not match")
            );
        }
      }
    );
  });
}

module.exports = {
  verifyCommand
};
