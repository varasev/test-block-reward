#!/bin/bash
BN1=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' localhost:8545 | json result)
BN1="$(echo $BN1 | awk 'END{ print strtonum($1) }')"

V1=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x6546ed725e88fa728a908f9ee9d61f50edc40ad6", "latest"],"id":1}' localhost:8545 | json result)
V2=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x1a22d96792666863f429a85623e6d4ca173d26ab", "latest"],"id":1}' localhost:8545 | json result)

V1="$(echo $V1 | awk 'END{ print strtonum($1) }')"
V2="$(echo $V2 | awk 'END{ print strtonum($1) }')"

echo "========== $BN1 =========="
echo "Validator1 balance = $V1"
echo "Validator2 balance = $V2"
echo ""
