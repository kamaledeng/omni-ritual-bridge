// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RitualIntentRegistry.sol";

interface ILayerZeroEndpointV2Like {
    struct MessagingFee {
        uint256 nativeFee;
        uint256 lzTokenFee;
    }

    struct MessagingReceipt {
        bytes32 guid;
        uint64 nonce;
        MessagingFee fee;
    }

    function send(
        uint32 dstEid,
        bytes calldata receiver,
        bytes calldata message,
        bytes calldata options,
        address refundAddress
    ) external payable returns (MessagingReceipt memory receipt);
}

/// @title RitualLayerZeroGateway
/// @notice Minimal gateway template. Enable once Ritual has public LayerZero Endpoint V2 support.
contract RitualLayerZeroGateway {
    RitualIntentRegistry public immutable registry;
    ILayerZeroEndpointV2Like public immutable endpoint;
    address public owner;

    mapping(uint32 => bytes32) public peers;

    event PeerSet(uint32 indexed eid, bytes32 peer);
    event ApprovedIntentSent(bytes32 indexed intentId, uint32 indexed dstEid, bytes32 guid);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address registryAddress, address endpointAddress) {
        require(registryAddress != address(0), "BAD_REGISTRY");
        require(endpointAddress != address(0), "BAD_ENDPOINT");
        registry = RitualIntentRegistry(registryAddress);
        endpoint = ILayerZeroEndpointV2Like(endpointAddress);
        owner = msg.sender;
    }

    function setPeer(uint32 eid, bytes32 peer) external onlyOwner {
        require(peer != bytes32(0), "BAD_PEER");
        peers[eid] = peer;
        emit PeerSet(eid, peer);
    }

    function sendApprovedIntent(
        bytes32 intentId,
        uint32 dstEid,
        bytes calldata options
    ) external payable returns (bytes32 guid) {
        RitualIntentRegistry.BridgeIntent memory intent = registry.getIntent(intentId);
        require(intent.requester != address(0), "UNKNOWN_INTENT");
        require(intent.verdict == RitualIntentRegistry.Verdict.APPROVED, "NOT_APPROVED");
        require(peers[dstEid] != bytes32(0), "NO_PEER");

        bytes memory message = abi.encode(
            intentId,
            intent.requester,
            intent.recipient,
            intent.token,
            intent.amount,
            intent.srcChainId,
            intent.dstChainId,
            intent.instruction
        );

        ILayerZeroEndpointV2Like.MessagingReceipt memory receipt = endpoint.send{value: msg.value}(
            dstEid,
            abi.encodePacked(peers[dstEid]),
            message,
            options,
            msg.sender
        );

        emit ApprovedIntentSent(intentId, dstEid, receipt.guid);
        return receipt.guid;
    }
}
