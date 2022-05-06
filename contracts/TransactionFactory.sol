// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;
pragma experimental ABIEncoderV2;

contract TransactionFactory {
//   using safeMath for uint256;
//   using SafeMath32 for uint32;
//   using SafeMath16 for uint16;


    event NewReturningTransaction(string id, string receiptNumber, string user, string department, uint returnedDate, string[] returnedItems);
    event NewReceivingTransaction(string id, string receiptNumber, string user, string source, string[] receivedItems);
    event NewRequestingTransaction(string id, string receiptNumber, string user, string department, uint requiredDate, string[] requestedItems);
    event NewTransferredTransaction(string id, string receiptNumber, string department, string requestingTransaction, string transferredItem );

    event NewUser(string id, string username, string email,  string role);
    event NewDepartment(string id, string name);
    event UpdateRole(string username, string oldRole, string newRole);
    event UpdatePassword(string username, string message);
    event NewItem(string id, Department department, ItemType itemType, uint32 price);
    event NewSubinventory(string id, string name);

    struct Item {
        string id;
        Department department;
        ItemType itemType;
        uint32 price;
        //Subinventory subinventory;
    }

    struct Department {
        string id;
        string name;
    }

    struct ItemType {
        string id;
        string name;
        string itemCode;
    }

    struct Subinventory {
        string id;
        string name;
    }

    struct User {
        string id;
        string username;
        string email;
        string role;
    }

    struct ItemsOfInterest {
        string status;
        ItemType itemtype;
        // mapping(uint => Item) items;

        Item[] items;
        uint32 quantity;
        uint32 unitCost;
    }

    struct Transaction {
        string id;
        string receiptNumber;
        string user;

        string department;
        string source;
        uint requiredDate;
        uint returnedDate;
        string requestingTransaction;
        string transferredItem;

        mapping(uint => string) returnedItems;
        mapping(uint => string) requestedItems;
        mapping(uint => string) receivedItems;
    }

    Department[] public departments;
    ItemType[] public itemTypes;
    Item[] public items;
    User[] public users;
    Subinventory[] public subinventories;

    mapping(string => ItemsOfInterest) list;
    mapping(uint => Transaction) transactions;
    uint32 transactionSize = 0;
    Transaction[] public transactionsArray; // when to use
    
    string[] public dataHashes; 
    mapping (bytes32 => Transaction) hashToTransaction;

    function createUsers( string memory id, string memory username, string memory email, string memory role) public {
        users.push(User(id, username, email, role));
        emit NewUser(id, username, email, role);
    }
    function updateRole(string memory username, string memory newRole) public {
        string memory oldRole;
        for (uint i =0; i<users.length ; i++){
            if (keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))) {
                oldRole = users[i].role;
                users[i].role = newRole;
            }
        }
        emit UpdateRole(username, oldRole, newRole);
    }
    function changePassword(string memory username) public {
        string memory message;
        for (uint i =0; i<users.length ; i++){
            if (keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))) {
                message = "Success";
            }
        }
        emit UpdatePassword(username, message);
    }

    function createDepartment(string memory id, string memory name)  external {
        departments.push(Department(id,name));
    }

    function createItemType(string memory id, string memory name, string memory itemCode) external {
        itemTypes.push(ItemType(id, name, itemCode));
    }

    function createItem(string memory id, Department memory department, ItemType memory itemType, uint32 price) public {
        items.push(Item(id, department, itemType, price));
        emit NewItem(id, department, itemType, price);
    }

    function createSubinventory(string memory id, string memory name) public {
        subinventories.push(Subinventory(id, name));
        emit NewSubinventory(id, name);
    }

    function createItemsOfInterest(string memory status, ItemType memory itemType, Item[] memory item, uint32 quantity, uint32 unitCost) internal pure returns (ItemsOfInterest memory){
        return ItemsOfInterest(status, itemType, item, quantity, unitCost); //to be called from interact.js prior to calling createTransaction
    }

    function returnedTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, uint returnedDate, string[] memory itemsOfInterest) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.returnedDate = returnedDate;
        for(uint j=0; j<itemsOfInterest.length; j++){
            t.returnedItems[j] = itemsOfInterest[j];
        }
        emit NewReturningTransaction(t.id, t.receiptNumber, t.user, t.department, t.returnedDate, itemsOfInterest);
    }
    function receivedTransaction(string memory id, string memory receiptNumber, string memory user, string memory source,  string[] memory itemsOfInterest) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.source = source;
        for(uint j=0; j<itemsOfInterest.length; j++){
            t.receivedItems[j] = itemsOfInterest[j];
        }
        emit NewReceivingTransaction(t.id, t.receiptNumber, t.user, t.source, itemsOfInterest);
    }

    function requestingTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, uint requiredDate, string[] memory itemsOfInterest) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.requiredDate = requiredDate;
        for(uint j=0; j<itemsOfInterest.length; j++){
            t.requestedItems[j] = itemsOfInterest[j];
        }
        emit NewRequestingTransaction(t.id, t.receiptNumber, t.user, t.department, t.requiredDate, itemsOfInterest);        
    }

    function transferTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, string memory requestingTransactions, string memory itemsOfInterest) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.requestingTransaction = requestingTransactions;
        t.transferredItem = itemsOfInterest;
        emit NewTransferredTransaction(t.id, t.receiptNumber, t.department, t.requestingTransaction, t.transferredItem);
    }   


     

} 