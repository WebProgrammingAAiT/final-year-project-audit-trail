const hre = require("hardhat");

async function main() {
  // const AuditTrail = await ethers.getContractFactory("AuditTrail");
  console.log("Started deploying");
  // const audit_trail = await AuditTrail.deploy();

  // const [owner, randomPerson] = await hre.ethers.getSigners();
  // compiling our smart contract
  const transactionContractFactory = await hre.ethers.getContractFactory("AuditTrail");
  // deploying our smart contract after hardhat creates a local ethereum network
  const transactionContract = await transactionContractFactory.deploy();
  // probably waiting for the transaction to be mined
  await transactionContract.deployed();
  // getting the address of our deployed smart contract
  console.log("Contract deployed to this address ", transactionContract.address);
  // console.log("Contract deployed by ", owner.address);

  // console.log("Contract deployed to address: ", audit_trail.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
