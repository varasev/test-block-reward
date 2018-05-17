const fs = require('fs');
const Web3 = require('web3');
const interval = require('interval-promise');
const json2yaml = require('json2yaml');

const BLOCK_TIME = 5000;
const REWARD_CONTRACT = '0xf845799e5577fcd47374b4375abff380dac74251';
var usersToWatch = [
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
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
var abi = JSON.parse( fs.readFileSync('./contracts/TestBlockReward.abi.json', 'utf8') );
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
    let userBalances = [];
    for (let a = 0; a < usersToWatch.length; a += 1) {
        let user = usersToWatch[a];
        let userBalance = {
            name: user.name,
            keys: {},
        };

        let userKeys = Object.keys(user.keys).sort();
        for (let k = 0; k < userKeys.length; k += 1) {
            let key = userKeys[k];
            let address = user.keys[key];
            if (address) {
                userBalance.keys[key] = await web3.eth.getBalance(address);
                userBalance.keys[key] = web3.utils.fromWei(userBalance.keys[key], 'ether');
            }
        }

        userBalances.push(userBalance);
    }
    return userBalances;
}

async function getContractCounter() {
    return await rewardContract.methods.counter().call();
}

async function getContractLastBenefactorsLength() {
    return await rewardContract.methods.last_benefactors_length().call();
}

async function getContractLastBenefactors0() {
    return await rewardContract.methods.last_benefactors_0().call();
}

async function getContractLastKind0() {
    return await rewardContract.methods.last_kind_0().call();
}

async function collect() {
    await getHeight();
    var userBalances = await getBalances();
    var contractCounter = await getContractCounter();
    var LastBenefactorsLength = await getContractLastBenefactorsLength();
    var LastBenefactors0 = await getContractLastBenefactors0();
    var LastKind0 = await getContractLastKind0();

    log('contractCounter = ' + contractCounter);
    log('LastBenefactorsLength = ' + LastBenefactorsLength);
    log('LastBenefactors0 = ' + LastBenefactors0);
    log('LastKind0 = ' + LastKind0);
    log('userBalances = \n' + userBalances.map((user) => {
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
}

// ********** MAIN ********** //

rewardContract.events.RewardReceived({ fromBlock: 0 }, (err, event) => {
    if (err) {
        log('RewardReceived event error: ' + err);
        return;
    }

    log('RewardReceived event: ' + JSON.stringify(event, null, 4));
});

interval(async () => {
    await collect();
}, BLOCK_TIME);
