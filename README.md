# Ethereum Roulette

A Proof of Concept casino roulette, deployed on the ropsten network.

**Table of contents**

- [Motivation](#motivation)
- [How to play](#how-to-play)
- [Randomness](#randomness)
- [Security](#security)
- [Clone repo](#clone-repo)

### Motivation

I decided to learn more about developing smart contracts, and since I learn by
building stuff, so I decided to implement a casino roulette, with the business
logic being implemented in Solidity, the language of choice to develop smart
contracts in the Ethereum blockchain.

The frontend is a regular html page, with the web3 javascript library, which
makes it possible to interact with the Ethereum blockchain via javascript.
The web3 library is injected in the page by the Chrome extension
[Metamask](https://metamask.io/).

### How to play

You’ll have to use the Metamask Chrome extension installed, have an account
on the ropsten network, have some ether (get some
[here](http://faucet.ropsten.be:3001/) or [here](https://faucet.metamask.io/),
and visit the dapp url:

[http://ethereum-roulette.ga](http://ethereum-roulette.ga)

Every bet has a fixed amount of 0.01 ether (around €6) and you can bet:

- On a number (0 to 36), with a payout of 36;
- On a dozen (1-12, 13-24, 25-36), with a payout of 3;
- On a color (black or red), with a payout of 2;
- If the number is even or odd, with a payout of 2;
- On a column (left, middle or right), with a payout of 3.

The roulette just accepts a bet when has sufficient funds to pay for it
and every other active bet.

Different people can be playing at the same time.

One of the players will click the “Spin Wheel” button, which will generate
a random number and all bets will be dealt with accordingly.

When a player wins a bet, the payout is credited on his personal account.
The player can, at any moment, click the “Cash out” button and receive
their winnings. Be advised that, at a particular moment, the roulette
could have insufficient funds to pay winnings for all players. Continue
reading to understand why this could happen.

### Randomness

True randomness is not possible in the Ethereum Virtual Machine (EVM), due to
the way the virtual machine operates. When a smart contract is called, every
node in the network will have to run the code, to validate it, and at the end
the state must be the same for every node (consensus). If, hypothetically,
there would be a true random function available, then, when every node call it,
it would spill a different value, making it impossible to achieve consensus.

So, we have to use the current state of the blockchain to find a fair random
number, and the formula I choose was to calculate the hash of several factors,
and use the reminder of the division of that hash by 37. The factors used in
the hash are:

- The blockhash of the previous block
- The current block timestamp
- The current block difficulty
- The last accepted bet

The problem with this approach is that everyone who can see the state of the
blockchain, can calculate ("guess") the future random number, and bet on that
number.

### Security

So, the first security measure implemented was to make the random number
dependable on the last bet. So, if for example, an attacker calculates that the
random number will be13, by betting on 13 he will change the outcome of the
random number, making this type of attack ineffective.

But an attacker could make an inverted attack, by betting on a number and then
waiting for the state of the blockchain to be one that generates that specific
number. For this attack to work, the attacker must fulfill 2 conditions:

1. be able to control when is the spin of the wheel;
2. be able to accurately guess the next random number.

Condition one is difficult, because anyone can spin the wheel, but there will
be times where the attacker will be the only one on the roulette, making it
possible. With an average time per block of 14.4 seconds, and for a bet with a
payout of 36, on average the attacker will have to be alone in the roulette for
37 * 14.4 / 60 ~=  9 minutes.

Condition two, is harder. Two of the factors used in calculating the
“random” number refer to the current block, that will only be known
**with** the spinning of the wheel, thus making it impossible to guess the
“random” number. The problem is that, even unknown, the values of the
current block timestamp and difficulty are strongly predictable, and even
worse, can be manipulated by a miner.

In a nutshell, for a regular player will be very hard to guess the random
number, but the system is vulnerable to attacks by miners. So additional
security measures were put in place.

**Balance cap**

Every time the wheel is spinned, and all payouts credited in the players
accounts, the system verifies if the roulette balance is higher than 2 ether.
If so, it send the excess to the contract owner (me). This way, the maximum
amount of ether an attacker could steal is of 3 ether (a full roulette with 2
ether, plus 100 bets of 0.01 ether).

Bear in mind that the personal accounts of players (their respective winnings)
are not taking in consideration when calculating the balance. In other words,
a player could have more than 2 ether in their winnings accounts, but be unable
to cash out since the roulette hasn’t sufficient funds to pay.

This is intended to prevent a Denial of Service attack, where a player could
have all the roulette money in his winnings account, preventing other players
to play. It's players responsability to be aware of this, and cash out
frequently.

### Clone repo

You can clone the repo and running it on your own private network.

**What you’ll need**

- Ganache: you can download a self-contained prebuilt Ganache binary for your platform of choice using the "Download" button on the [Ganache website](http://truffleframework.com/ganache/). After, run it and keep it running, this will deploy a private Ethereum network on your machine, port 7545.
- npm: follow [this instructions](https://www.npmjs.com/get-npm) to install npm

**How to lunch the ethereum roulette on your machine**

Clone the repo from github:

    git clone https://github.com/bordalix/ethereum-roulette.git
    cd ethereum-roulette
    npm install

Deploy the contract to your private blockchain (provided by Ganache):

    truffle deploy --reset

Run the webserver

    npm run dev

You now have the ethereum roulette on [http://localhost:4000](http://localhost:4000).

Have fun. 
