
const { API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env


const { ethers } = require("hardhat");
const contract = require("../artifacts\contracts\AuditTrail.sol\AuditTrail.json");
//console.log(JSON.stringify(contract.abi));

const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const auditTrailContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    // const message = await auditTrailContract.message();
    // console.log("The message is: " + message);

    // console.log("Updating the message...");
    // const tx = await auditTrailContract.update("This is a new message");
    // await tx.wait();
    // console.log(tx);

    // const newMessage = await helloWorldContract.message();
    // console.log("The new message is: " + newMessage)
}

main(); 