const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env;

const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/TransactionFactory.sol/TransactionFactory.json");
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
// const [owner, randomPerson] = await hre.ethers.getSigners();
// const auditTrailContract = new ethers.Contract(AUDIT_ADDRESS, contract.abi, owner);
// return auditTrailContract;

async function main() {
  // sample function calls below

  // testTransfer();
  // testRequest();
  // testReturn();
  // testReceiving();

  testGetters();

  trailsUpdate.on("NewTrail", () => {
    console.log("New trail: ", trails.length, "\nStatus : Pending");
    // TODO call audit with trail
    console.log("With trail:", trails[trails.length - 1].id);
  });

  trailsUpdate.on("StatusChanged", (status) => {
    console.log("Status :", status);
  });
}

async function validate(id, hash) {
  const auditTrailContract = await getContract();
  const validate = await auditTrailContract.validateTransaction(id, hash);
  console.log("validate: ", validate);
}

async function testReceiving() {
  const auditTrailContract = await getContract();

  const recitems = [
    ["id", "type", "quantity", "unitcost", "subs"],
    ["id2", "type2", "quantity2", "unitcost2", "subs2"],
  ];
  const newitems = [
    ["1", "2", "3"],
    ["4", "5"],
  ];
  const receive = await auditTrailContract.createReceivingTransaction(
    "hash2",
    "id",
    "src",
    "recno",
    "user",
    "ttype",
    recitems,
    newitems
  );
  console.log(receive.hash);
  trails.push({ id: "tid", data: "dataHash", hash: receive.hash });
  trailsUpdate.emit("NewTrail");
  await receive.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");

  validate("id", "hash2");

  // const gets = await auditTrailContract.getReceivingTransactions();
  // console.log("\n\nGETS:: \n\n",gets);
  // console.log("\n\n\n RECEIVED",gets[0].receivedItems);
  // console.log("\n\n\n ITEMS",gets[0].receivedItems[1].items);
}
async function testTransfer() {
  const auditTrailContract = await getContract();
  const transitems = ["itemtype", "quantity"];
  const newItems = ["it1", "it2"];
  const create = await auditTrailContract.createTransferringTransaction(
    "hash",
    "id2",
    "reqtrans",
    "dept",
    "recno",
    "user",
    "transferringTransaction",
    transitems,
    newItems
  );
  console.log("create: ", create.hash);
  trails.push({ id: "tid", data: "dataHash", hash: create.hash });
  trailsUpdate.emit("NewTrail");
  await create.wait();
  trailsUpdate.emit("StatusChanged", "Complete");

  validate("id2", "hash2");
}
async function testReturn() {
  const auditTrailContract = await getContract();
  const resitems = [
    ["id3", "item3", "type3", "status3"],
    ["id2", "item2", "type2", "status2"],
    ["id", "item", "type", "status"],
  ];
  const create = await auditTrailContract.createReturningTransaction(
    "hash2",
    "id3",
    "dept2",
    "retdate2",
    "recno2",
    "user",
    "type",
    resitems
  );
  console.log(create.hash);
  trails.push({ id: "tid", data: "dataHash", hash: create.hash });
  trailsUpdate.emit("NewTrail");
  await create.wait();
  trailsUpdate.emit("StatusChanged", "Complete");

  validate("id3", "hash2");
}
async function testRequest() {
  const auditTrailContract = await getContract();
  const resitems = [
    ["id", "type", "status", "quantity"],
    ["id", "type", "status", "quantity"],
  ];
  const create = await auditTrailContract.createRequestingTransaction(
    "hash2",
    "id4",
    "dept",
    "reqdate",
    "recno",
    "user",
    "type",
    resitems
  );
  console.log(create.hash);
  trails.push({ id: "tid", data: "dataHash", hash: create.hash });
  trailsUpdate.emit("NewTrail");
  await create.wait();
  trailsUpdate.emit("StatusChanged", "Complete");
  console.log("completed");

  validate("id4", "hash2");
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

main();
