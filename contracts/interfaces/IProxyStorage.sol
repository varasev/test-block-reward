pragma solidity ^0.4.23;


interface IProxyStorage {
    function getEmissionFunds() external view returns(address);
    function getKeysManager() external view returns(address);
}