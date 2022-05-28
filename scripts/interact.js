const { ALCHEMY_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

const { ethers } = require("hardhat");
const hash = require("object-hash");

const contract = require("../artifacts/contracts/AuditTrail.sol/AuditTrail.json");
const EventEmitter = require("events");

// const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
// const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const trails = [];
const transactionsList = []; // store a list of transactions
const trailsUpdate = new EventEmitter();

async function getContract() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
  return auditTrailContract;
}

async function main() {
  try {
    // var itemsOfInterest = [
    //   ["available", "type", "12", "12"],
    //   ["gone", "type", "13", "13"],
    // ];
    // var newItems = [
    //   [
    //     ["id2", "dpt", "type", "12"],
    //     ["id", "dpt", "type", "12"],
    //   ],
    //   [["id3", "src", "type", "45"]],
    // ];

    // sample function calls below

    // createReturnTransaction("first", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("second", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("third", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("forth", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("fifth", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");

    // createDepartment("id1", "name1", "tid1", "dataHash1");
    // createDepartment("id2", "name2", "tid2", "dataHash2");
    // createDepartment("id3", "name3", "tid3", "dataHash3");

    // receiving
    // let receivingTransaction = {
    //   _id: "628ca362987fb5c971616bb2",
    //   source: "11002",
    //   receivedItems: [
    //     {
    //       itemType: "627119e949d48e67c9ca5cf7",
    //       items: [
    //         "628ca362987fb5c971616ba6",
    //         "628ca362987fb5c971616ba8",
    //         "628ca362987fb5c971616baa",
    //         "628ca362987fb5c971616bac",
    //         "628ca362987fb5c971616bae",
    //         "628ca362987fb5c971616bb0",
    //       ],
    //       quantity: 6,
    //       unitCost: 15000,
    //       subinventory: "6252bc2a85093e0c778f0627",
    //       _id: "628ca362987fb5c971616bb3",
    //     },
    //   ],
    //   receiptNumber: "09583646612-781344612",
    //   user: "6280b80f4aca065e37681b74",
    //   type: "Receiving_Transaction",
    //   createdAt: { $date: { $numberLong: "1653384034730" } },
    //   updatedAt: { $date: { $numberLong: "1653384034730" } },
    //   __v: 0,
    // };
    // let itemsOfInterest = [];
    // let newItems = [];
    // let id = receivingTransaction._id;
    // let { receiptNumber, user, source } = receivingTransaction;

    // for (let i = 0; i < receivingTransaction.receivedItems.length; i++) {
    //   let receivedItem = receivingTransaction.receivedItems[i];
    //   let { itemType, subinventory, quantity, unitCost } = receivedItem;
    //   itemsOfInterest.push(["", itemType, quantity.toString(), unitCost.toString()]);
    //   let itemsOfCurrentIteration = [];
    //   for (let j = 0; j < receivedItem.items.length; j++) {
    //     let item = receivedItem.items[j];
    //     itemsOfCurrentIteration.push([item, "", itemType, unitCost.toString()]);
    //   }
    //   newItems.push(itemsOfCurrentIteration);
    // }
    // console.log({ itemsOfInterest, newItems });
    // createReceiveTransaction(id, receiptNumber, user, source, itemsOfInterest, newItems, "tid", "datahash");
    // createRequestTransaction('id', 'recno', 'user', 'dpt', 'date', itemsOfInterest, items, 'tid', 'datahash');
    // createTransferTransaction('id', 'receiptNumber', 'user', 'dpt', 'reqtrans', itemsOfInterest, items, 'tid', 'datahash');

    // returning
    let returningTransaction = {
      _id: "6283744afe37953da19d7eea",
      department: "624c33a58a6223667774a9f8",
      returnedDate: "2022-05-17",
      returnedItems: [
        {
          item: "62557b6345d54c7c7118bdfa",
          itemType: "6252c670f5992c9b958f2ce5",
          status: "pending",
          _id: "6283744afe37953da19d7eeb",
        },
        {
          item: "62557b6345d54c7c7118bdf8",
          itemType: "6252c670f5992c9b958f2ce5",
          status: "pending",
          _id: "62852552220d16fa3598bf0a",
        },
      ],
      receiptNumber: "862295428975720061461",
      user: "627e06ab1d35ceb41ec6ba79",
      type: "Returning_Transaction",
      createdAt: { $date: { $numberLong: "1652782154784" } },
      updatedAt: { $date: { $numberLong: "1652893010619" } },
      __v: 0,
    };
    let itemsOfInterest = [];
    let newItems = [];
    let id = returningTransaction._id;
    let { receiptNumber, user, department, returnedDate } = returningTransaction;

    for (let i = 0; i < returningTransaction.returnedItems.length; i++) {
      let returnedItem = returningTransaction.returnedItems[i];
      let { itemType, item, status } = returnedItem;
      itemsOfInterest.push([status, itemType, "", ""]);
      newItems.push([[item, department, itemType, ""]]);
    }
    // console.log({ itemsOfInterest, newItems });
    // createReturnTransaction(id, receiptNumber, user, department, returnedDate, itemsOfInterest, newItems, "tid", "dataHash");
    // getDepts();

    transact = await getTransactions();
    console.log(transact[6].transactedItems[1].items);

    trailsUpdate.on("NewTrail", () => {
      console.log("New trail: ", trails.length, "\nStatus : Pending");
      // TODO call audit with trail
      console.log("With trail:", trails[trails.length - 1].id);
    });

    trailsUpdate.on("StatusChanged", (status) => {
      console.log("Status :", status);
    });
  } catch (error) {
    console.log("in error");
    console.log(error);
  }
}
async function audit(transactions) {
  for (transaction in transactions) {
    const tx = await auditTrailContract.audit(transaction[tid], transaction[dataHash]);
  }
  console.log(tx);
}
async function validate(transactions) {
  for (transaction in transactions) {
    const tx = await auditTrailContract.validate(transaction[tid], transaction[dataHash]);
  }
  console.log(tx);
}
async function createUser(id, name, username, role, tid, dataHash) {
  const tx = await auditTrailContract.createUsers(id, name, username, role);
  console.log("hash :", tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}
async function updateRole(username, role, tid, dataHash) {
  const tx = await auditTrailContract.updateRole(username, role);
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}

async function createDepartment(id, name, tid, dataHash) {
  const auditTrailContract = await getContract();

  const tx = await auditTrailContract.createDepartment(id, name);
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ tid, dataHash, hash });
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}
async function createItem(id, dept, itemType, price, tid, dataHash) {
  const tx = await auditTrailContract.createUsers(id, dept, itemType, price);
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}
async function createSubinvenory(id, name, tid, dataHash) {
  const tx = await auditTrailContract.createSubinvenory(id, name);
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}

async function createReturnTransaction(
  id,
  receiptNumber,
  user,
  department,
  returnedDate,
  itemsofinterest,
  newitems,
  tid,
  dataHash
) {
  const auditTrailContract = await getContract();
  const tx = await auditTrailContract.returnedTransaction(
    id,
    receiptNumber,
    user,
    department,
    returnedDate,
    itemsofinterest,
    newitems
  );
  console.log(tx.hash);

  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
}
async function createReceiveTransaction(id, receiptNumber, user, source, itemsofinterest, newitems, tid, dataHash) {
  try {
    const auditTrailContract = await getContract();

    const tx = await auditTrailContract.receivedTransaction(id, receiptNumber, user, source, itemsofinterest, newitems);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({ id: tid, data: dataHash, hash: hash });
    trailsUpdate.emit("NewTrail", trails[trails.length - 1]);
    await tx.wait();
    trailsUpdate.emit("StatusChanged", "Complete");
    console.log("completed");
  } catch (error) {
    console.log(error);
  }
}

async function createRequestTransaction(
  id,
  receiptNumber,
  user,
  department,
  requiredDate,
  itemsofinterest,
  newitems,
  tid,
  dataHash
) {
  const tx = await auditTrailContract.requestingTransaction(
    id,
    receiptNumber,
    user,
    department,
    requiredDate,
    itemsofinterest,
    newitems
  );
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}
async function createTransferTransaction(
  id,
  receiptNumber,
  user,
  department,
  requestingTransaction,
  itemsofinterest,
  newitems,
  tid,
  dataHash
) {
  const tx = await auditTrailContract.transferTransaction(
    id,
    receiptNumber,
    user,
    department,
    requestingTransaction,
    itemsofinterest,
    newitems
  );
  console.log(tx.hash);
  hash = tx.hash;
  trails.push({ id: tid, data: dataHash, hash: hash });
  trailsUpdate.emit("NewTrail");
  await tx.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");
}

async function getTransactions() {
  const auditTrailContract = await getContract();

  const lmapping = await auditTrailContract.getInterestWithTransactions();
  const imapping = await auditTrailContract.getItemsWithInterest();

  const items = await auditTrailContract.getItems();
  const lists = await auditTrailContract.getInterest();
  const transactions = await auditTrailContract.getTransactions();

  // console.log(lists);

  for (i = 0; i < transactions.length; i++) {
    // console.log(transactions[i].id);
    var transactedList = [];

    for (j = 0; j < lists.length; j++) {
      var transactedItems = {
        item_status: "",
        itemType: "",
        unitCost: "",
        quantity: "",
        items: [],
      };
      if (lmapping[j] == transactions[i].id) {
        // console.log(j, lists[j].status, transactions[i].id);
        transactedItems.item_status = lists[j].status;
        transactedItems.itemType = lists[j].itemtype;
        transactedItems.quantity = lists[j].quantity;
        transactedItems.unitCost = lists[j].unitCost;
        transactedItems.items = [];
        for (k = 0; k < items.length; k++) {
          if (imapping[k] == j) {
            // console.log(k, "for list", j, "with status:", lists[j].status);
            transactedItems.items.push(items[k]);
          }
        }
        // console.log(transactedItems);
        transactedList.push(transactedItems);
      }
    }
    transactionsList[i] = {
      id: transactions[i].id,
      receiptNumber: transactions[i].receiptNumber,
      user: transactions[i].user,
      department: transactions[i].department,
      source: transactions[i].source,
      requiredDate: transactions[i].requiredDate,
      returnedDate: transactions[i].returnedDate,
      requestingTransaction: transactions[i].requestingTransaction,
      transferredItem: transactions[i].transferredItem,
      transactedItems: transactedList,
    };
    // console.log(transactedList);
  }
  // console.log(transactionsList);

  return transactionsList;
}
async function getDepts() {
  const auditTrailContract = await getContract();
  const tx = await auditTrailContract.getDepartments();
  console.log(tx[0].id == "id2");
  return tx;
}

// main();

const testHash = () => {
  let returningTransaction = {
    _id: "6283744afe37953da19d7eea",
    department: "624c33a58a6223667774a9f8",
    returnedDate: "2022-05-17",
    returnedItems: [
      {
        item: "62557b6345d54c7c7118bdfa",
        itemType: "6252c670f5992c9b958f2ce5",
        status: "pending",
        _id: "6283744afe37953da19d7eeb",
      },
      {
        item: "62557b6345d54c7c7118bdf8",
        itemType: "6252c670f5992c9b958f2ce5",
        status: "pending",
        _id: "62852552220d16fa3598bf0a",
      },
    ],
    receiptNumber: "862295428975720061461",
    user: "627e06ab1d35ceb41ec6ba79",
    type: "Returning_Transaction",
    createdAt: { $date: { $numberLong: "1652782154784" } },
    updatedAt: { $date: { $numberLong: "1652893010619" } },
    __v: 0,
  };
  let dataHash = hash(returningTransaction);
  console.log({ dataHash });
};

testHash();
