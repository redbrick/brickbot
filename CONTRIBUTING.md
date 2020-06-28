# Contributing

It's kind of tough to work on this in regards to development. So there's one of two ways we can go about this.

### As a Redbrick member

 If you're a member of Redbrick (and We will check if you actually are) then We suggest getting in touch privately and We'll sort you out in regards to development where brickbot is hosted from. 

### As a non-Redbrick member

If you aren't a Redbrick member you're obviously still welcome to help out! It's probably easiest for you to work on this by [setting up your own Discord server](https://www.howtogeek.com/364075/how-to-create-set-up-and-manage-your-discord-server/). Once you've done that you'll need to [create a bot account](https://discordpy.readthedocs.io/en/latest/discord.html). This involves creating a token for your bot. The brickbot code specifies that this token is found at `/etc/brickbot.token` but you can change this to anywhere on your local machine for development purposes.

---

### Setting up

Clone the project with:

> git clone https://github.com/theycallmemac/brickbot.git

Next you should install the dependencies using:

> yarn install

the bot can be ran locally using

> node bot.js

If you're doing development - it would be possible to also use `nodemon`, this will watch your fs for changes to the codebase and automatically start the bot

### Environment variables

Starting the bot requires some environment variables to be set, to get started, it's best to copy the `.env.sample` to `.env` and modify from there

> `cp .env.sample .env`

The only mandatory variables are, and should only ever be, `DISCORD_SECRET` or `DISCORD_SECRET_FILE`, all other vars should fail softly in their given commands


### The anatomy of a command:

For an update version see `Command.js`

This is the base version of a command:

```js
class Command {
    constructor(bot, opts) {
        this.bot = bot;
        this.opts = {
            args: {
                required: 0,
                optional: 0
            },
            help: {
                blurb:   "Command placeholder",
                example: "!command"
            },
            name: "command",
            ...opts
        };
    }

    initCommand() {
        // Connect to service, create database, etc.
        return true;
    }

    execute() {
        return helpers.embedify(
            this.bot,
            "Some command output"
        );
    }
}
```

Any services that a command uses should be connected to in the `initCommand` function. The command should return true if the services are available and connection succeeds, and false if not.

If a service becomes unreachable, the command response should reflect this. All commands shall have their status checked periodically, if a command depends on a services it should use the `ServiceConsumerCommand`, which will have a flag for failing connections. these commands shall be reinitialized on a scaling interval of no less than 30 seconds, and no more than daily 

Services consumed by brickbot should be soft failures and self healing to minimize downtime.
