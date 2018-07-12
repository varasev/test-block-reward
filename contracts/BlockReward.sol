pragma solidity ^0.4.23;

import "./interfaces/IBlockReward.sol";
import "./interfaces/IKeysManager.sol";
import "./interfaces/IProxyStorage.sol";
import "./eternal-storage/EternalStorage.sol";


contract BlockReward is IBlockReward, EternalStorage {
    bytes32 private constant COUNTER = keccak256("counter");
    bytes32 private constant LAST_MINING_KEY = keccak256("lastMiningKey");
    bytes32 private constant PROXY_STORAGE = keccak256("proxyStorage");
    address private constant SYSTEM_ADDRESS = 0xffffFFFfFFffffffffffffffFfFFFfffFFFfFFfE;
    
    uint256 public constant BLOCK_REWARD_AMOUNT = 1 ether;
    uint256 public constant EMISSION_FUNDS_AMOUNT = 1 ether;

    modifier onlySystem {
        require(msg.sender == SYSTEM_ADDRESS);
        _;
    }

    function reward(address[] benefactors, uint16[] kind)
        external
        onlySystem
        returns (address[], uint256[])
    {
        require(benefactors.length == kind.length);
        require(benefactors.length == 1);
        require(kind[0] == 0);

        address miningKey = benefactors[0];
        
        require(_isMiningActive(miningKey));

        address payoutKey = _getPayoutByMining(miningKey);
        uint256 receiversLength = 2;

        if (emissionFunds() == address(0) || EMISSION_FUNDS_AMOUNT == 0) {
            receiversLength = 1;
        }

        address[] memory receivers = new address[](receiversLength);
        uint256[] memory rewards = new uint256[](receiversLength);

        receivers[0] = (payoutKey != address(0)) ? payoutKey : miningKey;
        rewards[0] = BLOCK_REWARD_AMOUNT;

        if (receiversLength == 2) {
            receivers[1] = emissionFunds();
            rewards[1] = EMISSION_FUNDS_AMOUNT;
        }

        _incrementCounter();
        _setLastMiningKey(miningKey);
    
        return (receivers, rewards);
    }

    function counter() public view returns(uint256) {
        return uintStorage[COUNTER];
    }

    function emissionFunds() public view returns(address) {
        return IProxyStorage(proxyStorage()).getEmissionFunds();
    }

    function lastMiningKey() public view returns(address) {
        return addressStorage[LAST_MINING_KEY];
    }

    function proxyStorage() public view returns(address) {
        return addressStorage[PROXY_STORAGE];
    }

    function _getPayoutByMining(address _miningKey)
        private
        view
        returns (address)
    {
        IKeysManager keysManager = IKeysManager(
            IProxyStorage(proxyStorage()).getKeysManager()
        );
        return keysManager.getPayoutByMining(_miningKey);
    }

    function _incrementCounter() private {
        uintStorage[COUNTER]++;
    }

    function _isMiningActive(address _miningKey)
        private
        view
        returns (bool)
    {
        IKeysManager keysManager = IKeysManager(
            IProxyStorage(proxyStorage()).getKeysManager()
        );
        return keysManager.isMiningActive(_miningKey);
    }

    function _setLastMiningKey(address _miningKey) private {
        addressStorage[LAST_MINING_KEY] = _miningKey;
    }
}
