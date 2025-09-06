'use client';

import { base, sepolia, baseSepolia } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useChainId } from 'wagmi';
import type { ReactNode } from 'react';
import { config } from '@/lib/wagmi';
import { MiniKitContextProvider } from '@/providers/MiniKitProvider';

const queryClient = new QueryClient();

// Inner component that can access the chain from Wagmi
function OnchainKitWrapper({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  
  // Map chain ID to chain object, fallback to base
  const getCurrentChain = () => {
    switch (chainId) {
      case sepolia.id:
        return sepolia;
      case baseSepolia.id:
        return baseSepolia;
      case base.id:
      default:
        return base;
    }
  };

  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={getCurrentChain()}
      config={{ 
        appearance: { 
          mode: 'auto',
        }
      }}
    >
      <MiniKitContextProvider>
        {children}
      </MiniKitContextProvider>
    </OnchainKitProvider>
  );
}

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitWrapper>
          {props.children}
        </OnchainKitWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}