const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env;

const hash = require("object-hash");
const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/TransactionFactory.sol/TransactionFactory.json");

const EventEmitter = require("events");

const trails = [];
const transactionsList = []; // store a list of transactions
const trailsUpdate = new EventEmitter();

async function getContract() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
  return auditTrailContract;
}

async function main() {
  // sample function calls below
  try {
    // await testTransfer();
    await testRequest();
    // await testReturn();
    // await testReceiving();
    // await updateStatus();
    // await testGetters();
  } catch (err) {
    console.log(err);
  }
}

async function validate(id, hash, transactionType, statuses) {
  const auditTrailContract = await getContract();
  const validate = await auditTrailContract.validateTransaction(id, hash, transactionType, statuses);
  console.log("validate of", id, ": ", validate);
}

async function testReceiving() {
  try {
    const auditTrailContract = await getContract();
    // let receivingTransaction = {
    //   _id: "62927455f12b702f6e8cae81",
    //   source: "1001",
    //   receivedItems: [
    //     {
    //       itemType: "627119e949d48e67c9ca5cf7",
    //       items: [
    //         "62927448f12b702f6e8cae69",
    //         "62927449f12b702f6e8cae6b",
    //         "6292744af12b702f6e8cae6d",
    //         "6292744af12b702f6e8cae6f",
    //         "6292744bf12b702f6e8cae71",
    //         "6292744cf12b702f6e8cae73",
    //       ],
    //       quantity: 6,
    //       unitCost: 15000,
    //       subinventory: "6252bd5e85093e0c778f062b",
    //       _id: "62927455f12b702f6e8cae82",
    //     },
    //     {
    //       itemType: "62711a6549d48e67c9ca5d00",
    //       items: [
    //         "62927454f12b702f6e8cae77",
    //         "62927454f12b702f6e8cae79",
    //         "62927454f12b702f6e8cae7b",
    //         "62927455f12b702f6e8cae7d",
    //         "62927455f12b702f6e8cae7f",
    //       ],
    //       quantity: 5,
    //       unitCost: 20000,
    //       subinventory: "6252bd5e85093e0c778f062b",
    //       _id: "62927455f12b702f6e8cae83",
    //     },
    //   ],
    //   receiptNumber: "6-87799987144193--451",
    //   user: "6252eab687ec4852535ca063",
    //   type: "Receiving_Transaction",
    //   createdAt: { $date: { $numberLong: "1653765205888" } },
    //   updatedAt: { $date: { $numberLong: "1653765205888" } },
    //   __v: 0,
    // };
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
    //   let { itemType, subinventory, quantity, unitCost, _id: objId } = receivedItem;
    //   let itemTypeId = itemType._id;
    //   let itemTypeName = itemType.name;
    //   let subinventoryId = subinventory._id;
    //   let subinventoryName = subinventory.name;
    //   itemsOfInterest.push([
    //     objId,
    //     itemTypeId,
    //     itemTypeName,
    //     quantity.toString(),
    //     unitCost.toString(),
    //     subinventoryId,
    //     subinventoryName,
    //   ]);
    //   newItems.push(receivedItem.items);
    // }

    // let dataHash = hash(receivingTransaction);

    const recitems = [
      ["id", "typeid", "typename", "quantity", "unitcost", "subsid", "subsname"],
      ["id2", "typeid2", "typename2", "quantity2", "unitcost2", "subsid2", "subsname2"],
    ];
    const newitems = [
      ["1", "2", "3"],
      ["4", "5"],
    ];

    const receive = await auditTrailContract.createReceivingTransaction(
      "dataHash",
      "id6",
      "isReturn6",
      "source6",
      "receiptNumber6",
      "user6",
      "Receiving_Transaction",
      recitems,
      newitems,
      "createdAt",
      "updatedAt"
    );
    console.log(receive.hash);
    await receive.wait();

    const received = await auditTrailContract.getReceivingTransaction("id6");
    console.log("RECEIVED: ", received);

    validate("id6", "dataHash", "Receiving_Transaction", []);
  } catch (err) {
    console.log(err);
  }
}
async function testTransfer() {
  // let transferringTransaction = {
  //   _id: "628a0fedc47bdf1102df1ce8",
  //   requestingTransaction: "6288ab110520a1dd5868e480",
  //   department: "624c33a58a6223667774a9f8",
  //   transferredItems: {
  //     itemType: "627119e949d48e67c9ca5cf7",
  //     items: ["627aa53ce962e4578b20fce8"],
  //     quantity: 1,
  //   },
  //   receiptNumber: "646052581641703649636",
  //   user: "6282102a815a1e45fc7fb135",
  //   type: "Transferring_Transaction",
  //   createdAt: { $date: { $numberLong: "1653215213705" } },
  //   updatedAt: { $date: { $numberLong: "1653215213705" } },
  //   __v: 0,
  // };
  // let itemsOfInterest = [
  //   transferringTransaction.transferredItems["itemType"]._id,
  //   transferringTransaction.transferredItems["itemType"].name,
  //   transferringTransaction.transferredItems["quantity"].toString(),
  // ];
  // let newItems = transferringTransaction.transferredItems.items;

  // let id = transferringTransaction._id;
  // let { requestingTransaction, department, receiptNumber, user } = transferringTransaction;

  // let departmentId = department._id;
  // let departmentName = department.name;

  // let dataHash = hash(transferringTransaction);

  const auditTrailContract = await getContract();
  const transitems = ["itemtypeid", "itemtypename", "quantity"];
  const newitems = ["it1", "it2"];
  const create = await auditTrailContract.createTransferringTransaction(
    "dataHash",
    "id5",
    "requestingTransaction5",
    "departmentId5",
    "departmentName5",
    "receiptNumber5",
    "user5",
    "Transferring_Transaction",
    transitems,
    newitems,
    "createdAt",
    "updatedAt"
  );

  console.log(create.hash);
  const transfer = await auditTrailContract.getTransferTransaction("id5");
  console.log("TRANSFER: ", transfer);

  validate("id5", "dataHassh", "Transferring_Transaction", []);
}
async function testReturn() {
  // let txHash = "";
  // auditTrailContract = await getContract();
  try {
    //   let returningTransaction = {
    //     _id: "6283744afe37953da19d7eeb",
    //     department: "624c33a58a6223667774a9f8",
    //     returnedDate: "2022-04-15T11:26:45.532Z",
    //     returnedItems: [
    //       {
    //         item: "62557b6345d54c7c7118bdfa",
    //         itemType: "6252c670f5992c9b958f2ce5",
    //         status: "pending",
    //         _id: "6283744afe37953da19d7eeb",
    //       },
    //       {
    //         item: "62557b6345d54c7c7118bdf8",
    //         itemType: "6252c670f5992c9b958f2ce5",
    //         status: "pending",
    //         _id: "62852552220d16fa3598bf0a",
    //       },
    //     ],
    //     receiptNumber: "862295428975720061461",
    //     user: "627e06ab1d35ceb41ec6ba79",
    //     type: "Returning_Transaction",
    //     createdAt: { $date: { $numberLong: "1652782154784" } },
    //     updatedAt: { $date: { $numberLong: "1652893010619" } },
    //     __v: 0,
    //   };
    //   let id = returningTransaction._id;
    //   let { receiptNumber, user, department, returnedDate } = returningTransaction;
    //   let departmentId = department._id;
    //   let departmentName = department.name;

    // let itemsOfInterest = [];
    // for (let i = 0; i < returningTransaction.returnedItems.length; i++) {
    //   let returnedItem = returningTransaction.returnedItems[i];
    //   let { item, itemType, status, _id: objId } = returnedItem;
    //   let itemTypeId = itemType._id;
    //   let itemTypeName = itemType.name;
    //   itemsOfInterest.push([objId, item, itemTypeId, itemTypeName, status]);
    // }
    //   console.log(itemsOfInterest);
    //   // return;
    //   let dataHash = hash(returningTransaction);

    const auditTrailContract = await getContract();
    const resitems = [
      ["id3", "item3", "typeid3", "typename3", "status3", ""],
      ["id2", "item2", "typeid2", "typename2", "status2", ""],
      ["id", "item", "typeid", "typename", "status", ""],
    ];
    const create = await auditTrailContract.createReturningTransaction(
      "dataHash",
      "id",
      "departmentId",
      "departmentName",
      "returnedDate",
      "receiptNumber",
      "user",
      "Returning_Transaction",
      resitems,
      "createdAt",
      "updatedAt"
    );
    txHash = create.hash;
    console.log(create.hash);
    const returned = await auditTrailContract.getReturningTransaction("id");
    console.log("RETURN: ", returned);
    validate("id", "dataHash", "Returning_Transaction", ["status3", "status2", "status"]);
  } catch (err) {
    console.log("ERROR", err); // 'Failed test'
  }
}
async function testRequest() {
  const auditTrailContract = await getContract();

  // let requestingTransaction = {
  //   _id: "62920d4246729540aaaec1c4",
  //   department: "624c33a58a6223667774a9f8",
  //   requiredDate: "2022-04-15T11:26:45.532Z",
  //   requestedItems: [
  //     {
  //       itemType: "627119e949d48e67c9ca5cf7",
  //       quantity: 1,
  //       status: "pending",
  //       _id: "62920d4246729540aaaec1c5",
  //     },
  //   ],
  //   receiptNumber: "--01424-8150407-77328",
  //   user: "627e06ab1d35ceb41ec6ba79",
  //   type: "Requesting_Transaction",
  //   createdAt: { $date: { $numberLong: "1653738818412" } },
  //   updatedAt: { $date: { $numberLong: "1653738818412" } },
  //   __v: 0,
  // };
  // let itemsOfInterest = [["objId", "itemTypeId", "itemTypeName", "status", "quantity"],["objId", "itemTypeId", "itemTypeName", "status", "quantity"]];
  // let id = requestingTransaction._id;
  // let { receiptNumber, user, department, requiredDate } = requestingTransaction;
  // let departmentId = department._id;
  // let departmentName = department.name;
  // for (let i = 0; i < requestingTransaction.requestedItems.length; i++) {
  //   let requestedItem = requestingTransaction.requestedItems[i];
  //   let { itemType, status, quantity, _id: objId } = requestedItem;
  //   let itemTypeId = itemType._id;
  //   let itemTypeName = itemType.name;
  //   itemsOfInterest.push([objId, itemTypeId, itemTypeName, status, quantity.toString()]);
  // }
  // let dataHash = hash(requestingTransaction);

  const resitems = [
    ["id", "typeid", "typename", "status", "", "remarks1", "quantity"],
    ["id2", "typeid2", "typename2", "status2", "", "remarks1", "quantity2"],
  ];

  const create = await auditTrailContract.createRequestingTransaction(
    "dataHash",
    "id2",
    "departmentId2",
    "departmentName2",
    "requiredDate2",
    "receiptNumber2",
    "user2",
    "Requesting_Transaction",
    resitems,
    "createdAt",
    "updatedBy"
  );
  console.log(create.hash);

  const request = await auditTrailContract.getRequestingTransaction("id2");
  console.log("REQUEST: ", request);

  validate("id2", "dataHash", "Requesting_Transaction", ["status", "status2"]);
}

async function updateStatus() {
  const auditTrailContract = await getContract();

  const update = auditTrailContract.updateStatus("id2", "Requesting_Transaction", 0, "newStatus", "remark", "userId2");
  console.log(update.hash);
  validate("id2", "dataHash", "Requesting_Transaction", ["newStatus", "status2"]);

  const update2 = auditTrailContract.updateStatus("id", "Returning_Transaction", 0, "newStatus", "", "userId2");
  console.log(update2.hash);
  validate("id", "dataHash", "Returning_Transaction", ["newStatus", "status2", "status"]);
}

async function testGetters() {
  const auditTrailContract = await getContract();

  // const received = await auditTrailContract.getReceivingTransaction("62ae38367b2f802ca40c752a");
  // console.log("RECEIVED: ", received);

  // const transfer = await auditTrailContract.getTransferTransaction("62ae2c99aab85734ec7d5415");
  // console.log("TRANSFER: ", transfer);

  const returned = await auditTrailContract.getReturningTransaction("62ae3ce77a2bbfe9cc6752bf");
  console.log("RETURNED: ", returned);

  // const request = await auditTrailContract.getRequestingTransaction("62ae3b5b972aa59271df317b");
  // console.log("REQUEST: ", request);
}
async function getReceivingTransaction() {
  const auditTrailContract = await getContract();

  const received = await auditTrailContract.getReceivingTransaction("62927455f12b702f6e8cae81");

  let { id, source, user, receiptNumber, receivedItems: receivedItemsFromBlockchain } = received;
  let receivedItems = [];
  for (let i = 0; i < receivedItemsFromBlockchain.length; i++) {
    let receivedItem = receivedItemsFromBlockchain[i];
    let { id, itemType, quantity, unitCost, subinventory, items } = receivedItem;
    receivedItems.push({ id, itemType, quantity, unitCost, subinventory, items });
  }
  let transaction = { id, source, user, receiptNumber, receivedItems };
  console.log(transaction);
  return transaction;
}
async function getRequestingTransaction(_id) {
  const auditTrailContract = await getContract();

  const request = await auditTrailContract.getRequestingTransaction(_id);
  let { id, department, requiredDate, user, receiptNumber, requestedItems: requestedItemsFromBlockchain } = request;
  let requestedItems = [];
  for (let i = 0; i < requestedItemsFromBlockchain.length; i++) {
    let requestedItem = requestedItemsFromBlockchain[i];
    let { id, itemType, quantity, status } = requestedItem;
    requestedItems.push({ id, itemType, quantity, status });
  }
  let transaction = { id, user, department, requiredDate, receiptNumber, requestedItems };
  console.log(transaction);
  return transaction;
}
async function getTransferringTransaction(_id) {
  const auditTrailContract = await getContract();

  const transfer = await auditTrailContract.getTransferTransaction(_id);
  let { id, department, requestingTransaction, user, receiptNumber, transferredItems: transferredItemsFromBlockchain } = transfer;

  let { itemType, quantity, items } = transferredItemsFromBlockchain;
  let transferredItems = { itemType, quantity, items };

  let transaction = { id, user, department, requestingTransaction, receiptNumber, transferredItems };
  console.log(transaction);
  return transaction;
}

async function getReturningTransaction(_id) {
  const auditTrailContract = await getContract();

  const returned = await auditTrailContract.getReturningTransaction(_id);
  let { id, department, returnedDate, user, receiptNumber, returnedItems: returnedItemsFromBlockchain } = returned;
  let returnedItems = [];
  for (let i = 0; i < returnedItemsFromBlockchain.length; i++) {
    let returnedItem = returnedItemsFromBlockchain[i];
    let { id, item, itemType, status } = returnedItem;
    returnedItems.push({ id, item, itemType, status });
  }
  let transaction = { id, department, user, returnedDate, receiptNumber, returnedItems };
  console.log(transaction);
  return transaction;
}

testGetters();
// main();
// testReceiving();
// getReceivingTransaction();
// testRequest();
// testTransfer();
// testReturn();
// getTransferringTransaction("628a0fedc47bdf1102df1ce8");
// getReturningTransaction("6283744afe37953da19d7eeb");
// getRequestingTransaction("62920d4246729540aaaec1c4");
// validate("628ca362987fb5c971616bb2", "dataHash");
