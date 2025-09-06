'use client';

import { http, createConfig } from 'wagmi';
import { base, baseSepolia, sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';

// Explicitly define the chains we want to support
const supportedChains = [base, baseSepolia, sepolia] as const;

export const config = createConfig({
  chains: supportedChains,
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit MiniApp',
      preference: 'all', // Support both EOA and Smart Wallets
      version: '4',
    }),
    // Add injected connector as fallback
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [sepolia.id]: http('https://rpc.sepolia.org'), // Use explicit RPC for Sepolia
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
