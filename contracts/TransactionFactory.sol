// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;
//pragma experimental ABIEncoderV2;

contract TransactionFactory {
//   using safeMath for uint256;
//   using SafeMath32 for uint32;
//   using SafeMath16 for uint16;


    event NewTransaction(string id, string receiptNumber, User user, Department department, string source, uint requiredDate, uint returnedDate);
    event NewUser(string id, string username, string email, string password, string role);
    event UpdateRole(string username, string oldRole, string newRole);
    event UpdatePassword(string username, string oldPassword, string oldRole);
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
        string password;
        string role;
    }

    struct ItemsOfInterest {
        string status;
        ItemType itemtype;
        Item[] items;
        uint32 quantity;
        uint32 unitCost;
    }

    struct Transaction {
        string id;
        string receiptNumber;
        User user;
        //string transactionType;

        Department department;
        string source;
        uint requiredDate;
        uint returnedDate;

    }

    Department[] public departments;
    ItemType[] public itemTypes;
    Item[] public items;
    User[] public users;
    Subinventory[] public subinventories;
    Transaction[] public transactions;


    mapping (string => Transaction) hashToTransaction;

    function createUsers( string memory id, string memory username, string memory email, string memory password, string memory role) public {
        users.push(User(id, username, email, password, role));
        emit NewUser(id, username, email, password, role);
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
    function changePassword(string memory username, string memory newPassword) public {
        string memory oldPassword;
        for (uint i =0; i<users.length ; i++){
            if (keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))) {
                oldPassword = users[i].password;
                users[i].password = newPassword;
            }
        }
        emit UpdateRole(username, oldPassword, newPassword);
    }

    function _createDepartment(string memory id, string memory name)  internal {
        departments.push(Department(id,name));
    }

    function _createItemType(string memory id, string memory name, string memory itemCode) internal {
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

    function createItemsOfInterest(string memory status, ItemType memory itemType, Item[] memory item, uint32 quantity, uint32 unitCost) public pure returns (ItemsOfInterest memory){
        return ItemsOfInterest(status, itemType, item, quantity, unitCost); //to be called from interact.js prior to calling createTransaction
    }

    //TO-DO define individual functions for all 4 kinds of transactions
    function createTransaction(string memory id, string memory receiptNumber, User memory user, Department memory department, 
        string memory source, uint requiredDate, uint returnedDate) public {
        transactions.push(Transaction(id, receiptNumber, user, department, source, requiredDate, returnedDate));
       
        emit NewTransaction(id, receiptNumber, user, department, source, requiredDate, returnedDate);
    }


} 