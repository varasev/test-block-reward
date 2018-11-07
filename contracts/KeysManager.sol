pragma solidity ^0.4.24;

import "./interfaces/IKeysManager.sol";
import "./eternal-storage/EternalStorage.sol";


contract KeysManager is IKeysManager, EternalStorage {
    function getPayoutByMining(address _miningKey) public view returns(address) {
        if (_miningKey == 0x6546ED725E88FA728A908f9EE9d61f50edc40Ad6) {
            return 0x7546ed725e88FA728a908f9eE9d61F50edc40Ad6;
        }
        if (_miningKey == 0x1A22D96792666863f429A85623E6d4CA173D26ab) {
            return 0x2a22d96792666863f429a85623E6D4cA173D26ab;
        }
        if (_miningKey == 0x4579C2a15651609ec44A5FAdeAabFc30943b5949) {
            return 0x5579C2a15651609Ec44a5FADeAAbfC30943B5949;
        }
        return 0;
    }

    function isMiningActive(address _key) public view returns(bool) {
        if (_key == 0x6546ED725E88FA728A908f9EE9d61f50edc40Ad6) {
            return true;
        }
        if (_key == 0x1A22D96792666863f429A85623E6d4CA173D26ab) {
            return true;
        }
        if (_key == 0x4579C2a15651609ec44A5FAdeAabFc30943b5949) {
            return true;
        }
        return false;
    }
}
