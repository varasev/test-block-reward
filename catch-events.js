const fs = require('fs');
const Web3 = require('web3');
const REWARD_CONTRACT = '0xf845799e5577fcd47374b4375abff380dac74251';

var web3 = new Web3('ws://localhost:8546');
var abi = JSON.parse( fs.readFileSync('./contracts/TestBlockReward.abi.json', 'utf8') );
var rewardContract = new web3.eth.Contract(abi, REWARD_CONTRACT);

console.log('Listening to events');
rewardContract.events.RewardReceived({ fromBlock: 0 }, (err, event) => {
    if (err) {
        console.log('RewardReceived error: ' + err);
        return;
    }

    console.log('RewardReceived event: ' + JSON.stringify(event, null, 4));
});
