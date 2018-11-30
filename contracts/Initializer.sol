pragma solidity 0.4.24;


interface IValidatorSet {
    function initialize() external;
}


contract Initializer {
    constructor(address _validatorSetContract) public {
        IValidatorSet(_validatorSetContract).initialize();
    }
}
