# Connecting Coinbase Wallet to Sepolia Testnet

## Current Configuration

Your app is already configured to support multiple networks:
- ✅ **Base Mainnet** (chainId: 8453)
- ✅ **Base Sepolia** (chainId: 84532) 
- ✅ **Ethereum Sepolia** (chainId: 11155111)

## How to Connect to Sepolia Testnet

### Option 1: Use the Network Switcher Component

I've created a `NetworkSwitcher` component you can add to your UI:

```tsx
import NetworkSwitcher from '@/app/components/NetworkSwitcher';

function MyComponent() {
  return (
    <div>
      <NetworkSwitcher />
      {/* Your other components */}
    </div>
  );
}
```

### Option 2: Programmatic Network Switching

```tsx
import { useSwitchChain } from 'wagmi';
import { sepolia, baseSepolia } from 'wagmi/chains';

function SwitchToSepolia() {
  const { switchChain } = useSwitchChain();

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Switch to Ethereum Sepolia
      </button>
      <button 
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch to Base Sepolia
      </button>
    </div>
  );
}
```

### Option 3: Check Current Network

```tsx
import { useChainId, useAccount } from 'wagmi';
import { sepolia, baseSepolia, base } from 'wagmi/chains';

function NetworkStatus() {
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const getNetworkName = () => {
    switch (chainId) {
      case sepolia.id: return 'Ethereum Sepolia';
      case baseSepolia.id: return 'Base Sepolia';
      case base.id: return 'Base Mainnet';
      default: return 'Unknown Network';
    }
  };

  const isTestnet = chainId === sepolia.id || chainId === baseSepolia.id;

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        isTestnet ? 'bg-yellow-500' : 'bg-green-500'
      }`}></div>
      <span>{getNetworkName()}</span>
      {isTestnet && <span className="text-xs text-yellow-600">(Testnet)</span>}
    </div>
  );
}
```

## Getting Testnet Funds

### For Ethereum Sepolia:
1. **Sepolia Faucet**: https://sepoliafaucet.com/
2. **Alchemy Faucet**: https://sepoliafaucet.com/
3. **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

### For Base Sepolia:
1. **Coinbase Faucet**: https://coinbase.com/faucets/base-ethereum-sepolia-faucet
2. **Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## Contract Deployment for Testnets

If you want to test on Sepolia, you'll need to:

1. **Deploy your contract to Sepolia**
2. **Update your artifacts**:
   ```json
   // /app/artifacts/Auction-address.json
   {
     "address": "0xYourSepoliaContractAddress"
   }
   ```

## Environment Variables

Make sure you have the required API keys:

```env
# .env.local
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_CDP_CLIENT_API_KEY=your_cdp_api_key
```

## Integration Example

Add the NetworkSwitcher to your header or main component:

```tsx
// In your header or main component
import NetworkSwitcher from '@/app/components/NetworkSwitcher';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My DApp</h1>
      <div className="flex items-center gap-4">
        <NetworkSwitcher />
        <WalletConnect />
      </div>
    </header>
  );
}
```

## Benefits of Multi-Network Support

- ✅ **Development**: Test on Sepolia before mainnet deployment
- ✅ **Cost**: Testnet transactions are free
- ✅ **Safety**: Test complex interactions without real funds
- ✅ **User Choice**: Let users pick their preferred network

## Network-Specific Contract Addresses

You can also handle different contract addresses per network:

```tsx
import { useChainId } from 'wagmi';
import { sepolia, baseSepolia, base } from 'wagmi/chains';

function useContractAddress() {
  const chainId = useChainId();
  
  const addresses = {
    [base.id]: '0xYourMainnetAddress',
    [baseSepolia.id]: '0xYourBaseSepoliaAddress', 
    [sepolia.id]: '0xYourEthereumSepoliaAddress',
  };
  
  return addresses[chainId] || addresses[base.id]; // fallback to mainnet
}
```

Your app now supports seamless switching between Base mainnet, Base Sepolia, and Ethereum Sepolia testnets!
