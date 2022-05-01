// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;
//pragma experimental ABIEncoderV2;

import "./TransactionFactory.sol";

contract AuditTrail is TransactionFactory {


    function loadTransactions() public view returns (Transaction[] memory){

    }

    function validateTransactions(string[] memory transactionHash) public returns (bool) {
        //somehow validate the loaded transaction after hashing to the given hashes. check existence? 
        //or don't load, just check agains the mapping in factory.
    }




}