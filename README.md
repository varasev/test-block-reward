## RewardByBlock contract test in Parity 1.11

### Usage

1. Install Parity 1.11 and Node.js 8.11 LTS (with npm) if they are not installed.

1. Perform the next commands:

```bash
$ git clone https://github.com/varasev/test-block-reward.git
$ cd test-block-reward
$ npm i
$ npm start
```

1. Watch a log in the console. It should be seen that `payoutKey` balances are being increased alternately by 1 eth and the vault's balance is being increased by 1 eth every 5 seconds. We also can see that the gas fee is being accrued alternately to mining keys when a sender transfers some amount to a receiver. An example log is available here: https://github.com/varasev/test-block-reward/blob/master/example.log

1. To make charging of one coin to an extra receiver's account, perform the next command:

```bash
$ npm run accrue 1
```

You'll see in the log that the balance of an extra receiver increased by 1 coin on the next block.

1. To restart this setup from scratch, perform the next command:

```bash
$ npm restart
```

1. To completely stop and clear, perform the next command:

```bash
$ npm run clear
```

### Compilation/ recompilation

Do the next command for contracts compilation, for saving their bytecodes to `config/spec.json` and for saving their ABIs to `contracts/abis`:

```bash
$ npm run build
```

Note that you have to perform `npm restart` after `npm run build` if you started it before.