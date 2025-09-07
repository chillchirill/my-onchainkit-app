# Fund Ur Charity (FundUC)

**FundUC** is a new blockchain game that combines competition with real social impact. Players place strategic bids, each one increasing the shared pool. The last player to hold their bid before the timer runs out wins the game — not for themselves alone, but for a cause they care about. You can check out our Demo here: [link](), and the app here: [link](https://my-onchainkit-app-flax.vercel.app/)

The winner chooses how the funds are distributed: either donating a small share while keeping the rest, or sending 100% directly to a verified charitable organization of their choice. This way, every game session turns excitement and strategy into real-world support for meaningful causes.
# Rules
Rules are pretty simple: whoevers is the last biggest bidder in a game — wins! 
The game consists of: the initial balance, the time for which bets are accepted relative to the last bet, and the percentage by which the bets should increase relative to the previous one bet.

**Example**: 
Let's create a game where the initial bet is $1 and the percentage of increase = 8% and the waiting time is 1 hour.
We have the opportunity to beat the bet by giving a minimum of $1.08 and keep $2.08 until someone else beats our bet.
If 1 hour passes and no one has placed a bet during this time, then the game is officially over and whoever placed the last bet takes all the money. 

**Withdrawing**
The money is transferred to the organization chosen by the player, which is verified by us.
The game has two choices for how you can withdraw your funds.
You can keep 90% of the funds for yourself and give 10% to your favorite charity.
Or give 100% to your favorite charity.
# Technical aspects of use
This project uses **Ethereum Sepolia** and to participate in the game you need to get ethers from this network, I recommend using [Google Cloud Web3](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) to get the neccessary funds. The application heavily integrates a smart-wallet Coinbase. For more details, you can consult our codebase, which is GPLv3 compliant. It is worth noting that our choice of Sepolia was not random. In fact, integrating Sepolia with both UI and wallets was way tricker than expected. 

The UI was made using Next.js, and hosted on Vercel.

**Charitable organizations**
To track exactly where the funds went, We are giving you a list of accounts of organizations that have been granted permission to receive funds. Note: these are **NOT** real charity funds, these are here solely for testing purposes.

Address: **0x69544E4333A3df13681BAee491170B9120Ead60F**
Private Key: **0x5e6fc5cb251f6e5e0254439e741100521f2c9e970573f19448db78b93c05c064**
Mnemonic: **diamond tissue wear hungry usage hat fluid school wire maple maple two**

Address: **0x3B70D7D293baA136942b3b63d504eAd613FAb220**
Private Key: **0x906171e78b6c89e4802e49eee971363be9fef18926962e1e2ee9b05ddfacd2ad**
Mnemonic: **marriage safe mother urge evolve toe include leader catalog icon lawsuit then**

Address: **0x55bC40621605F656F68864bdbf0489E1cE06B640**
Private Key: **0x6c6ce75bc51ccf9eb2e1d594f5263dff6cb78f5790ba4841db26be05e08fd70a**
Mnemonic: **any work delay remind visa lyrics volume deliver purse liquid phone circle**

## UI/UX
![Create game](https://raw.githubusercontent.com/chillchirill/my-onchainkit-app/refs/heads/main/images/img4.png)
When you create a game you initiate a game activity and you have the opportunity to attract much more funds than your initial bet. You will have a choice of currency when choosing a dollar it will be converted to ether.
You can enter an amount only more than 100 gwei. 
Minimal increase can only be more than 0. The period can be from 1 second to 121 hours.

![Game](https://github.com/chillchirill/my-onchainkit-app/blob/main/images/img1.jpg?raw=true)
The bank is the money you claim. Minimal bet is the amount of money you need to claim the top spot in that particular game.
```minimal_bet = last_bet * ( 1 + percent )```

The **Bet minimum** button makes the minimum required bet. When the timer ends, it turns into **Get money** button and you will see methods to withdraw, if you are not the last depositor, it will simply not let you withdraw your funds.

![More info](https://raw.githubusercontent.com/chillchirill/my-onchainkit-app/refs/heads/main/images/img2.jpg)
**More info** gives you the opportunity to place a custom bet.
![Get money](https://raw.githubusercontent.com/chillchirill/my-onchainkit-app/refs/heads/main/images/img3.jpg)
By **Get money** you can choose exactly how you want to receive or redirect funds from your winnings.

## Integration with Base.
At first, our goal was to wrap our ready app as a Base MiniApp, which can be accessed in the beta version of the Base app. At first, the developer experience was a bit confusing, but we managed to figure stuff out. 

In the end, our app was successful in connecting to the Sepolia ETH testnet, and reading the blockchain data.