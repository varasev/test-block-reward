pragma solidity ^0.4.23;

import "./interfaces/IProxyStorage.sol";
import "./eternal-storage/EternalStorage.sol";


contract ProxyStorage is IProxyStorage, EternalStorage {
    function getEmissionFunds() public view returns(address) {
        return 0xE9d0bb7Fa991960cf9bcFf4899E8fec3B25E77f2;
    }

    function getKeysManager() public view returns(address) {
        return 0xF845799e5577Fcd47374b4375aBFf380DAC74254;
    }
}
