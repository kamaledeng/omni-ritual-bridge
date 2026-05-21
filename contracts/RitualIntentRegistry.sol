// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RitualIntentRegistry
/// @notice Stores cross-chain bridge intents and AI/policy verdicts on Ritual testnet.
contract RitualIntentRegistry {
    enum Verdict {
        NONE,
        APPROVED,
        REVIEW,
        REJECTED
    }

    struct BridgeIntent {
        address requester;
        address recipient;
        address token;
        uint256 amount;
        uint256 srcChainId;
        uint256 dstChainId;
        string instruction;
        bytes32 intentHash;
        Verdict verdict;
        string reason;
        uint64 createdAt;
        uint64 finalizedAt;
    }

    address public owner;
    mapping(address => bool) public verifiers;
    mapping(bytes32 => BridgeIntent) public intents;
    bytes32[] public intentIds;

    event IntentCreated(
        bytes32 indexed intentId,
        address indexed requester,
        uint256 indexed dstChainId,
        address recipient,
        address token,
        uint256 amount,
        string instruction
    );

    event IntentFinalized(
        bytes32 indexed intentId,
        address indexed verifier,
        Verdict verdict,
        string reason
    );

    event VerifierUpdated(address indexed verifier, bool enabled);
    event OwnerTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "NOT_VERIFIER");
        _;
    }

    constructor() {
        owner = msg.sender;
        verifiers[msg.sender] = true;
        emit VerifierUpdated(msg.sender, true);
    }

    function createIntent(
        uint256 srcChainId,
        uint256 dstChainId,
        address recipient,
        address token,
        uint256 amount,
        string calldata instruction
    ) external returns (bytes32 intentId) {
        require(recipient != address(0), "BAD_RECIPIENT");
        require(amount > 0, "BAD_AMOUNT");
        require(bytes(instruction).length > 0, "EMPTY_INSTRUCTION");

        intentId = keccak256(
            abi.encode(
                msg.sender,
                recipient,
                token,
                amount,
                srcChainId,
                dstChainId,
                instruction,
                block.chainid,
                block.number,
                intentIds.length
            )
        );

        intents[intentId] = BridgeIntent({
            requester: msg.sender,
            recipient: recipient,
            token: token,
            amount: amount,
            srcChainId: srcChainId,
            dstChainId: dstChainId,
            instruction: instruction,
            intentHash: intentId,
            verdict: Verdict.NONE,
            reason: "",
            createdAt: uint64(block.timestamp),
            finalizedAt: 0
        });
        intentIds.push(intentId);

        emit IntentCreated(
            intentId,
            msg.sender,
            dstChainId,
            recipient,
            token,
            amount,
            instruction
        );
    }

    function finalizeIntent(
        bytes32 intentId,
        Verdict verdict,
        string calldata reason
    ) external onlyVerifier {
        BridgeIntent storage intent = intents[intentId];
        require(intent.requester != address(0), "UNKNOWN_INTENT");
        require(intent.verdict == Verdict.NONE || intent.verdict == Verdict.REVIEW, "FINAL");
        require(verdict != Verdict.NONE, "BAD_VERDICT");

        intent.verdict = verdict;
        intent.reason = reason;
        intent.finalizedAt = uint64(block.timestamp);

        emit IntentFinalized(intentId, msg.sender, verdict, reason);
    }

    function setVerifier(address verifier, bool enabled) external onlyOwner {
        require(verifier != address(0), "BAD_VERIFIER");
        verifiers[verifier] = enabled;
        emit VerifierUpdated(verifier, enabled);
    }

    function transferOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "BAD_OWNER");
        emit OwnerTransferred(owner, newOwner);
        owner = newOwner;
        verifiers[newOwner] = true;
        emit VerifierUpdated(newOwner, true);
    }

    function intentCount() external view returns (uint256) {
        return intentIds.length;
    }

    function getIntent(bytes32 intentId) external view returns (BridgeIntent memory) {
        return intents[intentId];
    }

    function getIntentIds(uint256 offset, uint256 limit) external view returns (bytes32[] memory ids) {
        uint256 total = intentIds.length;
        if (offset >= total) {
            return new bytes32[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        ids = new bytes32[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            ids[i - offset] = intentIds[i];
        }
    }
}
