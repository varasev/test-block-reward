const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://core.poa.network'));

const contractsPath = './contracts/';
const abisPath = `${contractsPath}abis/`;
const specJsonPath = './config/spec.json';

let specJson = require('.' + specJsonPath);
let abis = {};

main();

async function main() {
	let contracts = [
		'PoaNetworkConsensus'
	];

	let allSuccess = true;

	for (let n in contracts) {
		const contractName = contracts[n];
		const result = await compileContract(contractName);
		if (result === false) {
			allSuccess = false;
		}
	}

	if (allSuccess) {
		// Save spec.json
		fs.writeFileSync(specJsonPath, JSON.stringify(specJson, null, 2));

		// Save *.abi.json
		await clearABIs();
		for (let abiFilepath in abis) {
			fs.writeFileSync(abiFilepath, abis[abiFilepath]);
		}
	}
}

async function clearABIs() {
	let abisFiles = fs.readdirSync(abisPath);
	for (let i = 0; i < abisFiles.length; i++) {
		fs.unlinkSync(`${abisPath}${abisFiles[i]}`);
	}
}

async function compileContract(contractName) {
	let contractFilename = `${contractName}.sol`;

	console.log(`${contractName} compilation...`);
	let compiled = solc.compile({
		sources: {
			'': fs.readFileSync(`${contractsPath}${contractFilename}`).toString()
		}
	}, 1, function (path) {
		return {contents: fs.readFileSync(contractsPath + path).toString()}
	});

	if (compiled.errors) {
		for (let n in compiled.errors) {
			console.log(`${contractFilename}${compiled.errors[n]}`);
		}
		return false;
	}

	let abi = JSON.parse(compiled.contracts[':' + contractName].interface);
	let bytecode = compiled.contracts[':' + contractName].bytecode;

	abis[`${abisPath}${contractName}.abi.json`] = JSON.stringify(abi, null, 2);

	let contract = new web3.eth.Contract(abi);
	let deploy = await contract.deploy({data: bytecode, arguments: []});
	specJson.accounts[getContractAddress(contractName)].constructor = await deploy.encodeABI();

	return true;
}

function getContractAddress(contractName) {
	switch (contractName) {
	case 'PoaNetworkConsensus':
		return '0xbbcaa8d48289bb1ffcf9808d9aa4b1d215054c80';
	default:
		return '';
	}
}

// node scripts/build.js