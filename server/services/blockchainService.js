const crypto = require('crypto');
const BlockchainRecord = require('../models/BlockchainRecord');



// In a real production environment, we would use ethers.js to interact with the deployed contract.
// const { ethers } = require('ethers');
// const contractABI = require('../contracts/PitchRegistry.json');
// const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

exports.createRecord = async (data, type) => {
    // 1. Create a cryptographic hash of the content (Simulating off-chain storage hash)
    const contentString = JSON.stringify(data);
    const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');

    // 2. Simulate Smart Contract Interaction
    // In a real app: await contract.registerPitch(pitchId, startupId, investorId, contentHash);
    console.log(`[Blockchain] Interact with Smart Contract: registerPitch(hash=${contentHash})`);

    // 3. Store the "Transaction Receipt" locally
    const lastRecord = await BlockchainRecord.findOne().sort({ timestamp: -1 });
    const previousHash = lastRecord ? lastRecord.hash : '00000000000000000000000000000000';

    const newRecord = new BlockchainRecord({
        hash: contentHash, // In real app, this might be the Transaction Hash
        previousHash,
        data,
        type,
        contractAddress: "0x1234567890123456789012345678901234567890", // Mock Contract Address
        status: "Verified"
    });

    await newRecord.save();
    return newRecord;
};
