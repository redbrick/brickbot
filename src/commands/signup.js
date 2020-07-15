const {
    Sanitize,
    Utils
} = require("../helpers/helpers.js");
const Command = require("../Command");

class SignUp extends Command {
    constructor(bot) {
        super(bot, {
            args: {
                required: [
                    "email",
                    "username"
                ]
            },
            help: {
                blurb: "This command provides a registration path to redbrick DCU",
                example: "!signup myuser firstname.lastname@mail.dcu.ie"
            },
            isDM: true,
            name: "signup"
        });
    }

    execute(args) {
        const username = args.pop();
        Sanitize.username(username);
        const email = args.pop();
        Sanitize.email(email);

        return Utils.embed(
            this.bot,
            `
            \`\`\`!verify <your-redbrick-username> <your-dcu-email-address>\`\`\`
            If you are not a member and would like to register, please run this instead
            \`\`\`!signup <your-desired-redbrick-username> <your-dcu-email-address>\`\`\` `
        );
    }
}

module.exports = SignUp;
