pragma solidity >=0.7.3;

contract AuditTrail {

    event ReceivingTransaction(string dataHash);
    event RequestingTransaction(string dataHash);
    event TransferTransaction(string dataHash);


    function receivingTransactions(string memory dataHash) public {
        string memory newTransaction = dataHash;
        emit ReceivingTransaction(newTransaction);
    }
    function requestingTransactions(string memory dataHash) public {
        string memory newTransaction = dataHash;
        emit RequestingTransaction(newTransaction);
    }
    function transferTransactions(string memory dataHash) public {
        string memory newTransaction = dataHash;
        emit TransferTransaction(newTransaction);
    }
}