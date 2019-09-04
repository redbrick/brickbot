# Contributing

It's kind of tough to work on this in regards to development. So there's one of two ways we go about this.

### As a Redbrick member

 If you're a member of Redbrick (and I can check if you actually are) then I suggest getting in touch privately and I'll sort you out in regards to development where brickbot is hosted from. 

### As a non-Redbrick member

If you aren't a Redbrick member you're obviously still welcome to help out! It's probably easiest for you to work on this by [setting up your own Discord server](https://www.howtogeek.com/364075/how-to-create-set-up-and-manage-your-discord-server/). Once you've done that you'll need to [create a bot account](https://discordpy.readthedocs.io/en/latest/discord.html). This involves creating a token for your bot. The brickbot code specifies that this token is found at `/tmp/brickbot.token` but you can change this to anywhere on your local machine for development purposes.

---

### Setting up

Clone the project with:

> git clone https://github.com/theycallmemac/brickbot.git

From here you can install the dependencies (don't worry there aren't many) like so:

> yarn

You can run the bot by using:

> node bot.js

You can also run it as a systemd service if you want, checkout the `brickbot.service` file and make changes where appropriate.

If you don't want to run on bare-metal, then Docker is your friend and there's a docker-compose to utilise by running:

> docker-compose up -d
 
### Getting your command into production

Let's say you have a command you want to add, well this is the section which clarifies how you go about doing that.

All the code for the commands is hosted at faas.jamesmcdermott.ie as a cluster of serverless functions. Each one of these functions can be found on a given http endpoint. You can try this one out with just `curl`, it should return a link to a random page on the Redbrick wiki:

> curl faas.jamesmcdermott.ie/function/wiki

As said in the README, you can write this is any language! The hosted wiki command is written in Python, the hosted isitup command is written in Bash, and the bus and luas commands actually use a Node.js api to query, which is a little anti-serverless, but also not really. I'm digressing. Essentially yes no matter what language you prefer, it can be used to extend brickbot functionality!

So, let's say you have code, in a repo or a gist for example, all you need to do is tell me where that code lives. I'll take care of it from there, I just need the location. 

Once this part is done it's pretty trivial. Let's run through an example of adding a command called "coinflip".

1. Add a `coinflip.js` file in the `commands` directory where the function is inside `module.exports`. There's a few examples of this.
2. Your command needs to make http request to the endpoint at which the code is hosted, in this case it's at `faas.jamesmcdermott.ie/function/coinflip`.
3. Based on the response you get back from the function, add your logic to handle it. there's a function called `receivedMessage.channel.send()` that is used to send your finalised output back to the channel.
4. If you need to write any command specific helper functions, you can just add them outside of module.exports in the same file.
5. If you need to write a non specific help function, you can add it to `helpers/helpers/js`.
6. Once it's all done, make sure to add your command to the big switch statement in `bot.js`, otherwise all your work wont ever get evaluated! While doing this make sure you also add a like help section to the switch statement in `commands/help.js`.
7. Add your command to the function list in `get_test_set_one` ([in this file](https://github.com/theycallmemac/brickbot/blob/master/tests/endpoints.py)) along with it's expected result of 0 to it's respective list.
8. Add the command and it's creator to the list of functions in the `README.md` file.

### Adding to my OpenFaaS functions

If you want to write some configs to be added to the instance of OpenFaaS I'm running, you can make a PR [here]
(https://github.com/theycallmemac/brickbot-faas)
