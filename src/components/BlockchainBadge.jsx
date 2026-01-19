import React from 'react';
import { ShieldCheck } from 'lucide-react';

const BlockchainBadge = ({ hash }) => {
    if (!hash) return null;

    return (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-xs font-mono cursor-help" title={`Verified on Blockchain\nHash: ${hash}`}>
            <ShieldCheck className="w-3 h-3" />
            <span>Verified: {hash.substring(0, 8)}...</span>
        </div>
    );
};

export default BlockchainBadge;
