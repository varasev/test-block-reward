pragma solidity 0.4.24;

contract EternalStorage {

    // Version number of the current implementation
    uint256 internal _version;

    // Address of the current implementation
    address internal _implementation;

    // Storage mappings
    mapping(bytes32 => uint256) internal uintStorage;
    mapping(bytes32 => string) internal stringStorage;
    mapping(bytes32 => address) internal addressStorage;
    mapping(bytes32 => bytes) internal bytesStorage;
    mapping(bytes32 => bool) internal boolStorage;
    mapping(bytes32 => int256) internal intStorage;
    mapping(bytes32 => bytes32) internal bytes32Storage;

    mapping(bytes32 => uint256[]) internal uintArrayStorage;
    mapping(bytes32 => string[]) internal stringArrayStorage;
    mapping(bytes32 => address[]) internal addressArrayStorage;
    //mapping(bytes32 => bytes[]) internal bytesArrayStorage;
    mapping(bytes32 => bool[]) internal boolArrayStorage;
    mapping(bytes32 => int256[]) internal intArrayStorage;
    mapping(bytes32 => bytes32[]) internal bytes32ArrayStorage;

}

contract ValidatorSet is EternalStorage {
    event InitiateChange(bytes32 indexed parentHash, address[] newSet);

    function finalizeChange() public {
        uintArrayStorage[FINALIZE_CHANGE_BLOCKS].push(block.number);
        addressArrayStorage[CURRENT_VALIDATORS] = addressArrayStorage[PENDING_VALIDATORS];
    }

    function getValidators() public view returns(address[]) {
        return addressArrayStorage[CURRENT_VALIDATORS];
    }

    function initialize() public {
        addressArrayStorage[CURRENT_VALIDATORS].push(0x6546ed725e88fa728a908f9ee9d61f50edc40ad6);
        addressArrayStorage[CURRENT_VALIDATORS].push(0x1a22d96792666863f429a85623e6d4ca173d26ab);
    }

    function reinitialize() public {
        delete addressArrayStorage[PENDING_VALIDATORS];
        addressArrayStorage[PENDING_VALIDATORS].push(0x1a22d96792666863f429a85623e6d4ca173d26ab);
        //addressArrayStorage[PENDING_VALIDATORS].push(0x6546ed725e88fa728a908f9ee9d61f50edc40ad6);
        emit InitiateChange(blockhash(block.number - 1), addressArrayStorage[PENDING_VALIDATORS]);
    }

    function reinitialize2() public {
        delete addressArrayStorage[PENDING_VALIDATORS];
        addressArrayStorage[PENDING_VALIDATORS].push(0x6546ed725e88fa728a908f9ee9d61f50edc40ad6);
        addressArrayStorage[PENDING_VALIDATORS].push(0x1a22d96792666863f429a85623e6d4ca173d26ab);
        emit InitiateChange(blockhash(block.number - 1), addressArrayStorage[PENDING_VALIDATORS]);
    }

    function finalizeChangeBlocks() public view returns(uint256[]) {
        return uintArrayStorage[FINALIZE_CHANGE_BLOCKS];
    }

    bytes32 internal constant CURRENT_VALIDATORS = keccak256("currentValidators");
    bytes32 internal constant PENDING_VALIDATORS = keccak256("pendingValidators");
    bytes32 internal constant FINALIZE_CHANGE_BLOCKS = keccak256("finalizeChangeBlocks");
}
