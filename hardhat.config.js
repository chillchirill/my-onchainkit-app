require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/e243cf63596b473caf39e10ab0ff67e8",
      accounts: {
        mnemonic: "bird rude run simple peasant meadow walnut clerk direct grab square average"
      }
    }
  }
};
