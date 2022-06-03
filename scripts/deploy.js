const hre = require("hardhat");
async function main() {
  console.log("Started deploying");
  // compiling our smart contract
  const transactionContractFactory = await hre.ethers.getContractFactory("TransactionFactory");
  // deploying our smart contract after hardhat creates a local ethereum network
  const transactionContract = await transactionContractFactory.deploy();
  // waiting for the transaction to be mined
  await transactionContract.deployed();
  // getting the address of our deployed smart contract
  console.log("Contract deployed to this address ", transactionContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
