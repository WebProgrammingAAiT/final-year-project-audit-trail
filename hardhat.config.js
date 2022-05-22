/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config({path:__dirname+'/.env'})
 require("@nomiclabs/hardhat-ethers")
 
 const { API_URL, PRIVATE_KEY } = process.env
 
 module.exports = {
  // defaultNetwork: "rinkeby",
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
      enabled: true,
      runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: API_URL, 
      accounts: [PRIVATE_KEY], 
      gasLimit: 10000000,
   },
  },
 }