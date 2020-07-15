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
    static email() {

    }
    static username() {

    }
}

module.exports = {
    Utils,
    Responses,
    Sanitize
};
