pragma solidity ^0.4.24;

import "./interfaces/IProxyStorage.sol";
import "./eternal-storage/EternalStorage.sol";


contract ProxyStorage is IProxyStorage, EternalStorage {
    function getKeysManager() public view returns(address) {
        return 0xF845799e5577Fcd47374b4375aBFf380DAC74254;
    }
}
