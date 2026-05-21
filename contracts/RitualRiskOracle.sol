// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title RitualRiskOracle
/// @notice Template for calling Ritual's HTTP precompile to score a bridge intent.
/// @dev Ritual docs define HTTP precompile at 0x0801. The exact request payload should be
/// encoded off-chain with Ritual's 13-field ABI request format.
contract RitualRiskOracle {
    address internal constant HTTP_CALL_PRECOMPILE = 0x0000000000000000000000000000000000000801;

    event RiskRequestSubmitted(bytes32 indexed intentId, bytes encodedRequest);
    event RawRiskResponse(bytes32 indexed intentId, bytes output);

    function requestRiskScore(bytes32 intentId, bytes calldata encodedHttpRequest) external returns (bytes memory output) {
        require(intentId != bytes32(0), "BAD_INTENT");
        require(encodedHttpRequest.length > 0, "EMPTY_REQUEST");

        emit RiskRequestSubmitted(intentId, encodedHttpRequest);

        (bool ok, bytes memory result) = HTTP_CALL_PRECOMPILE.call(encodedHttpRequest);
        require(ok, "HTTP_PRECOMPILE_FAILED");

        emit RawRiskResponse(intentId, result);
        return result;
    }
}
