const Web3 = require('web3');

var balancesToWatch = [
    {
        name: 'Validator1',
        address: '0x6546ed725e88fa728a908f9ee9d61f50edc40ad6'
    },
    {
        name: 'Validator2',
        address: '0x1a22d96792666863f429a85623e6d4ca173d26ab'
    },
    {
        name: 'Validator3',
        address: '0x75df42383afe6bf5194aa8fa0e9b3d5f9e869441'
    }
];

var web3 = new Web3('ws://localhost:8546');
var BN = web3.utils.BN;
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
    log();
    for (let i = 0; i < balancesToWatch.length; i++) {
        const name = balancesToWatch[i].name;
        const address = balancesToWatch[i].address;

        let balance = await web3.eth.getBalance(address);
        balance = web3.utils.fromWei(balance, 'ether');

        console.log(`${name} balance: ${balance} ETH`);
    }
}

async function collect() {
    await getHeight();
    await printBalances();
    console.log('');
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
