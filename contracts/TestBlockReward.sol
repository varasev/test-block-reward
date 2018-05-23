pragma solidity ^0.4.23;

import "./interfaces/IBlockReward.sol";
import "./interfaces/ITestPayoutByMining.sol";

contract TestBlockReward is IBlockReward {
    uint256 public counter = 0;
    uint256 public last_benefactors_length = 0;
    address public last_benefactors_0 = address(0);
    uint16  public last_kind_0 = 0;

    address public miningKey1 = 0x6546ed725e88fa728a908f9ee9d61f50edc40ad6;
    address public miningKey2 = 0x1a22d96792666863f429a85623e6d4ca173d26ab;
    //address public payoutKey1 = 0x7546ed725e88fa728a908f9ee9d61f50edc40ad6;
    //address public payoutKey2 = 0x2a22d96792666863f429a85623e6d4ca173d26ab;
    address public testPayoutByMining = 0x4444d967926668728a908f9ee9d614ca173d26ab;
    address public vault = 0xe9d0bb7fa991960cf9bcff4899e8fec3b25e77f2;

    address constant SYSTEM_ADDRESS = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;

    modifier onlySystem {
        require(msg.sender == SYSTEM_ADDRESS);
        _;
    }

    event RewardReceived(uint256 benefactors_length, address benefactors_0, uint16 kind_0);

    // produce rewards for the given benefactors, with corresponding reward codes.
    // only callable by `SYSTEM_ADDRESS`
    function reward(address[] benefactors, uint16[] kind)
        external
        onlySystem
        returns (address[], uint256[])
    {
        require(benefactors.length == kind.length);
        
        counter++;
        last_benefactors_length = benefactors.length;
        last_benefactors_0 = benefactors[0];
        last_kind_0 = kind[0];

        address[] memory receivers = new address[](2);
        uint256[] memory rewards = new uint256[](2);

        //if (benefactors[0] == miningKey1) {
        //    receivers[0] = payoutKey1;
        //} else if (benefactors[0] == miningKey2) {
        //    receivers[0] = payoutKey2;
        //}
        
        receivers[0] = ITestPayoutByMining(testPayoutByMining)
            .getPayoutByMining(benefactors[0]);
        receivers[1] = vault;

        emit RewardReceived(benefactors.length, benefactors[0], kind[0]);

        rewards[0] = 10 ether;
        rewards[1] = 5 ether;

        return (receivers, rewards);
    }
}
