pragma solidity ^0.4.23;


interface IKeysManager {
    function getPayoutByMining(address) external view returns(address);
    function isMiningActive(address) external view returns(bool);
}