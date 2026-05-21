import "hardhat-deploy";
import "@nomicfoundation/hardhat-ethers";
import "@layerzerolabs/toolbox-hardhat";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import type { HardhatUserConfig } from "hardhat/config";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.22",
  networks: {
    "base-sepolia": {
      eid: EndpointId.BASESEP_V2_TESTNET,
      url: process.env.RPC_URL_BASE_SEPOLIA || "https://sepolia.base.org",
      accounts,
    },
    sepolia: {
      eid: EndpointId.SEPOLIA_V2_TESTNET,
      url: process.env.RPC_URL_SEPOLIA || "https://sepolia.drpc.org",
      accounts,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;

