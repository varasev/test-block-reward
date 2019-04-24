pragma solidity ^0.4.24;


contract PoaNetworkConsensus {
    address[] public currentValidators;
    address[] public pendingList;

    address internal _moc;

    event InitiateChange(bytes32 indexed parentHash, address[] newSet);
    
    modifier onlySystem() {
        require(msg.sender == 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE);
        _;
    }

    constructor() public {
        // A list of new validators
        _moc = address(0xEecdD8d48289bb1bBcf9bB8d9aA4B1D215054cEe);
        currentValidators.push(_moc);
        pendingList = currentValidators;
    }

    function addValidator(address _newValidator) public {
        pendingList.push(_newValidator);
        emit InitiateChange(blockhash(block.number - 1), pendingList);
    }

    // Used by the watch.js script
    function getCurrentValidators() public view returns(address[]) {
        return currentValidators;
    }

    // Used by the watch.js script
    function getPendingValidators() public view returns(address[]) {
        return pendingList;
    }

    // Used by the nodes when first initialized
    function getValidators() public view returns(address[]) {
        if (currentValidators.length == 1 && currentValidators[0] == _moc) {
            return pendingList;
        } else {
            return currentValidators;
        }
    }

    function finalizeChange() public onlySystem {
        currentValidators = pendingList;
    }
}
