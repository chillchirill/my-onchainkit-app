'use client';

import { useSwitchChain, useChainId, useConfig } from 'wagmi';
import { base, baseSepolia, sepolia } from 'wagmi/chains';

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { chains, switchChain, isPending, error } = useSwitchChain();
  const config = useConfig();

  // Debug: Log available chains and config
  console.log('Available chains:', chains);
  console.log('Current chainId:', chainId);
  console.log('Config chains:', config.chains);
  console.log('Switch chain error:', error);

  // Explicitly define all networks we want to support
  const allNetworks = [
    { ...base, name: 'Base Mainnet', color: 'bg-blue-500' },
    { ...baseSepolia, name: 'Base Sepolia', color: 'bg-blue-400' },
    { ...sepolia, name: 'Ethereum Sepolia', color: 'bg-purple-500' },
  ];

  const getNetworkByChainId = (chainId: number) => {
    return allNetworks.find(network => network.id === chainId) || 
           { id: chainId, name: `Unknown Network (${chainId})`, color: 'bg-gray-500' };
  };

  const currentNetwork = getNetworkByChainId(chainId);

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      console.log('Attempting to switch to chain:', targetChainId);
      await switchChain({ chainId: targetChainId as 8453 | 84532 | 11155111 });
    } catch (err) {
      console.error('Chain switch failed:', err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${currentNetwork.color}`}></div>
        <span className="text-sm font-medium">
          Current: {currentNetwork.name}
        </span>
      </div>
      
      {/* Show all networks, not just configured ones */}
      <div className="flex flex-wrap gap-2">
        {allNetworks.map((network) => {
          const isConfigured = chains.some(c => c.id === network.id);
          const isCurrent = network.id === chainId;
          
          return (
            <button
              key={network.id}
              onClick={() => handleSwitchChain(network.id)}
              disabled={isPending || isCurrent}
              className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                isCurrent
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : isConfigured
                  ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
              }`}
              title={isConfigured ? 'Click to switch' : 'Not configured - will attempt to add'}
            >
              {isPending ? 'Switching...' : network.name}
              {!isConfigured && ' ⚠️'}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="text-xs text-red-500 bg-red-50 p-2 rounded mt-2">
          <div className="font-medium">Switch Error:</div>
          <div>{error.message}</div>
          {error.message.includes('Chain not configured') && (
            <div className="mt-1 text-red-600">
              💡 Try refreshing the page or make sure your wallet supports this network.
            </div>
          )}
        </div>
      )}

      {/* Debug info */}
      <div className="text-xs text-gray-400 mt-2">
        <details>
          <summary>Debug Info (remove in production)</summary>
          <div>Current Chain ID: {chainId}</div>
          <div>Configured Chains: {chains.map(c => `${c.name} (${c.id})`).join(', ')}</div>
          <div>Missing Chains: {allNetworks.filter(n => !chains.some(c => c.id === n.id)).map(n => n.name).join(', ') || 'None'}</div>
        </details>
      </div>
    </div>
  );
}
