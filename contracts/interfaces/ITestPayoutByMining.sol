pragma solidity ^0.4.23;


interface ITestPayoutByMining {
    function getPayoutByMining(address) public view returns(address);
}
