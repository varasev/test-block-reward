const Web3 = require('web3')
const web3 = new Web3('http://localhost:8545')

const rewardByBlockABI = require('../contracts/abis/RewardByBlock.abi.json')
const rewardByBlockAddress = '0xf845799e5577fcd47374b4375abff380dac74252'

const unlockedAddress = '0x74e07782e722608448f1cdc3040c874f283340b0'
const extraReceiver = '0x63a9344ae66c1f26d400b3ea4750a709c3aa6cfa'
const amount = web3.utils.toWei(process.argv[2], 'ether')

async function main() {
	const rewardByBlockInstance = new web3.eth.Contract(rewardByBlockABI, rewardByBlockAddress)
	const addExtraReceiver = rewardByBlockInstance.methods.addExtraReceiver(amount, extraReceiver)
	const gas = await addExtraReceiver.estimateGas({from: unlockedAddress})
	const data = await addExtraReceiver.encodeABI()

	web3.eth.sendTransaction({
		from: unlockedAddress,
		to: rewardByBlockAddress,
		value: 0,
		gas,
		data
	})
}

main()
