pragma solidity ^0.4.24;


/// @dev Generates and stores random numbers in a RANDAO manner (and controls when they are revealed by AuRa
/// validators) and accumulates a random seed.
contract RandomAuRa {

    mapping(uint256 => mapping(address => bytes)) internal _ciphers;
    mapping(uint256 => mapping(address => bytes32)) internal _commits;
    mapping(uint256 => mapping(address => bool)) internal _sentReveal;

    /// @dev The length of the collection round (in blocks).
    uint256 public constant collectRoundLength = 20;

    /// @dev The current random seed accumulated.
    uint256 public currentSeed;

    /// @dev Called by the validator's node to store a hash and a cipher of the validator's number on each collection
    /// round. The validator's node must use its mining address (engine_signer) to call this function.
    /// This function can only be called once per collection round (during the `commit phase`).
    /// @param _numberHash The Keccak-256 hash of the validator's number.
    /// @param _cipher The cipher of the validator's number. Can be used by the node to restore the lost number after
    /// the node is restarted (see the `getCipher` getter).
    function commitHash(bytes32 _numberHash, bytes _cipher) external {
        address miningAddress = msg.sender;

        require(block.coinbase == miningAddress);
        require(isCommitPhase()); // must only be called in `commit phase`
        require(_numberHash != bytes32(0));
        require(!isCommitted(currentCollectRound(), miningAddress)); // cannot commit more than once

        uint256 collectRound = currentCollectRound();

        _commits[collectRound][miningAddress] = _numberHash;
        _ciphers[collectRound][miningAddress] = _cipher;
    }

    /// @dev Called by the validator's node to XOR its number with the current random seed.
    /// The validator's node must use its mining address (engine_signer) to call this function.
    /// This function can only be called once per collection round (during the `reveal phase`).
    /// @param _number The validator's number.
    function revealNumber(uint256 _number) external {
        address miningAddress = msg.sender;

        bytes32 numberHash = keccak256(abi.encodePacked(_number));
        uint256 collectRound = currentCollectRound();

        require(block.coinbase == miningAddress);
        require(!isCommitPhase()); // must only be called in `reveal phase`
        require(numberHash != bytes32(0));
        require(numberHash == _commits[collectRound][miningAddress]); // the hash must be commited
        require(!_sentReveal[collectRound][miningAddress]); // cannot reveal more than once during the same collect round

        currentSeed = currentSeed ^ _number;

        _sentReveal[collectRound][miningAddress] = true;
        delete _commits[collectRound][miningAddress];
        delete _ciphers[collectRound][miningAddress];
    }

    /// @dev Returns the serial number of the current collection round.
    /// Needed when using `getCommit`, `isCommitted`, `sentReveal`, or `getCipher` getters (see below).
    function currentCollectRound() public view returns(uint256) {
        return (block.number - 1) / collectRoundLength;
    }

    /// @dev Returns the Keccak-256 hash and cipher of the validator's number for the specified collection round
    /// and the specified validator stored by the validator through the `commitHash` function.
    /// @param _collectRound The serial number of the collection round for which hash and cipher should be retrieved.
    /// @param _miningAddress The mining address of validator (engine_signer).
    function getCommitAndCipher(
        uint256 _collectRound,
        address _miningAddress
    ) public view returns(bytes32, bytes memory) {
        return (_commits[_collectRound][_miningAddress], _ciphers[_collectRound][_miningAddress]);
    }

    /// @dev Returns a boolean flag indicating whether the specified validator has committed their number's hash for the
    /// specified collection round.
    /// @param _collectRound The serial number of the collection round for which the checkup should be done.
    /// Should be read with `currentCollectRound()` getter.
    /// @param _miningAddress The mining address of the validator (engine_signer).
    function isCommitted(uint256 _collectRound, address _miningAddress) public view returns(bool) {
        return _commits[_collectRound][_miningAddress] != bytes32(0);
    }

    /// @dev Returns a boolean flag of whether the specified validator has revealed their number for the
    /// specified collection round.
    /// @param _collectRound The serial number of the collection round for which the checkup should be done.
    /// Should be read with `currentCollectRound()` getter.
    /// @param _miningAddress The mining address of the validator (engine_signer).
    function sentReveal(uint256 _collectRound, address _miningAddress) public view returns(bool) {
        return _sentReveal[_collectRound][_miningAddress];
    }

    /// @dev Returns a boolean flag indicating whether the current phase of the current collection round
    /// is a `commit phase`. Used by the validator's node to determine if it should commit the hash of
    /// the number during the current collection round.
    function isCommitPhase() public view returns(bool) {
        uint256 commitPhaseLength = collectRoundLength / 2;
        return ((block.number - 1) % collectRoundLength) < commitPhaseLength;
    }

}
