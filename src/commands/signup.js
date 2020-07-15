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
        const emailOrStudentID = args.pop();
        const username = args.pop();

        // Sanitize.username(username);
        // Sanitize.emailOrStudentID(emailOrStudentID);

        if(!Sanitize.username(username)) {
            return Utils.embed(
                this.bot,
                "Username not valid: must be between 2 and 8 characters inclusive"
                + `and only include alphanumeric characters '${username}'`
            );
        }

        if(!Sanitize.emailOrStudentID(emailOrStudentID)) {
            return Utils.embed(
                this.bot,
                Sanitize.studentID(emailOrStudentID)
                    ? "Student ID not valid. Should be all numbers and longer than 2 digits"
                    : "Email not valid: Should be a valid DCU email"
            );
        }

        return Utils.embed(
            this.bot,
            "No: not yet"
        );
    }
}

module.exports = SignUp;
