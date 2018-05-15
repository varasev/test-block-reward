pragma solidity ^0.4.21;

import "./IBlockReward.sol";

contract TestBlockReward is BlockReward {
    //address constant SYSTEM_ADDRESS = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;

    event RewardReceived(uint256 benefactors_length, address benefactors_0, uint16 kind_0);

    // produce rewards for the given benefactors, with corresponding reward codes.
    // only callable by `SYSTEM_ADDRESS`
    function reward(address[] benefactors, uint16[] kind)
        external
        onlySystem
        returns (address[], uint256[])
    {
        require(benefactors.length == kind.length);
        emit RewardReceived(benefactors.length, benefactors[0], kind[0]);
        uint256[] memory rewards = new uint256[](benefactors.length);

        for (uint i = 0; i < rewards.length; i++) {
            rewards[i] = 1e18 + 10e18*kind[i];
        }

        return (benefactors, rewards);
    }

    modifier onlySystem {
        //require(msg.sender == SYSTEM_ADDRESS);
        _;
    }
}
