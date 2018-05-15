#!/bin/bash
ENODE1=$(curl -s -X POST -H "Content-Type: application/json" --data '{"method":"parity_enode","params":[],"id":1,"jsonrpc":"2.0"}' localhost:8545 | json result)
ENODE2=$(curl -s -X POST -H "Content-Type: application/json" --data '{"method":"parity_enode","params":[],"id":1,"jsonrpc":"2.0"}' localhost:9545 | json result)

curl -s -X POST -H "Content-Type: application/json" --data "{\"method\":\"parity_addReservedPeer\",\"params\":[\"$ENODE2\"],\"id\":1,\"jsonrpc\":\"2.0\"}" localhost:8545 | json result
curl -s -X POST -H "Content-Type: application/json" --data "{\"method\":\"parity_addReservedPeer\",\"params\":[\"$ENODE1\"],\"id\":1,\"jsonrpc\":\"2.0\"}" localhost:9545 | json result
