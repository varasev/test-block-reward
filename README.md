## Debug mode test for Parity 2.4.5

### Usage

1. Install Parity 2.4.5 and Node.js 8.11 LTS (with npm) if they are not installed.

2. Perform the next commands:

```bash
$ git clone -b debug-mode-test https://github.com/varasev/test-block-reward.git
$ cd test-block-reward
$ npm i
$ npm start
```

3. Watch a log in the console.

4. To restart this setup from scratch, perform the next command:

```bash
$ npm restart
```

5. To completely stop and clear, perform the next command:

```bash
$ npm run clear
```

Tested with Parity 2.4.5-stable.