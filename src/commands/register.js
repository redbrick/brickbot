const {
    Utils
} = require("../helpers/helpers.js");
const Command = require("../Command");

class Register extends Command {
    constructor(bot) {
        super(bot, {
            help: {
                blurb: "This command acts as your key to the discord server",
                example: "!register"
            },
            isDM: true,
            name: "register"
        });
    }

    execute() {
        return Utils.embed(
            this.bot,
            `To verify, run the following command:
            \`\`\`!verify <your-redbrick-username> <your-dcu-email-address>\`\`\`
            If you are not a member and would like to register, please run this instead
            \`\`\`!signup <your-desired-redbrick-username> <your-dcu-email-address>\`\`\` `
        );
    }
}

module.exports = Register;
