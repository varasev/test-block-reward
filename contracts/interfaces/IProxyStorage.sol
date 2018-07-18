pragma solidity ^0.4.24;


interface IProxyStorage {
    function getKeysManager() external view returns(address);
}