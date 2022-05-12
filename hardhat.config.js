/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config({path:__dirname+'/.env'})
 require("@nomiclabs/hardhat-ethers")
 
 const { API_URL, PRIVATE_KEY } = process.env
 
 module.exports = {
  solidity: "0.8.13",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: API_URL, 
      accounts: [PRIVATE_KEY], 
      gasLimit: 10000000,
   },
  },
 }