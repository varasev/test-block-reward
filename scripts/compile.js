const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://core.poa.network"));

main();

async function main() {
	await showImplementationBytecode('BlockReward');
	console.log('');
	await showStorageBytecode('BlockReward');
	console.log('');
	await showImplementationBytecode('KeysManager');
	console.log('');
	await showStorageBytecode('KeysManager');
	console.log('');
	await showImplementationBytecode('ProxyStorage');
	console.log('');
	await showStorageBytecode('ProxyStorage');
}

async function showImplementationBytecode(contractName) {
	console.log(`${contractName} implementation compilation...`);
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
	const contract = new web3.eth.Contract(abi);
	const deploy = await contract.deploy({data: bytecode, arguments: arguments});
	bytecode = await deploy.encodeABI();
	
	console.log(`${contractName} implementation bytecode:`);
	console.log('');
	console.log(bytecode);
}

async function showStorageBytecode(contractName) {
	console.log(`${contractName} storage compilation...`);
	const compiled = solc.compile({
		sources: {
			'': fs.readFileSync(`../contracts/eternal-storage/EternalStorageProxy.sol`).toString()
		}
	}, 1, function (path) {
		return {contents: fs.readFileSync('../contracts/eternal-storage/' + path).toString()}
	});
	const abiStr = compiled.contracts[':EternalStorageProxy'].interface;
	const abi = JSON.parse(abiStr);
	let bytecode = compiled.contracts[':EternalStorageProxy'].bytecode;

	let arguments = ['0xf845799e5577fcd47374b4375abff380dac74256'];
	if (contractName == 'BlockReward') {
		arguments.push('0xf845799e5577fcd47374b4375abff380dac74251');
	} else if (contractName == 'KeysManager') {
		arguments.push('0xf845799e5577fcd47374b4375abff380dac74253');
	} else if (contractName == 'ProxyStorage') {
		arguments[0] = '0x0000000000000000000000000000000000000000';
		arguments.push('0xf845799e5577fcd47374b4375abff380dac74255');
	}
	const contract = new web3.eth.Contract(abi);
	const deploy = await contract.deploy({data: bytecode, arguments: arguments});
	bytecode = await deploy.encodeABI();
	
	console.log(`${contractName} storage bytecode:`);
	console.log('');
	console.log(bytecode);
}

// node compile.js