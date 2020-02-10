## RandomAuRa contract test in Parity 2.7.2+

### Usage

1. Install Parity 2.7.2+ and Node.js 8.x LTS (with npm).

    If your Parity installed not to `/usr/bin` or `/usr/local/bin`, change the path to the binary in `package.json`.

2. Perform the next commands:

```bash
$ git clone -b randao-activation https://github.com/varasev/test-block-reward
$ cd test-block-reward
$ npm i
$ npm start
```

3. Watch node logs. It should be seen that there are two transactions made every 10 blocks after the block #20. You also can see the `currentSeed` in the log displayed through console.

4. To restart this setup from scratch, perform the next command:

```bash
$ npm restart
```

5. To completely stop and clear, perform the next command:

```bash
$ npm run clear
```

### Compilation/ recompilation

Do the next command for contracts compilation, for saving their bytecodes to `config/spec.json` and for saving their ABIs to `contracts/abis`:

```bash
$ npm run build
```

Note that you have to perform `npm restart` after `npm run build` if you started it before.
