const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://core.poa.network"));

main();

async function main() {
	await showBytecode('TestBlockReward');
	console.log('');
	await showBytecode('TestPayoutByMining');
}

async function showBytecode(contractName) {
	console.log(`${contractName} compilation...`);
	const compiled = solc.compile({
		sources: {
			'': fs.readFileSync(`../contracts/${contractName}.sol`).toString()
		}
	}, 1, function (path) {
		return {contents: fs.readFileSync('../contracts/' + path).toString()}
	});
	const abiStr = compiled.contracts[':' + contractName].interface;
	const abi = JSON.parse(abiStr);
	let bytecode = compiled.contracts[':' + contractName].bytecode;

	fs.writeFileSync(`../contracts/abis/${contractName}.abi.json`, abiStr);

	let arguments = [];

	if (contractName == 'TestPayoutByMining') {
		arguments = [
			'0x6546ed725e88fa728a908f9ee9d61f50edc40ad6',
			'0x7546ed725e88fa728a908f9ee9d61f50edc40ad6',
			'0x1a22d96792666863f429a85623e6d4ca173d26ab',
			'0x2a22d96792666863f429a85623e6d4ca173d26ab'
		];
	}
	
	const contract = new web3.eth.Contract(abi);
	const deploy = await contract.deploy({data: bytecode, arguments: arguments});
	bytecode = await deploy.encodeABI();
	
	console.log(`${contractName} bytecode:`);
	console.log('');
	console.log(bytecode);
}

// node compile.js