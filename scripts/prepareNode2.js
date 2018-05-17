const fs = require('fs');

main();

async function main() {
	const maxAttempts = 5;
	for (let i = 1; i <= maxAttempts; i++) {
		try {
			const enodeURL = await getEnodeURL();
			fs.writeFileSync("config/reserved_peers", enodeURL);
			break;
		} catch(e) {
			if (i <= maxAttempts) {
				await sleep(5000);
			} else {
				console.log(e.message);
			}
		}
	}
}

function getEnodeURL() {
	return new Promise((resolve, reject) => {
		var exec = require('child_process').exec;
		const cmd = `curl --data '{"method":"parity_enode","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 2>/dev/null`;
		exec(cmd, function (error, stdout, stderr) {
			if (error !== null) {
				reject(error);
			}
			let resp;
			try {
				resp = JSON.parse(stdout);
			} catch(e) {
				reject(e);
			}
			let result;
			try {
				if (resp.result) {
					result = resp.result;
				} else {
					throw new Error('result is undefined');
				}
			} catch (e) {
				reject(e);
			}
			resolve(result);
		});
	})
}

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}