pragma solidity ^0.4.24;


contract ReportingValidatorSet {
    event InitiateChange(bytes32 indexed parentHash, address[] newSet);
    
    address public systemAddress = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
    address[] public currentValidators;

    address[] public benignAddresses;
    uint256[] public benignBlocks;
    address[] public benignSenders;
    
    modifier onlySystem() {
        require(msg.sender == systemAddress);
        _;
    }

    constructor() public {
        currentValidators.push(address(0x6546ed725e88fa728a908f9ee9d61f50edc40ad6));
        currentValidators.push(address(0x1a22d96792666863f429a85623e6d4ca173d26ab));
        currentValidators.push(address(0x4579c2a15651609ec44a5fadeaabfc30943b5949));
    }

    function getValidators() public view returns(address[]) {
        return currentValidators;
    }

    function finalizeChange() public onlySystem {
    }

    function reportBenign(address validator, uint256 blockNumber) public {
        benignAddresses.push(validator);
        benignBlocks.push(blockNumber);
        benignSenders.push(msg.sender);
    }

    function reportMalicious(address validator, uint256 blockNumber, bytes proof) public {
    }
}