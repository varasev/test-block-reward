const fs = require('fs');
const Web3 = require('web3');
const interval = require('interval-promise');
const { exec } = require("child_process");

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
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
var rewardContract = new web3.eth.Contract(require('../contracts/abis/RewardByBlock.abi.json'), REWARD_CONTRACT);
var validatorSetContract = new web3.eth.Contract(require('../contracts/abis/ValidatorSet.abi.json'), '0x7777777777777777777777777777777777777777');
var height = 0;

async function log(...args) {
    if (height > 0) {
        const block = await web3.eth.getBlock(height);
        console.log(`[Block #${height}, author: ${block.author}]`);
        console.log(new Date().toLocaleTimeString(), ...args);
    }
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

async function onNewBlock() {
    await getHeight();

    var balances = await getBalances();

    await log('balances = \n' + balances.map((user) => {
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

    if (height == 10) {
        exec('npm run stop-node-2');
    } else if (height == 15) {
        validatorSetContract.methods.emitInitiateChange('0x6546ED725E88FA728A908f9EE9d61f50edc40Ad6').send({
            from: '0x74e07782e722608448f1cdc3040c874f283340b0',
        });
    } else if (height == 25) {
        exec('npm run start-node-2');
    }
}

// ********** MAIN ********** //

web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (error) {
        console.log(error);
    }
}).on("data", function(blockHeader){
    if (blockHeader.number) {
        onNewBlock();
    }
});
