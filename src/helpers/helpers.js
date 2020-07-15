const assert = require("assert").strict;

class Utils {
    static embed(bot, contents) {
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

    static humanList(lst, finalConjunction) {
        assert(Array.isArray(lst), "passed list was not an array");
        assert(typeof finalConjunction === "string", "finalConjunction passed was not a string");

        lst = lst.map(item => `\`<${item}>\``);

        const last = lst.pop();

        if(lst.length === 0) {
            return last;
        }

        return `${lst.join(",")}, ${finalConjunction} ${last}`;
    }

    // Right to left clobbering merge
    static mergeObj() {
        if (arguments.length === 1) {
            return arguments[0];
        }
        let args = Array.from(arguments).slice();
        args.forEach(arg => {
            if(typeof arg !== "object") {
                throw (new Error("Non object passed to mergeObj"));
            }
        });
        // Merge next object into this one.
        //  pop will copy the values so no need to manually make
        //  this a new copy
        let src = args.pop();
        let dest = args.pop();

        Object.keys(src).forEach((key) => {
            if(typeof src[key] !== "object") {
                // Fill from right side
                //  right immutable value clobbers left
                dest[key] = src[key];
            } else {
                if (Array.isArray(dest[key]) && Array.isArray(src[key])) {
                    dest[key] = dest[key].concat(src[key]);
                } else {
                    dest[key] = Utils.mergeObj(dest[key], src[key]);
                }
            }
        });

        args = args.concat(dest);
        return Utils.mergeObj(...args);
    }

    static testAll(lst) {
        return lst.reduce((l, r) => l && r, true);
    }
}

class Responses {
    static tooManyArgs(bot, example) {
        return Utils.embed(bot, `Too many arguments supplied!\n\nTry:\n\`${example}\``);
    }

    static argumentsUsedExample(bot, receivedMessage, required, example) {
        return Utils.embed(bot, `No ${Utils.humanList(required, "or")} supplied! \n\nTry:\n\`${example}\``);
    }
}

class Sanitize {
    static email(candidate) {
        // This will test for valid dcu student email in the expected form:
        //  first.last123@mail.dcu.ie
        //  first.last@mail.dcu.ie
        let studentEmailRegExp = RegExp("[a-zA-Z]+\\.[a-zA-Z]+[0-9]+@mail\\.dcu\\.ie", "gi");
        // This will test for a valid dcu other/staff email in expected form:
        //  entity@dcu.ie
        let staffEmailRegExp = RegExp(".+@(?:.+\\.)*dcu\\.ie", "gi");
        // Other formats can be added the same way
        return studentEmailRegExp.test(candidate)
            || staffEmailRegExp.test(candidate);
    }

    static emailOrStudentID(candidate) {
        return Sanitize.email(candidate)
            || Sanitize.studentID(candidate);
    }

    static studentID(candidate) {
        // Should be a little speed op but there is a chance I guess that this student IDs may some day be longer
        const studentIDRegExp = RegExp("^[0-9]{2,32}$", "gi");
        return studentIDRegExp.test(candidate);
    }

    static username(candidate) {
        const usernameRegExp = RegExp("^[a-zA-Z0-9]{2,9}$", "gm");
        return usernameRegExp.test(candidate);
    }
}

module.exports = {
    Utils,
    Responses,
    Sanitize
};
