/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("dotenv").config({ path: __dirname + "/.env" });
require("@nomiclabs/hardhat-ethers");

module.exports = {
  // defaultNetwork: "rinkeby",
  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/WXXVjHy19YKTRP1P59N4fg6t5e8irGFf",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
