// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;

import "./TransactionFactory.sol";

contract AuditTrail is TransactionFactory {

    event Audit(bytes28 transactionIdentifier, bytes32 dataHash);
    mapping(bytes28 => bytes32) public dataHashes;
    bytes28[] public auditedTransactions;

    function auditTransaction(bytes28 transactionIdentifier, bytes32 dataHash) public {
        require(dataHashes[transactionIdentifier] == 0, "A transaction can only be audited once");
        dataHashes[transactionIdentifier] = dataHash;
        auditedTransactions.push(transactionIdentifier);
        emit Audit(transactionIdentifier, dataHash);
    }

    function validateTransaction(bytes28 transactionIdentifier, bytes32 dataHash) public view returns (bool) {
        return dataHashes[transactionIdentifier] == dataHash ? true : false;
    }
}