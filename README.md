# brickbot

A simple bot for the new Redbrick Discord.

### How it works

brickbot is very simple. All Brickbot needs to do is make HTTP Requests to functions I run using [OpenFaas](https://github.com/openfaas/faas). This means that no matter what your preferred language is you're able to extend the functionality of brickbot. All I need to do is take your code, and add it to my Docker Swarm.

If you're interested in OpenFaas I really recommend trying it out. Serverless is something worth learning in my opinion.


### Contributing

Like I said, it's really easy to extend brickbot. You can help make this bot better by either:

1. suggesting new functionality
2. implementing new functionality

If you're suggesting new functionality feel free to make an issue detailing:
- the name of the command
- a brief description of the command
- any links to repositories that might do something similar to what you're describing

If you're implementing functionality:
- make a PR with the relevant code added to bot.js
- ensure your PR has a link to the code you want deployed with OpenFaas (I'll make sure it is deployed)
- add the command and it's creator to the list of functions below

### Current Functions

- [coinflip](https://gist.github.com/theycallmemac/f66b0afeca215df97869dd28612bea74) by [theycallmemac](https://github.com/theycallmemac/)
- [isitup](https://github.com/theycallmemac/isitup) by [theycallmemac](https://github.com/theycallmemac/)
- [nslookup](https://github.com/JockDaRock/nslookup_faas) by [JockDaRock](https://github.com/JockDaRock)
- [pwgen](https://github.com/openfaas/faas/tree/master/sample-functions/pwgen) by [alexisellis](https://github.com/alexellis)
- [pwned](https://github.com/openfaas/faas/tree/master/sample-functions/haveibeenpwned) by [alexisellis](https://github.com/alexellis)
- [ssl](https://github.com/stefanprodan/openfaas-certinfo) by [stefanprodan](https://github.com/stefanprodan)
