## RewardByBlock contract test in Parity 1.11.x and 2.x

### Usage

1. Install Parity 1.11.x or 2.x and Node.js 8.11 LTS (with npm) if they are not installed.

2. Perform the next commands:

```bash
$ git clone https://github.com/varasev/test-block-reward.git
$ cd test-block-reward
$ npm i
$ npm start
```

3. Watch a log in the console. It should be seen that `payoutKey` balances are being increased alternately by 1 eth and the vault's balance is being increased by 1 eth every 5 seconds. We also can see that the gas fee is being accrued alternately to mining keys when a sender transfers some amount to a receiver. An example log is available here: https://github.com/varasev/test-block-reward/blob/master/example.log

4. To make charging of one coin to an extra receiver's account, perform the next command:

```bash
$ npm run accrue 1
```

You'll see in the log that the balance of an extra receiver increased by one coin on the next block.

5. To restart this setup from scratch, perform the next command:

```bash
$ npm restart
```

6. To completely stop and clear, perform the next command:

```bash
$ npm run clear
```

### Compilation/ recompilation

Do the next command for contracts compilation, for saving their bytecodes to `config/spec.json` and for saving their ABIs to `contracts/abis`:

```bash
$ npm run build
```

Note that you have to perform `npm restart` after `npm run build` if you started it before.

Tested with Parity 1.11.11-stable, 2.0.6-stable and 2.1.1-beta.