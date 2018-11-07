const fs = require('fs');
const Web3 = require('web3');
const interval = require('interval-promise');

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
        name: 'Validator3',
        keys: {
            mining: '0x4579c2a15651609ec44a5fadeaabfc30943b5949',
            payout: '0x5579c2a15651609ec44a5fadeaabfc30943b5949',
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
    {
        name: 'Some extra receiver',
        keys: {
            address: '0x63a9344ae66c1f26d400b3ea4750a709c3aa6cfa',
        }
    },
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
var abi = require('../contracts/abis/RewardByBlock.abi.json');
var rewardContract = new web3.eth.Contract(abi, REWARD_CONTRACT);
var validatorsContract = new web3.eth.Contract([
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "benignBlocks",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "benignAddresses",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "finalizeChange",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "currentValidators",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "benignSenders",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getValidators",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "validator",
                "type": "address"
            },
            {
                "name": "blockNumber",
                "type": "uint256"
            },
            {
                "name": "proof",
                "type": "bytes"
            }
        ],
        "name": "reportMalicious",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "systemAddress",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "validator",
                "type": "address"
            },
            {
                "name": "blockNumber",
                "type": "uint256"
            }
        ],
        "name": "reportBenign",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "parentHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "newSet",
                "type": "address[]"
            }
        ],
        "name": "InitiateChange",
        "type": "event"
    }
], '0x53a9344ae66c1f26d400b3ea4750a709c3aa6cfa');

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

//async function getContractCounter() {
//    return await rewardContract.methods.counter().call();
//}

//async function getContractLastMiningKey() {
//    return await rewardContract.methods.lastMiningKey().call();
//}

async function collect() {
    await getHeight();

    var balances = await getBalances();
    //var contractCounter = await getContractCounter();
    //var lastMiningKey = await getContractLastMiningKey();

    //log('contractCounter = ' + contractCounter);
    //log('lastMiningKey = ' + lastMiningKey);
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

    let i = 0;
    while (true) {
        try {
            let result = await validatorsContract.methods.benignAddresses(i).call();
            console.log(`benignAddresses[${i}]: ${result}`);
            result = await validatorsContract.methods.benignBlocks(i).call();
            console.log(`benignBlocks[${i}]: ${result}`);
            result = await validatorsContract.methods.benignSenders(i).call();
            console.log(`benignSenders[${i}]: ${result}`);
            console.log('');
        } catch (e) {
            break;
        }
        i++;
    }

    //web3.eth.sendTransaction({
    //    from: '0x74e07782e722608448f1cdc3040c874f283340b0',
    //    to: '0x190ec582090ae24284989af812f6b2c93f768ecd',
    //    value: 1000000000
    //});
}

// ********** MAIN ********** //

web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (error) {
        console.log(error);
    }
}).on("data", function(blockHeader){
    if (blockHeader.number) {
        collect();
    }
});
