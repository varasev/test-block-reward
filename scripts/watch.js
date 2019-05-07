const Web3 = require('web3');

var balancesToWatch = [
    {
        name: 'Validator1 (old)',
        address: '0x6546ed725e88fa728a908f9ee9d61f50edc40ad6'
    },
    {
        name: 'Validator2 (old)',
        address: '0x1a22d96792666863f429a85623e6d4ca173d26ab'
    },
    {
        name: 'Validator3 (old)',
        address: '0x75df42383afe6bf5194aa8fa0e9b3d5f9e869441'
    },
    {
        name: 'Validator4 (new inactive)',
        address: '0xeecdd8d48289bb1bbcf9bb8d9aa4b1d215054cee'
    },
    {
        name: 'Validator5 (new active)',
        address: '0xbbcaA8d48289bB1ffcf9808D9AA4b1d215054C78'
    }
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
var abi = require('../contracts/abis/PoaNetworkConsensus.abi.json');
var poaContract = new web3.eth.Contract(abi, '0xbbcaa8d48289bb1ffcf9808d9aa4b1d215054c80');
var height = 0;

function log(...args) {
    if (height > 0) {
        console.log(new Date().toLocaleString(), `[Block #${height}]`, ...args);
    } else {
        console.log(new Date().toLocaleString(), ...args);
    }
}

log('Starting');
console.log('');

async function getHeight() {
    height = await web3.eth.getBlockNumber();
    return height;
}

async function printBalances() {
    for (let i = 0; i < balancesToWatch.length; i++) {
        const name = balancesToWatch[i].name;
        const address = balancesToWatch[i].address;

        let balance = await web3.eth.getBalance(address);
        balance = web3.utils.fromWei(balance, 'ether');

        console.log(`${name}: ${balance}`);
    }
}

async function getCurrentValidators() {
    return await poaContract.methods.getCurrentValidators().call();
}

async function getPendingValidators() {
    return await poaContract.methods.getPendingValidators().call();
}

async function collect() {
    await getHeight();

    let currentValidators = await getCurrentValidators();
    if (currentValidators.length == 0) {
        currentValidators = '[]';
    }
    const pendingList = await getPendingValidators();

    log(`\ncurrentValidators = ${currentValidators}\npendingList = ${pendingList}`);

    await printBalances();
    console.log('');

    if (height == 10) {
        poaContract.methods.addValidator('0xbbcaA8d48289bB1ffcf9808D9AA4b1d215054C78').send({
            from: '0x74e07782e722608448f1cdc3040c874f283340b0'
        });
    }
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
