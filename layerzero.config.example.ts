import { EndpointId } from "@layerzerolabs/lz-definitions";
import type { OmniPointHardhat } from "@layerzerolabs/toolbox-hardhat";
import { OAppEnforcedOption } from "@layerzerolabs/toolbox-hardhat";
import { ExecutorOptionType } from "@layerzerolabs/lz-v2-utilities";
import { TwoWayConfig, generateConnectionsConfig } from "@layerzerolabs/metadata-tools";

const baseSepolia: OmniPointHardhat = {
  eid: EndpointId.BASESEP_V2_TESTNET,
  contractName: "OmniRitualOFT",
};

const sepolia: OmniPointHardhat = {
  eid: EndpointId.SEPOLIA_V2_TESTNET,
  contractName: "OmniRitualOFT",
};

const enforcedOptions: OAppEnforcedOption[] = [
  {
    msgType: 1,
    optionType: ExecutorOptionType.LZ_RECEIVE,
    gas: 80000,
    value: 0,
  },
];

const pathways: TwoWayConfig[] = [
  [
    baseSepolia,
    sepolia,
    [["LayerZero Labs"], []],
    [1, 1],
    [enforcedOptions, enforcedOptions],
  ],
];

export default async function () {
  return {
    contracts: [{ contract: baseSepolia }, { contract: sepolia }],
    connections: await generateConnectionsConfig(pathways),
  };
}

