## BlockReward contract test in Parity 1.11

Usage:

1. Install Parity 1.11 and Node.js 8.11 LTS (with npm) if they are not installed.

2. Perform the next commands:

```bash
$ git clone https://github.com/varasev/test-block-reward.git
$ cd test-block-reward
$ npm i
$ npm run start
```

3. Watch a log in the console. It should be seen that `payoutKey` balances are being increased alternately by 1 eth and the vault's balance is being increased by 1 eth every 5 seconds. An example log is available here: https://github.com/varasev/test-block-reward/blob/2c8135a951fbaf34953e4ed05661b6e7e19833ab/example.log

Payout key is read from another contract: https://github.com/varasev/test-block-reward/blob/2c8135a951fbaf34953e4ed05661b6e7e19833ab/contracts/TestBlockReward.sol#L52

4. To stop and clear this setup, perform the next command:

```bash
$ npm run clear
```