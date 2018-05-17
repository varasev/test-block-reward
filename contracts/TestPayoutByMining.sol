pragma solidity ^0.4.21;

import "./ITestPayoutByMining.sol";

contract TestPayoutByMining is ITestPayoutByMining {
    address public miningKey1;
    address public miningKey2;
    address public payoutKey1;
    address public payoutKey2;

    function TestPayoutByMining(
        address _miningKey1,
        address _payoutKey1,
        address _miningKey2,
        address _payoutKey2
    ) public {
        miningKey1 = _miningKey1;
        payoutKey1 = _payoutKey1;
        miningKey2 = _miningKey2;
        payoutKey2 = _payoutKey2;
    }

    function getPayoutByMining(address _miningKey) public view returns(address) {
        if (_miningKey == miningKey1) {
            return payoutKey1;
        }
        if (_miningKey == miningKey2) {
            return payoutKey2;
        }
        return 0;
    }
}
