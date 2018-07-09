const fs = require('fs');
const Web3 = require('web3');
const interval = require('interval-promise');

const BLOCK_TIME = 5000;
const REWARD_CONTRACT = '0xf845799e5577fcd47374b4375abff380dac74252';
var balancesToWatch = [
    {
        name: 'Validator1',
        keys: {
            mining: '0x6546ed725e88fa728a908f9ee9d61f50edc40ad6',
            payout: '0x7546ed725e88FA728a908f9eE9d61F50edc40Ad6',
        },
    },
    {
        name: 'Validator2',
        keys: {
            mining: '0x1a22d96792666863f429a85623e6d4ca173d26ab',
            payout: '0x2a22d96792666863f429a85623e6d4ca173d26ab',
        },
    },
    {
        name: 'Vault',
        keys: {
            address: '0xE9d0bb7Fa991960cf9bcFf4899E8fec3B25E77f2',
        }
    },
    {
        name: 'Some sender',
        keys: {
            address: '0x74e07782e722608448f1cdc3040c874f283340b0',
        }
    },
    {
        name: 'Some receiver',
        keys: {
            address: '0x190ec582090ae24284989af812f6b2c93f768ecd',
        }
    },
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
var abi = JSON.parse( fs.readFileSync('./contracts/abis/BlockReward.abi.json', 'utf8') );
var rewardContract = new web3.eth.Contract(abi, REWARD_CONTRACT);
var height = 0;

function log(...args) {
    console.log(new Date().toISOString(), `[Block #${height}]`, ...args);
}

log('Starting');

async function getHeight() {
    height = await web3.eth.getBlockNumber();
    return height;
}

async function getBalances() {
    let balances = [];
    for (let a = 0; a < balancesToWatch.length; a++) {
        let address = balancesToWatch[a];
        let balance = {
            name: address.name,
            keys: {},
        };

        let userKeys = Object.keys(address.keys).sort();
        for (let k = 0; k < userKeys.length; k += 1) {
            let key = userKeys[k];
            if (address.keys[key]) {
                balance.keys[key] = await web3.eth.getBalance(address.keys[key]);
                balance.keys[key] = web3.utils.fromWei(balance.keys[key], 'ether');
            }
        }

        balances.push(balance);
    }
    return balances;
}

async function getContractCounter() {
    return await rewardContract.methods.counter().call();
}

async function getContractLastMiningKey() {
    return await rewardContract.methods.lastMiningKey().call();
}

async function collect() {
    await getHeight();
    var balances = await getBalances();
    var contractCounter = await getContractCounter();
    var lastMiningKey = await getContractLastMiningKey();

    log('contractCounter = ' + contractCounter);
    log('lastMiningKey = ' + lastMiningKey);
    log('balances = \n' + balances.map((user) => {
        let str = '';
        let name = user.name;
        str += `${name}\n`;
        let keys = Object.keys(user.keys).sort();
        for (let k = 0; k < keys.length; k += 1) {
            let key = keys[k];
            str += `\t${key}: ${user.keys[key]}\n`;
        }
        return str;
    }).join(''));

    web3.eth.sendTransaction({
        from: '0x74e07782e722608448f1cdc3040c874f283340b0',
        to: '0x190ec582090ae24284989af812f6b2c93f768ecd',
        value: 1000000000
    });
}

// ********** MAIN ********** //

interval(async () => {
    await collect();
}, BLOCK_TIME);
