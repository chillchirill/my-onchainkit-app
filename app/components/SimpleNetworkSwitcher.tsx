'use client';

import { useWeb3 } from '@/app/contexts/Web3Context';

export default function NetworkSwitcher() {
  const { switchNetwork, isConnected } = useWeb3();

  if (!isConnected) {
    return <div>Please connect your wallet first</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-4 border rounded">
      <h3 className="font-bold">Switch Network</h3>
      <div className="flex gap-2">
        <button
          onClick={() => switchNetwork('base-sepolia')}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Base Sepolia
        </button>
        <button
          onClick={() => switchNetwork('eth-sepolia')}
          className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Ethereum Sepolia
        </button>
        <button
          onClick={() => switchNetwork('base-mainnet')}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
        >
          Base Mainnet
        </button>
      </div>
    </div>
  );
}
