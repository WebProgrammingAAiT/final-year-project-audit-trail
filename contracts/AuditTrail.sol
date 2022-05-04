// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.3;
pragma experimental ABIEncoderV2;

import "./TransactionFactory.sol";

contract AuditTrail is TransactionFactory {


    function loadTransactions(bytes28 transactionIdentifier, bytes32 dataHash) public view {
        // TODO load
    }

    function validateTransactions(bytes28 transactionIdentifier, bytes32 dataHash) public returns (bool) {
        //compare loaded hash to database 
    }


}