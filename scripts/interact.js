
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
    trailsUpdate.on('NewTrail', () => {
        console.log("New trail: ",trails.length);
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

async function createReturnTransaction(tid, dataHash) {

    // ItemsOfInterest object structure with sample parameters shown below
    var items = {status: "available", itemType: {id:"type id", name:"itemtype name", itemCode: "code"}, items: [{id:"itemid", department: {id:"deptid", name:"deptname"}, itemType: {id: "typeid", name:"typename", itemCode:"typecode"}, price:12}], quantity:12, unitCost:12};

    const tx = await auditTrailContract.returnedTransaction("fifth", "005", "Neba", "ITSC", 12, items );
    console.log(tx.hash);

    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function createReceiveTransaction() {

    // TODO create ItemsOfInterest from DB, replace items

    const items = ["obect1", "object2"];
    const tx = await auditTrailContract.receivedTransaction("sixth", "002", "Neba", "Elec", items );
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}

async function createRequestTransaction() {

    // TODO create ItemsOfInterest from DB, replace items

    const items = ["obect1", "object2"];
    const tx = await auditTrailContract.requestingTransaction("second","002", "Neba", "Elec", 112, items );
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function createTransferTransaction() {
    // TODO create ItemsOfInterest from DB, replace items

    const item = ["object1"]; 
    const tx = await auditTrailContract.transferTransaction("second", "002","user", "department", "tranaction no_3", item);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
main(); 