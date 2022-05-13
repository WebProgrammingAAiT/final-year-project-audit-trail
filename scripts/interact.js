// const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env;

// const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/AuditTrail.sol/AuditTrail.json");

// const alchemyProvider = new ethers.providers.AlchemyProvider((network = "rinkeby"), API_KEY);
// const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const contractAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

async function main() {
  // run demo functions here
  createReceiveTransaction();
  //   deploy();
}
async function test() {
  const contract = await getContract();
  const value = await contract.test("my name");
  console.log(value);
}
async function getContract() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const auditTrailContract = new ethers.Contract(contractAddress, contract.abi, owner);
  return auditTrailContract;
}
async function deploy() {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  // compiling our smart contract
  const transactionContractFactory = await hre.ethers.getContractFactory("AuditTrail");
  // deploying our smart contract after hardhat creates a local ethereum network
  const transactionContract = await transactionContractFactory.deploy();
  // probably waiting for the transaction to be mined
  await transactionContract.deployed();
  // getting the address of our deployed smart contract
  console.log("Contract deployed to this address ", transactionContract.address);
  console.log("Contract deployed by ", owner.address);
}
async function createUser(id, name, username, role) {
  const tx = await auditTrailContract.createUsers(id, name, username, role);
  // TODO give specific args
  // could help to show data on fe
  auditTrailContract.on("NewUser", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log(tx.hash);
}
async function updateRole(username, role) {
  const tx = await auditTrailContract.updateRole(username, role);
  // TODO give specific args
  auditTrailContract.on("UpdateRole", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log(tx.hash);
}

async function createDepartment(id, name) {
  const tx = await auditTrailContract._createDepartment(id, name);
  // TODO give specific args
  auditTrailContract.on("NewDepartment", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log(tx.hash);
}
async function createItem(id, dept, itemType, price) {
  const tx = await auditTrailContract.createUsers(id, dept, itemType, price);
  // TODO give specific args
  auditTrailContract.on("NewItem", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  // maybe this was why he was doing the "can only be audited once" thing?
  await tx.wait();
  console.log(tx.hash);
}
async function createSubinvenory(id, name) {
  const tx = await auditTrailContract.createSubinvenory(id, name);
  // TODO give specific args
  auditTrailContract.on("NewSubinventory", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log(tx.hash);
}

async function createReturnTransaction() {
  // TODO call createItemsOfInterest with predefined ids/addresses
  // TODO create an array of said ids and put it in items[]
  // TODO said items passed to all specific transactions.
  const items = ["obect1", "object2"];
  // TODO give specific args
  const tx = await auditTrailContract.returnedTransaction("fifth", "005", "Neba", "ITSC", 12, items);
  auditTrailContract.on("NewReturningTransaction", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log("hash: " + tx.hash);
  //console.log("data: " + tx.data);
}
async function createReceiveTransaction() {
  // TODO call createItemsOfInterest with predefined ids/addresses
  // TODO create an array of said ids and put it in items[]
  // TODO said items passed to all specific transactions.
  const items = [
    ["abc", "def"],
    ["hij", "klm"],
  ];
  const receivedItems = [
    {
      itemType: "123",
      items: 0,
      quantity: 10,
      unitCost: 100,
      subinventory: "aaa",
    },
    {
      itemType: "456",
      items: 1,
      quantity: 20,
      unitCost: 500,
      subinventory: "bbb",
    },
  ];
  // TODO give specific args
  const auditTrailContract = await getContract();
  const tx = await auditTrailContract.receivedTransaction("sixth", "002", "Neba2", "Elec", items, receivedItems);
  console.log(tx.hash);
  //   auditTrailContract.on("NewReceivingTransaction", async (...args) => {
  //     console.log("trans:", args[args.length - 1].transactionHash);
  //   });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  //   await tx.wait();
  //   console.log("hash: " + tx.hash);
}

async function createRequestTransaction() {
  // TODO call createItemsOfInterest with predefined ids/addresses
  // TODO create an array of said ids and put it in items[]
  // TODO said items passed to all specific transactions.
  const items = ["obect1", "object2"];
  // TODO give specific args
  // it's printing hashes of past, mined transactions. ???
  const tx = await auditTrailContract.requestingTransaction("second", "002", "Neba", "Elec", 112, items);
  auditTrailContract.on("NewRequestingTransaction", async (...args) => {
    console.log("trans:", args[args.length - 1].transactionHash);
  });
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log("hash:", tx.hash);
}
async function createTransferTransaction() {
  // TODO call createItemsOfInterest with predefined ids/addresses called item
  // TODO said item passed to all specific transactions.
  const item = ["object1"];
  // TODO give specific args
  const tx = await auditTrailContract.transferTransaction("second", "002", "user", "department", "tranaction no_3", item);
  auditTrailContract.on("NewTransferredTransaction", async (...args) => {
    console.log("trans", args[args.length - 1].transactionHash);
  });
  // TODO make it quit checking
  // TODO call audit for all trans loaded[iterate through an array of loaded transaction hash]
  await tx.wait();
  console.log("hash:", tx.hash);
}

main();
