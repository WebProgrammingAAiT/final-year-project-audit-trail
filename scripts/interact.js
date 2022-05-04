
const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env


const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/AuditTrail.sol/AuditTrail.json");
//console.log(JSON.stringify(contract.abi));

const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
}
async function createUser(id, name, username, role){
    const tx = await auditTrailContract.createUsers(id, name, username, role);
    await tx.wait();
    console.log(tx.hash);
}
async function updateRole(username, role){
    const tx = await auditTrailContract.updateRole(username, role);
    await tx.wait();
    console.log(tx.hash);
}
async function printUsers(){
    const tx = await auditTrailContract.users();
    //for 
    console.log(tx.toString());
}
async function createDepartment(id, name){
    const tx = await auditTrailContract._createDepartment(id, name);
    await tx.wait();
    console.log(tx.hash);
}
async function createItem(id, dept, itemType, price){
    const tx = await auditTrailContract.createUsers(id, dept, itemType, price);
    await tx.wait();
    console.log(tx.hash);
}
async function createSubinvenory(id, name){
    const tx = await auditTrailContract.createSubinvenory(id, name);
    await tx.wait();
    console.log(tx.hash);
}
async function createReturnTransaction() {
    // const tx = await auditTrailContract.createTransaction("fifth", "005", "Neba");
    // await tx.wait();
    // console.log("hash: " + tx.hash);
    
    const items = ["obect1", "object2"];
    const txs = await auditTrailContract.returnedTransaction("fifth", "ITSC", 12, items );
    await txs.wait();
    console.log("hash: " + txs.hash);
    //console.log("data: " + txs.data);
    

}
async function createTransactions(id, receiptNumber, user){
    const tx = await auditTrailContract.createTransaction(id, receiptNumber, user);
    await tx.wait();
    console.log("hash: " + tx.hash);
}

async function createReceiveTransaction() {

    // createTransactions("third", "004", "Bemnet Teklu");
    // TODO call createItemsOfInterest with predefined ids/addresses
    // TODO create an array of said ids and put it in items[]
    // TODO said items passed to all specific transactionss.

    const tx = await auditTrailContract.createTransaction("sixth", "002", "Neba");
    await tx.wait();
    console.log("hash: " + tx.hash);

    const items = ["obect1", "object2"];
    const txs = await auditTrailContract.receivedTransaction("sixth", "Elec", items );
    await txs.wait();
    console.log("hash: " + txs.hash);
    //console.log("data: " + txs.data);
    // const message = await auditTrailContract.transactions();
    // console.log("transactions ", message);
    

}

async function createRequestTransaction() {

    // createTransactions("third", "004", "Bemnet Teklu");
    // TODO call createItemsOfInterest with predefined ids/addresses
    // TODO create an array of said ids and put it in items[]
    // TODO said items passed to all specific transactionss.

    const tx = await auditTrailContract.createTransaction("seventh", "007", "Neba");
    await tx.wait();
    console.log("hash: " + tx.hash);

    const items = ["obect1", "object2"];
    const txs = await auditTrailContract.requestingTransaction("seventh", "Elec", 112, items );
    await txs.wait();
    console.log("hash: " + txs.hash);
    //console.log("data: " + txs.data);
    console.log(txs);
    // const message = await auditTrailContract.transactions();
    // console.log("transactions ", message);
    

}
main(); 