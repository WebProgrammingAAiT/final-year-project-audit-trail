
const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env

const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/AuditTrail.sol/AuditTrail.json");
const EventEmitter = require('events');

const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const trails= [{}]; // store a list of transactions
const trailsUpdate = new EventEmitter();


async function main() {
    
    var itemsOfInterest = [["available", "type", "12", "12"]];
    var items = [[["id", "dpt", "type", "12"], ["id", "dpt", "type", "12"]]]

    // sample function calls below

    // createReturnTransaction("fifth", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReceiveTransaction('id', 'recno', 'user', 'src', itemsOfInterest, items, 'tid', 'datahash');
    // createRequestTransaction('id', 'recno', 'user', 'dpt', 'date', itemsOfInterest, items, 'tid', 'datahash');
    // createTransferTransaction('id', 'receiptNumber', 'user', 'dpt', 'reqtrans', itemsOfInterest, items, 'tid', 'datahash');
   
    trailsUpdate.on('NewTrail', () => {
        console.log("New trail: ",trails.length,"\nStatus : Pending");
        // TODO call audit with trail
        console.log("With trail:", trails[trails.length -1].id);
    })

    trailsUpdate.on('StatusChanged', (status) => {
        console.log("Status :", status);
    })

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
async function createUser(id, name, username, role, tid, dataHash){
    const tx = await auditTrailContract.createUsers(id, name, username, role);
    console.log("hash :",tx.hash); 
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function updateRole(username, role, tid, dataHash){
    const tx = await auditTrailContract.updateRole(username, role);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}

async function createDepartment(id, name, tid, dataHash){
    const tx = await auditTrailContract._createDepartment(id, name);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({tid, dataHash, hash});
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function createItem(id, dept, itemType, price, tid, dataHash){
    const tx = await auditTrailContract.createUsers(id, dept, itemType, price);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function createSubinvenory(id, name, tid, dataHash){
    const tx = await auditTrailContract.createSubinvenory(id, name);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}

async function createReturnTransaction(id, receiptNumber, user, department, returnedDate, itemsofinterest, newitems, tid, dataHash) {
    
    const tx = await auditTrailContract.returnedTransaction(id, receiptNumber, user, department, returnedDate, itemsofinterest, newitems );
    console.log(tx.hash);
    auditTrailContract.on('Thing', async (...args) => {
        console.log("found a thing");
        console.log(args);
    });
    auditTrailContract.on('thing2', async (...args) => {
        console.log("found the other thing");
        console.log(args);
    })
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
}
async function createReceiveTransaction(id, receiptNumber, user, source, itemsofinterest, newitems, tid, dataHash) {

    const tx = await auditTrailContract.receivedTransaction(id, receiptNumber, user, source, itemsofinterest, newitems);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}

async function createRequestTransaction(id, receiptNumber, user, department, requiredDate, itemsofinterest, newitems, tid, dataHash) {

    const tx = await auditTrailContract.requestingTransaction(id, receiptNumber, user, department, requiredDate, itemsofinterest, newitems);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function createTransferTransaction(id, receiptNumber, user, department, requestingTransaction, itemsofinterest, newitems, tid, dataHash) {

    const tx = await auditTrailContract.transferTransaction(id, receiptNumber, user, department, requestingTransaction, itemsofinterest, newitems);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
main(); 