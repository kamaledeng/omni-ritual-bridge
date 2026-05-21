// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

/// @title OmniRitualOFT
/// @notice Real LayerZero OFT token for supported chains such as Base Sepolia and Ethereum Sepolia.
/// @dev Deploy one instance per supported LayerZero chain, then wire peers with LayerZero tooling.
contract OmniRitualOFT is OFT, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address endpoint,
        address owner
    ) OFT(name, symbol, endpoint, owner) Ownable(owner) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

