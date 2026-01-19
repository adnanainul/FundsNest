// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PitchRegistry {
    struct PitchRecord {
        string pitchId;
        string startupId;
        string investorId;
        string contentHash;
        uint256 timestamp;
        bool verified;
    }

    mapping(string => PitchRecord) public pitches;
    event PitchRegistered(string indexed pitchId, string startupId, string investorId, uint256 timestamp);

    function registerPitch(
        string memory _pitchId,
        string memory _startupId,
        string memory _investorId,
        string memory _contentHash
    ) public {
        require(bytes(pitches[_pitchId].pitchId).length == 0, "Pitch already registered");

        pitches[_pitchId] = PitchRecord({
            pitchId: _pitchId,
            startupId: _startupId,
            investorId: _investorId,
            contentHash: _contentHash,
            timestamp: block.timestamp,
            verified: true
        });

        emit PitchRegistered(_pitchId, _startupId, _investorId, block.timestamp);
    }

    function verifyPitch(string memory _pitchId) public view returns (bool, uint256, string memory) {
        PitchRecord memory record = pitches[_pitchId];
        return (record.verified, record.timestamp, record.contentHash);
    }
}
