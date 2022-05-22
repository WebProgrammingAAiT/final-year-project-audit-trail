
const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env

const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/AuditTrail.sol/AuditTrail.json");
const EventEmitter = require('events');

// const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
// const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
// const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
const trails= []; 
const transactionsList = [];// store a list of transactions
const trailsUpdate = new EventEmitter();


async function getContract() {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
    return auditTrailContract;
}

async function main() {
    
    var itemsOfInterest = [["available", "type", "12", "12"], ["gone", "type", "13", "13"]];
    var items = [[["id2", "dpt", "type", "12"], ["id", "dpt", "type", "12"]], [["id3", "src", "type", "45"]]]

    // sample function calls below

    // createReturnTransaction("first", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("second", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("third", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("forth", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
    // createReturnTransaction("fifth", "005", "Neba", "ITSC", "date", itemsOfInterest, items, "tid", "dataHash");
   
    // createDepartment("id1", "name1", "tid1", "dataHash1");
    // createDepartment("id2", "name2", "tid2", "dataHash2");
    // createDepartment("id3", "name3", "tid3", "dataHash3");
   
    // createReceiveTransaction('id', 'recno', 'user', 'src', itemsOfInterest, items, 'tid', 'datahash');
    // createRequestTransaction('id', 'recno', 'user', 'dpt', 'date', itemsOfInterest, items, 'tid', 'datahash');
    // createTransferTransaction('id', 'receiptNumber', 'user', 'dpt', 'reqtrans', itemsOfInterest, items, 'tid', 'datahash');
    // getDepts();
    transact = await getTransactions();
    console.log(transact);



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
    const auditTrailContract = await getContract();

    const tx = await auditTrailContract.createDepartment(id, name);
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
    const auditTrailContract = await getContract();
    const tx = await auditTrailContract.returnedTransaction(id, receiptNumber, user, department, returnedDate, itemsofinterest, newitems );
    console.log(tx.hash);

    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail');
    await tx.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
}
async function createReceiveTransaction(id, receiptNumber, user, source, itemsofinterest, newitems, tid, dataHash) {
    const auditTrailContract = await getContract();

    const tx = await auditTrailContract.receivedTransaction(id, receiptNumber, user, source, itemsofinterest, newitems);
    console.log(tx.hash);
    hash = tx.hash;
    trails.push({"id":tid, "data":dataHash, "hash":hash});
    trailsUpdate.emit('NewTrail', trails[trails.length - 1]);
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

async function getTransactions() {
    const auditTrailContract = await getContract();
;

    const lmapping = await auditTrailContract.getInterestWithTransactions();
    const imapping = await auditTrailContract.getItemsWithInterest();

    const items = await auditTrailContract.getItems();
    const lists = await auditTrailContract.getInterest();
    const transactions = await auditTrailContract.getTransactions();

    for(i=0; i<transactions.length; i++){
        // console.log(transactions[i].id);
        var transactedList = [];
        var transactedItems = {
            item_status : "",
            itemType: "",
            unitCost: "",
            quantity: "",
            items: []
        };
        for(j=0; j<lists.length;j++ ){
            if(lmapping[j]==transactions[i].id){
                // console.log(j, lists[j].status, transactions[i].id);
                transactedItems.item_status = lists[j].status,
                transactedItems.itemType = lists[j].itemType,
                transactedItems.quantity = lists[j].quantity,
                transactedItems.unitCost = lists[j].unitCost
                for(k=0;k<items.length;k++){
                    if(imapping[k]==j){
                        transactedItems.items.push(items[k]);
                    }
                }
                transactedList.push(transactedItems);
            }

        }
        transactionsList[i] = {
            "id": transactions[i].id,
            "receiptNumber": transactions[i].receiptNumber,
            "user": transactions[i].user,
            "department": transactions[i].department,
            "source": transactions[i].source,
            "requiredDate": transactions[i].requiredDate,
            "returnedDate": transactions[i].returnedDate,
            "requestingTransaction": transactions[i].requestingTransaction,
            "transferredItem": transactions[i].transferredItem,
            "transactedItems" : transactedList
        }
    }
    // console.log(transactionsList);
    return transactionsList;

}
async function getDepts(){
    const auditTrailContract = await getContract();
    const tx = await auditTrailContract.getDepartments();
    console.log(tx[0].id == "id2");
    return tx;
}


main(); 