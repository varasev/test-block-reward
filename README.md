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

3. Watch a log in the console. It should be seen that `payoutKey` balances are being increased alternately by 1 eth and the vault's balance is being increased by 1 eth every 5 seconds. We also can see that the gas fee is being accrued alternately to mining keys when a sender transfers some amount to a receiver. An example log is available here: https://github.com/varasev/test-block-reward/blob/560370c1aab59ad84ee99df1f059bf2ff2af452c/example.log

4. To stop and clear this setup, perform the next command:

```bash
$ npm run clear
```