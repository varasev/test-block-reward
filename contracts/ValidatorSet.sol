pragma solidity ^0.4.24;


contract ValidatorSet {
    address[] internal _currentValidators;
    address[] internal _pendingValidators;

    event InitiateChange(bytes32 indexed parentHash, address[] newSet);

    constructor() public {
        _currentValidators.push(0x6546ED725E88FA728A908f9EE9d61f50edc40Ad6);
        _currentValidators.push(0x1A22D96792666863f429A85623E6d4CA173D26ab);
        _pendingValidators = _currentValidators;
    }

    function getValidators() public view returns(address[] memory) {
        return _currentValidators;
    }

    function emitInitiateChange(address _newValidator) public {
        address[] memory newSet = new address[](1);
        newSet[0] = _newValidator;
        _pendingValidators = newSet;
        emit InitiateChange(blockhash(block.number - 1), newSet);
    }

    function finalizeChange() external {
    	_currentValidators = _pendingValidators;
    }
}
