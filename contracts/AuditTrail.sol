// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;
pragma experimental ABIEncoderV2;

import "./TransactionFactory.sol";

contract AuditTrail is TransactionFactory {


    function auditTransaction(bytes28 transactionIdentifier, bytes32 dataHash) public view {
        // TODO load
    }

    function validateTransaction(bytes28 transactionIdentifier, bytes32 dataHash) public returns (bool) {
        //compare loaded hash to database 
    }


}