pragma solidity >=0.7.3;

contract TransactionFactory {
//   using safeMath for uint256;
//   using SafeMath32 for uint32;
//   using SafeMath16 for uint16;

    event NewTransaction();

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
        //string email;
        string role;
    }

    struct ItemsOfInterest {
        ItemType itemtype;
        Item[] items;
        uint32 quantity;
    }

    struct Transaction {
        string id;
        string receiptNumber;
        User user;
        string transactionType;

        Department department;
        string source;
        uint requiredDate;
        uint returnedDate;

        ItemsOfInterest[] receivedItems;
        ItemsOfInterest[] requestedItems;
        ItemsOfInterest transferredItems;
        ItemsOfInterest returenedItems;

    }

    

} 