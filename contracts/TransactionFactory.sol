// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.8.13;
//pragma experimental ABIEncoderV2;


contract TransactionFactory {

    struct Item {
        string id;
        string department;
        string itemType;
        string price;
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
        string itemtype;
        string quantity;
        string unitCost;
    }

    struct Transaction {
        string id;
        string receiptNumber;
        string user;

        string department;
        string source;
        string requiredDate;
        string returnedDate;
        string requestingTransaction;
        string transferredItem;
    }

    Department[] public departments;
    ItemType[] public itemTypes;
    Item[] public items;
    User[] public users;
    Subinventory[] public subinventories;
    ItemsOfInterest[] public interest;
    Item[] public itemsUnderInterest;
    Transaction[] public transactionList;

    mapping(uint => string) itemsToTransactions;
    mapping(uint => uint) itemsToLists;
    mapping(uint => Transaction) transactions;
    mapping(uint => ItemsOfInterest) list;
    mapping(uint => Item) itemsList;
    uint transactionSize = 0;
    uint listSize = 0;
    uint itemsSize = 0;

    function createUsers( string memory id, string memory username, string memory email, string memory role) public {
        users.push(User(id, username, email, role));
    }
    function updateRole(string memory username, string memory newRole) public {
        string memory oldRole;
        for (uint i =0; i<users.length ; i++){
            if (keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))) {
                oldRole = users[i].role;
                users[i].role = newRole;
            }
        }
    }
    function changePassword(string memory username) public view returns (string memory) {
        string memory message;
        for (uint i =0; i<users.length ; i++){
            if (keccak256(abi.encodePacked(users[i].username)) == keccak256(abi.encodePacked(username))) {
                message = "Success";
            }
        }
        return message;
    }

    function createDepartment(string memory id, string memory name)  external {
        departments.push(Department(id,name));
    }

    function createItemType(string memory id, string memory name, string memory itemCode) external {
        itemTypes.push(ItemType(id, name, itemCode));
    }

    function createItem(string memory id, string memory department, string memory itemType, string memory price) public {
        items.push(Item(id, department, itemType, price));
    }

    function createSubinventory(string memory id, string memory name) public {
        subinventories.push(Subinventory(id, name));
    }

    function returnedTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, string memory returnedDate, string[][] memory itemsOfInterest, string[][][] memory newitems) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.returnedDate = returnedDate;
        
        for(uint j=0; j<itemsOfInterest.length; j++){
            ItemsOfInterest storage i = list[listSize];
            i.status = itemsOfInterest[j][0];
            i.itemtype = itemsOfInterest[j][1];
            for (uint k=0; k<newitems[j].length; k++){
                Item storage item = itemsList[itemsSize];
                item.id = newitems[j][k][0];
                item.department = newitems[j][k][1];
                item.itemType = newitems[j][k][2];
                item.price = newitems[j][k][3];
                itemsToLists[itemsSize] = listSize;
                itemsUnderInterest.push(item);
                itemsSize++;
            }
            i.quantity = itemsOfInterest[j][2];
            i.unitCost = itemsOfInterest[j][3];
            itemsToTransactions[listSize] = t.id;
            interest.push(i);
            listSize++;
        }
        transactionList.push(t);
        
    }
    function receivedTransaction(string memory id, string memory receiptNumber, string memory user, string memory source,  string[][] memory itemsOfInterest, string[][][] memory newitems) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.source = source;
       
        for(uint j=0; j<itemsOfInterest.length; j++){
            ItemsOfInterest storage i = list[listSize];
            i.status = itemsOfInterest[j][0];
            i.itemtype = itemsOfInterest[j][1];
            for (uint k=0; k<newitems[j].length; k++){
                Item storage item = itemsList[itemsSize];
                item.id = newitems[j][k][0];
                item.department = newitems[j][k][1];
                item.itemType = newitems[j][k][2];
                item.price = newitems[j][k][3];
                itemsToLists[itemsSize] = listSize;
                itemsUnderInterest.push(item);
                itemsSize++;
            }
            i.quantity = itemsOfInterest[j][2];
            i.unitCost = itemsOfInterest[j][3];
            itemsToTransactions[listSize] = t.id;
            interest.push();
            listSize++;
        }

    transactionList.push(t);

    }

    function requestingTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, string memory requiredDate, string[][] memory itemsOfInterest, string[][][] memory newitems) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.requiredDate = requiredDate;
      
        for(uint j=0; j<itemsOfInterest.length; j++){
            ItemsOfInterest storage i = list[listSize];
            i.status = itemsOfInterest[j][0];
            i.itemtype = itemsOfInterest[j][1];
            for (uint k=0; k<newitems[j].length; k++){
                Item storage item = itemsList[itemsSize];
                item.id = newitems[j][k][0];
                item.department = newitems[j][k][1];
                item.itemType = newitems[j][k][2];
                item.price = newitems[j][k][3];
                itemsToLists[itemsSize] = listSize;
                itemsUnderInterest.push(item);
                itemsSize++;
            }
            i.quantity = itemsOfInterest[j][2];
            i.unitCost = itemsOfInterest[j][3];
            itemsToTransactions[listSize] = t.id;
            interest.push();
            listSize++;
        }
        transactionList.push(t);
    }

    function transferTransaction(string memory id, string memory receiptNumber, string memory user, string memory department, string memory requestingTransactions, string[][] memory itemsOfInterest, string[][][] memory newitems) public {
        uint transactionsID = transactionSize++;
        Transaction storage t = transactions[transactionsID];
        t.id = id;
        t.receiptNumber = receiptNumber;
        t.user = user;
        t.department = department;
        t.requestingTransaction = requestingTransactions;

        for(uint j=0; j<itemsOfInterest.length; j++){
            ItemsOfInterest storage i = list[listSize];
            i.status = itemsOfInterest[j][0];
            i.itemtype = itemsOfInterest[j][1];
            for (uint k=0; k<newitems[j].length; k++){
                Item storage item = itemsList[itemsSize];
                item.id = newitems[j][k][0];
                item.department = newitems[j][k][1];
                item.itemType = newitems[j][k][2];
                item.price = newitems[j][k][3];
                itemsToLists[itemsSize] = listSize; //listSize as the index of the specific list in the mapping
                itemsUnderInterest.push(item);
                itemsSize++;
            }
            i.quantity = itemsOfInterest[j][2];
            i.unitCost = itemsOfInterest[j][3];
            itemsToTransactions[listSize] = t.id;
            interest.push(i);
            listSize++;
        }
        transactionList.push(t);
    }   
   
    function getDepartments() public view returns (Department[] memory depts){ //can i use this? or sth like this?
        depts = departments; 
    }
    // TODO define getters for every public array like the one for department

    function getInterest() public view returns(ItemsOfInterest[] memory newItemsList) {
        newItemsList = interest;
    }
    function getItems() public view returns (Item[] memory newItems) {
        newItems = itemsUnderInterest;
    }

    function getItemsWithInterest() public view returns(uint[] memory itemsWithInterest){
        uint[] memory return_variables = new uint[](itemsSize);
        for (uint k=0; k<itemsSize; k++){
            return_variables[k] = itemsToLists[k];
        }
        itemsWithInterest = return_variables;
    }

    function getInterestWithTransactions() public view returns(string[] memory interestWithTransactions){
        string[] memory return_variables = new string[](listSize);
        for (uint k=0; k<listSize; k++){
            return_variables[k] = itemsToTransactions[k];
        }
        interestWithTransactions = return_variables;
    }

    function getTransactions() public view returns (Transaction[] memory transaction){
        transaction = transactionList;
    }


} 