pragma solidity ^0.4.21;


interface ITestPayoutByMining {
    function getPayoutByMining(address) public view returns(address);
}
