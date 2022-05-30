const { API_URL, PRIVATE_KEY, ALCHEMY_KEY, CONTRACT_ADDRESS } = process.env;

const hash = require("object-hash");
const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/TransactionFactory.sol/TransactionFactory.json");
const EventEmitter = require("events");
// const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
// const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const trails = [];
const transactionsList = []; // store a list of transactions
const trailsUpdate = new EventEmitter();

const provider = new ethers.providers.AlchemyProvider("rinkeby", ALCHEMY_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function getContract() {
  // const [owner, randomPerson] = await hre.ethers.getSigners();
  // const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
  return auditTrailContract;
}
// const [owner, randomPerson] = await hre.ethers.getSigners();
// const auditTrailContract = new ethers.Contract(AUDIT_ADDRESS, contract.abi, owner);
// return auditTrailContract;

async function main() {
  // sample function calls below
  try {
    // testTransfer();
    // testRequest();
    await testReturn();
    // testReceiving();
    // await testGetters();

    trailsUpdate.on("NewTrail", () => {
      console.log("New trail: ", trails.length, "\nStatus : Pending");
      // TODO call audit with trail
      console.log("With trail:", trails[trails.length - 1].id);
    });

    trailsUpdate.on("StatusChanged", (status) => {
      console.log("Status :", status);
    });
  } catch (err) {
    console.log(err);
  }
}

async function validate(id, hash) {
  const auditTrailContract = await getContract();
  const validate = await auditTrailContract.validateTransaction(id, hash);
  console.log("validate: ", validate);
}

async function testReceiving() {
  try {
    const auditTrailContract = await getContract();
    let receivingTransaction = {
      _id: "62927455f12b702f6e8cae81",
      source: "1001",
      receivedItems: [
        {
          itemType: "627119e949d48e67c9ca5cf7",
          items: [
            "62927448f12b702f6e8cae69",
            "62927449f12b702f6e8cae6b",
            "6292744af12b702f6e8cae6d",
            "6292744af12b702f6e8cae6f",
            "6292744bf12b702f6e8cae71",
            "6292744cf12b702f6e8cae73",
          ],
          quantity: 6,
          unitCost: 15000,
          subinventory: "6252bd5e85093e0c778f062b",
          _id: "62927455f12b702f6e8cae82",
        },
        {
          itemType: "62711a6549d48e67c9ca5d00",
          items: [
            "62927454f12b702f6e8cae77",
            "62927454f12b702f6e8cae79",
            "62927454f12b702f6e8cae7b",
            "62927455f12b702f6e8cae7d",
            "62927455f12b702f6e8cae7f",
          ],
          quantity: 5,
          unitCost: 20000,
          subinventory: "6252bd5e85093e0c778f062b",
          _id: "62927455f12b702f6e8cae83",
        },
      ],
      receiptNumber: "6-87799987144193--451",
      user: "6252eab687ec4852535ca063",
      type: "Receiving_Transaction",
      createdAt: { $date: { $numberLong: "1653765205888" } },
      updatedAt: { $date: { $numberLong: "1653765205888" } },
      __v: 0,
    };
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

    let itemsOfInterest = [];
    let newItems = [];
    let id = receivingTransaction._id;
    let { receiptNumber, user, source } = receivingTransaction;

    for (let i = 0; i < receivingTransaction.receivedItems.length; i++) {
      let receivedItem = receivingTransaction.receivedItems[i];
      let { itemType, subinventory, quantity, unitCost, _id: objId } = receivedItem;
      itemsOfInterest.push([objId, itemType, quantity.toString(), unitCost.toString(), subinventory]);
      newItems.push(receivedItem.items);
    }

    let dataHash = hash(receivingTransaction);

    // const recitems = [
    //   ["id", "type", "quantity", "unitcost", "subs"],
    //   ["id2", "type2", "quantity2", "unitcost2", "subs2"],
    // ];
    // const newitems = [
    //   ["1", "2", "3"],
    //   ["4", "5"],
    // ];

    const receive = await auditTrailContract.createReceivingTransaction(
      dataHash,
      id,
      source,
      receiptNumber,
      user,
      "Receiving_Transaction",
      itemsOfInterest,
      newItems
    );
    console.log(receive.hash);
    trails.push({ id: "tid", data: "dataHash", hash: receive.hash });
    trailsUpdate.emit("NewTrail");
    await receive.wait();
    trailsUpdate.emit("StatusChanged", "Complete");
    console.log("completed");

    validate(id, dataHash);

    // const gets = await auditTrailContract.getReceivingTransactions();
    // console.log("\n\nGETS:: \n\n",gets);
    // console.log("\n\n\n RECEIVED",gets[0].receivedItems);
    // console.log("\n\n\n ITEMS",gets[0].receivedItems[1].items);
  } catch (err) {
    console.log(err);
  }
}
async function testTransfer() {
  let transferringTransaction = {
    _id: "628a0fedc47bdf1102df1ce8",
    requestingTransaction: "6288ab110520a1dd5868e480",
    department: "624c33a58a6223667774a9f8",
    transferredItems: {
      itemType: "627119e949d48e67c9ca5cf7",
      items: ["627aa53ce962e4578b20fce8"],
      quantity: 1,
    },
    receiptNumber: "646052581641703649636",
    user: "6282102a815a1e45fc7fb135",
    type: "Transferring_Transaction",
    createdAt: { $date: { $numberLong: "1653215213705" } },
    updatedAt: { $date: { $numberLong: "1653215213705" } },
    __v: 0,
  };
  let itemsOfInterest = [
    transferringTransaction.transferredItems["itemType"],
    transferringTransaction.transferredItems["quantity"].toString(),
  ];
  let newItems = transferringTransaction.transferredItems.items;

  let id = transferringTransaction._id;
  let { requestingTransaction, department, receiptNumber, user } = transferringTransaction;

  let dataHash = hash(transferringTransaction);

  const auditTrailContract = await getContract();
  // const transitems = ["itemtype", "quantity"];
  // const newitems = ["it1", "it2"];
  const create = await auditTrailContract.createTransferringTransaction(
    dataHash,
    id,
    requestingTransaction,
    department,
    receiptNumber,
    user,
    "Transferring_Transaction",
    itemsOfInterest,
    newItems
  );
  console.log("create: ", create.hash);
  trails.push({ id: "tid", data: "dataHash", hash: create.hash });
  trailsUpdate.emit("NewTrail");
  await create.wait();
  trailsUpdate.emit("StatusChanged", "Complete");

  validate(id, dataHash);
}
async function testReturn() {
  let txHash = "";
  try {
    let returningTransaction = {
      _id: "6283744afe37953da19d7eeb",
      department: "624c33a58a6223667774a9f8",
      returnedDate: "2022-04-15T11:26:45.532Z",
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

    let id = returningTransaction._id;
    let { receiptNumber, user, department, returnedDate } = returningTransaction;

    for (let i = 0; i < returningTransaction.returnedItems.length; i++) {
      let returnedItem = returningTransaction.returnedItems[i];
      let { item, itemType, status, _id: objId } = returnedItem;
      itemsOfInterest.push([objId, item, itemType, status]);
    }
    // console.log(itemsOfInterest);
    // return;
    let dataHash = hash(returningTransaction);
    const auditTrailContract = await getContract();
    // const resitems = [
    //   ["id3", "item3", "type3", "status3"],
    //   ["id2", "item2", "type2", "status2"],
    //   ["id", "item", "type", "status"],
    // ];
    const create = await auditTrailContract.createReturningTransaction(
      dataHash,
      id,
      department,
      returnedDate,
      receiptNumber,
      user,
      "Returning_Transaction",
      itemsOfInterest
    );
    txHash = create.hash;
    console.log(create.hash);
    trails.push({ id: "tid", data: "dataHash", hash: create.hash });
    trailsUpdate.emit("NewTrail");
    await create.wait();
    trailsUpdate.emit("StatusChanged", "Complete");

    validate(id, dataHash);
  } catch (err) {
    console.log(err); // 'Failed test'
  }
}
async function testRequest() {
  const auditTrailContract = await getContract();

  let requestingTransaction = {
    _id: "62920d4246729540aaaec1c4",
    department: "624c33a58a6223667774a9f8",
    requiredDate: "2022-04-15T11:26:45.532Z",
    requestedItems: [
      {
        itemType: "627119e949d48e67c9ca5cf7",
        quantity: 1,
        status: "pending",
        _id: "62920d4246729540aaaec1c5",
      },
    ],
    receiptNumber: "--01424-8150407-77328",
    user: "627e06ab1d35ceb41ec6ba79",
    type: "Requesting_Transaction",
    createdAt: { $date: { $numberLong: "1653738818412" } },
    updatedAt: { $date: { $numberLong: "1653738818412" } },
    __v: 0,
  };
  let itemsOfInterest = [];
  let id = requestingTransaction._id;
  let { receiptNumber, user, department, requiredDate } = requestingTransaction;
  for (let i = 0; i < requestingTransaction.requestedItems.length; i++) {
    let requestedItem = requestingTransaction.requestedItems[i];
    let { itemType, status, quantity, _id: objId } = requestedItem;
    itemsOfInterest.push([objId, itemType, status, quantity.toString()]);
  }
  let dataHash = hash(requestingTransaction);

  // const resitems = [
  //   ["id", "type", "status", "quantity"],
  //   ["id", "type", "status", "quantity"],
  // ];
  const create = await auditTrailContract.createRequestingTransaction(
    dataHash,
    id,
    department,
    requiredDate,
    receiptNumber,
    user,
    "Requesting_Transaction",
    itemsOfInterest
  );
  console.log(create.hash);
  trails.push({ id: "tid", data: "dataHash", hash: create.hash });
  trailsUpdate.emit("NewTrail");
  await create.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");

  validate(id, dataHash);
}
async function testGetters() {
  const auditTrailContract = await getContract();

  const received = await auditTrailContract.getReceivingTransaction("id");
  console.log("RECEIVED: ", received);

  const transfer = await auditTrailContract.getTransferTransaction("id2");
  console.log("TRANSFER: ", transfer);

  const returned = await auditTrailContract.getReturningTransaction("id3");
  console.log("RETURNED: ", returned);

  const request = await auditTrailContract.getRequestingTransaction("id4");
  console.log("REQUEST: ", request);
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
// main();
// testReceiving();
// getReceivingTransaction();
// testRequest();
// testTransfer();
// testReturn();
// getTransferringTransaction("628a0fedc47bdf1102df1ce8");
// getReturningTransaction("6283744afe37953da19d7eeb");
getRequestingTransaction("62920d4246729540aaaec1c4");
// validate("628ca362987fb5c971616bb2", "dataHash");
