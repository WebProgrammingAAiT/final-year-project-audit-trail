
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
    
    // sample function calls below

    // testTransfer();
    // testRequest();
    // testReturn();
    // testReceiving();
    
    testGetters();

    trailsUpdate.on('NewTrail', () => {
        console.log("New trail: ",trails.length,"\nStatus : Pending");
        // TODO call audit with trail
        console.log("With trail:", trails[trails.length -1].id);
    })

    trailsUpdate.on('StatusChanged', (status) => {
        console.log("Status :", status);
    })

}
async function testReceiving() {
    const auditTrailContract = await getContract();
    const recitems = [["id", 'type', 'quantity', 'unitcost','subs'],["id2", 'type2', 'quantity2', 'unitcost2','subs2']];
    const newitems = [['1','2','3'],['4','5']];
    const receive = await auditTrailContract.createReceivingTransaction('id', 'src', 'recno','user','ttype', recitems, newitems);
    console.log(receive.hash);
    trails.push({"id":"tid", "data":"dataHash", "hash":receive.hash});
    trailsUpdate.emit('NewTrail');
    await receive.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");

    // const gets = await auditTrailContract.getReceivingTransactions();
    // console.log("\n\nGETS:: \n\n",gets);
    // console.log("\n\n\n RECEIVED",gets[0].receivedItems);
    // console.log("\n\n\n ITEMS",gets[0].receivedItems[1].items);

}
async function testTransfer() {
    const auditTrailContract = await getContract();
    const transitems = ["itemtype", "quantity"];
    const newItems = ["it1", "it2"];
    const create = await auditTrailContract.createTransferringTransaction("id", "reqtrans", "dept", "recno", "user", "transferringTransaction", transitems, newItems);

    console.log(create.hash);
    trails.push({"id":"tid", "data":"dataHash", "hash":create.hash});
    trailsUpdate.emit('NewTrail');
    await create.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");

}
async function testReturn() {
    const auditTrailContract = await getContract();
    const resitems = [['id3', 'item3', 'type3', 'status3'], ['id2', 'item2', 'type2', 'status2'], ['id', 'item', 'type','status']];
    const create = await auditTrailContract.createReturningTransaction('id2', 'dept2', 'retdate2', 'recno2', 'user', 'type', resitems);
    console.log(create.hash);
    trails.push({"id":"tid", "data":"dataHash", "hash":create.hash});
    trailsUpdate.emit('NewTrail');
    await create.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");
}
async function testRequest() {
    const auditTrailContract = await getContract();
    const resitems = [['id', 'type', 'status', 'quantity'], ['id', 'type', 'status', 'quantity']];
    const create = await auditTrailContract.createRequestingTransaction('id', 'dept', 'reqdate', 'recno', 'user', 'type', resitems);
    console.log(create.hash);
    trails.push({"id":"tid", "data":"dataHash", "hash":create.hash});
    trailsUpdate.emit('NewTrail');
    await create.wait();
    trailsUpdate.emit('StatusChanged', "Complete");
    console.log("completed");

}
async function testGetters() {
    const auditTrailContract = await getContract();

    const transfer = await auditTrailContract.getTransferTransaction("id");
    console.log("TRANSFER: ", transfer);

    const request = await auditTrailContract.getRequestingTransaction("id");
    console.log("REQUEST: ", request);

    const returned = await auditTrailContract.getReturningTransaction("id2");
    console.log("RETURNED: ", returned);

    const received = await auditTrailContract.getReceivingTransaction('id');
    console.log("RECEIVED: ", received);
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

main(); 