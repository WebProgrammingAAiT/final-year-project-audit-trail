// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;

//pragma experimental ABIEncoderV2;

contract TransactionFactory {

    struct Users {
        string id;
        string createdBy;
        string username;
        string timestamp;
    }
    struct ReceivingTransaction {
        string id;
        string source;
        string receiptNumber;
        string user;
        string transactionType;
        ReceivedItems[] receivedItems;
    }
    struct ReceivedItems {
        string id;
        string itemType;
        string quantity;
        string unitCost;
        string subinventory;
        string[] items;
    }

    struct ReturningTransaction {
        string id;
        string department;
        string returnedDate;
        string receiptNumber;
        string user;
        string transactionType;
        ReturnedItems[] returnedItems;
    }
    struct ReturnedItems {
        string id;
        string item;
        string itemType;
        string status;
    }

    struct TransferringTransaction {
        string id;
        string requestingTransaction;
        string department;
        string receiptNumber;
        string user;
        string transactionType;
        TransferredItems transferredItems;
    }
    struct TransferredItems {
        string itemType;
        string quantity;
        string[] items;
    }

    struct RequestingTransaction {
        string id;
        string department;
        string requiredDate;
        string receiptNumber;
        string user;
        string transactionType;
        RequestedItems[] requestedItems;
    }
    struct RequestedItems {
        string id;
        string itemType;
        string status;
        string quantity;
    }

    mapping(string => TransferringTransaction) transferring;
    mapping(string => ReceivingTransaction) receiving;
    mapping(string => RequestingTransaction) requesting;
    mapping(string => ReturningTransaction) returning;

    mapping(string => Users) users;

    mapping(string => bytes32) public dataHashes;
    string[] public auditedTransactions;
    modifier txDoesntExists(string memory transactionIdentifier) {
        require(
            dataHashes[transactionIdentifier] == 0,
            "A transaction can only be audited once"
        );
        _;
    }

    function auditTransaction(
        string memory transactionIdentifier,
        string memory hash
    ) public {
        bytes32 dataHash = stringToBytes32(hash);
        dataHashes[transactionIdentifier] = dataHash;
        auditedTransactions.push(transactionIdentifier);
    }

    function getAllTransactions() public view returns(string[] memory auditedlist){
        return auditedTransactions;
    }

    function validateTransaction(
        string memory transactionIdentifier,
        string memory hash
    ) public view returns (string memory) {
        bytes32 dataHash = stringToBytes32(hash);
        if (dataHashes[transactionIdentifier] == 0) {
            return "missing";
        } else if (dataHashes[transactionIdentifier] == dataHash) {
            return "valid";
        }
        return "invalid";
    }

    function stringToBytes32(string memory source)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function createUsers(string memory id, string memory username, string memory createdBy, string memory timestamp) public {
        Users storage u = users[id];
        u.username = username;
        u.createdBy = createdBy;
        u.timestamp = timestamp;
    }
    function getUser(string memory id) public view returns (Users memory user){
        user = users[id];
    }

    function createTransferringTransaction(
        string memory dataHash,
        string memory id,
        string memory requestingTransaction,
        string memory department,
        string memory receiptNumber,
        string memory user,
        string memory transactionType,
        string[] memory transferredItems,
        string[] memory newItems
    ) public txDoesntExists(id) {
        TransferredItems memory items = TransferredItems(
            transferredItems[0],
            transferredItems[1],
            newItems
        );
        transferring[id] = TransferringTransaction(
            id,
            requestingTransaction,
            department,
            receiptNumber,
            user,
            transactionType,
            items
        );
        auditTransaction(id, dataHash);
    }

    function getTransferTransaction(string memory id)
        public
        view
        returns (TransferringTransaction memory transaction)
    {
        transaction = transferring[id];
    }

    function createReceivingTransaction(
        string memory dataHash,
        string memory id,
        string memory source,
        string memory receiptNumber,
        string memory user,
        string memory transactionType,
        string[][] memory newReceivedItems,
        string[][] memory newItems
    ) public txDoesntExists(id) {
        ReceivingTransaction storage t = receiving[id];
        t.id = id;
        t.source = source;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.transactionType = transactionType;

        for (uint256 i = 0; i < newReceivedItems.length; i++) {
            t.receivedItems.push();
            t.receivedItems[i].id = newReceivedItems[i][0];
            t.receivedItems[i].itemType = newReceivedItems[i][1];
            t.receivedItems[i].quantity = newReceivedItems[i][2];
            t.receivedItems[i].unitCost = newReceivedItems[i][3];
            t.receivedItems[i].subinventory = newReceivedItems[i][4];
            for (uint256 j = 0; j < newItems[i].length; j++) {
                t.receivedItems[i].items.push();
                t.receivedItems[i].items[j] = newItems[i][j];
            }
        }
        auditTransaction(id, dataHash);
    }

    function getReceivingTransaction(string memory id)
        public
        view
        returns (ReceivingTransaction memory transaction)
    {
        transaction = receiving[id];
    }

    function createRequestingTransaction(
        string memory dataHash,
        string memory id,
        string memory department,
        string memory requiredDate,
        string memory receiptNumber,
        string memory user,
        string memory transactionType,
        string[][] memory newRequestedItems
    ) public txDoesntExists(id) {
        RequestingTransaction storage t = requesting[id];
        t.id = id;
        t.department = department;
        t.requiredDate = requiredDate;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.transactionType = transactionType;

        for (uint256 i = 0; i < newRequestedItems.length; i++) {
            t.requestedItems.push();
            RequestedItems memory requestedItems = RequestedItems(
                newRequestedItems[i][0],
                newRequestedItems[i][1],
                newRequestedItems[i][2],
                newRequestedItems[i][3]
            );
            t.requestedItems[i] = requestedItems;
        }
        auditTransaction(id, dataHash);
    }

    function getRequestingTransaction(string memory id)
        public
        view
        returns (RequestingTransaction memory transaction)
    {
        transaction = requesting[id];
    }

    function createReturningTransaction(
        string memory dataHash,
        string memory id,
        string memory department,
        string memory returnedDate,
        string memory receiptNumber,
        string memory user,
        string memory transactionType,
        string[][] memory newReturnedItems
    ) public txDoesntExists(id) {
        ReturningTransaction storage t = returning[id];
        t.id = id;
        t.department = department;
        t.returnedDate = returnedDate;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.transactionType = transactionType;

        for (uint256 i = 0; i < newReturnedItems.length; i++) {
            t.returnedItems.push();
            ReturnedItems memory returnedItems = ReturnedItems(
                newReturnedItems[i][0],
                newReturnedItems[i][1],
                newReturnedItems[i][2],
                newReturnedItems[i][3]
            );
            t.returnedItems[i] = returnedItems;
        }
        auditTransaction(id, dataHash);
    }

    function getReturningTransaction(string memory id)
        public
        view
        returns (ReturningTransaction memory transaction)
    {
        transaction = returning[id];
    }
}
