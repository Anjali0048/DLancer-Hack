require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337 
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    coinex: {
      url: "https://testnet-rpc.coinex.net",
      accounts: ["ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      chainId: 53
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};