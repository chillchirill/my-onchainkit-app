"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import AuctionAddress from '@/app/artifacts/Auction-address.json';
import AuctionArtifact from '@/app/artifacts/Auction.json';
import GameInfo from '../types/GameInfo';

interface Web3ContextType {
    contract: ethers.Contract;
    provider: ethers.BrowserProvider;
    signer: ethers.JsonRpcSigner;
    ethereum: ethers.Eip1193Provider;
    ethPrice: number;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    availableWallets: WalletInfo[];
    connectWallet: (walletType?: string) => Promise<void>;
    checkBalance: () => Promise<string>;
    estimateGas: (txData: any) => Promise<bigint>;
    getMoney: (id: number) => Promise<void>;
    betAmount: (id: number, amount: number) => Promise<void>;
    createGame: (hours: number, minutes: number, seconds: number, percent: number, money: number, currency: string) => Promise<void>;
    getGames: () => Promise<GameInfo[]>;
    switchNetwork: (networkName: 'base-sepolia' | 'eth-sepolia' | 'base-mainnet') => Promise<void>;
    getMoney2: (id: number, to: string) => Promise<void>;
    getMoney3: (id: number, to: string) => Promise<void>;
}

interface WalletInfo {
    name: string;
    type: string;
    provider: ethers.Eip1193Provider;
    installed: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
};

interface Web3ProviderProps {
    children: ReactNode;
}

export const Web3Provider = ({ children }: Web3ProviderProps) => {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [ethereum, setEthereum] = useState<null | ethers.Eip1193Provider>(null);
    const [ethPrice, setEthPrice] = useState<number>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);

    const ABI = AuctionArtifact.abi;
    const contractAddress = AuctionAddress.address;

    // Detect available wallets
    const detectWallets = (): WalletInfo[] => {
        const wallets: WalletInfo[] = [];
        
        if (typeof window !== 'undefined' && window.ethereum) {
            if (window.ethereum.providers) {
                // Multiple wallets installed
                window.ethereum.providers.forEach((provider: object) => {
                    if ((provider as { isMetaMask: boolean }).isMetaMask) {
                        wallets.push({
                            name: 'MetaMask',
                            type: 'metamask',
                            provider: provider as ethers.Eip1193Provider,
                            installed: true
                        });
                    }
                    if ((provider as { isCoinbaseWallet: boolean }).isCoinbaseWallet) {
                        wallets.push({
                            name: 'Coinbase Wallet',
                            type: 'coinbase',
                            provider: provider as ethers.Eip1193Provider,
                            installed: true
                        });
                    }
                });
            } else {
                // Single wallet installed
                if (window.ethereum.isMetaMask) {
                    wallets.push({
                        name: 'MetaMask',
                        type: 'metamask',
                        provider: window.ethereum,
                        installed: true
                    });
                } else if (window.ethereum.isCoinbaseWallet) {
                    wallets.push({
                        name: 'Coinbase Wallet',
                        type: 'coinbase',
                        provider: window.ethereum,
                        installed: true
                    });
                }
            }
        }

        return wallets;
    };

    // Connect to a specific wallet
    const connectWallet = async (walletType?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const wallets = detectWallets();
            setAvailableWallets(wallets);

            if (wallets.length === 0) {
                throw new Error("No compatible wallets found. Please install MetaMask or Coinbase Wallet.");
            }

            let selectedProvider = null;

            if (walletType) {
                // Connect to specific wallet type
                const wallet = wallets.find(w => w.type === walletType);
                if (!wallet) {
                    throw new Error(`${walletType} wallet not found`);
                }
                selectedProvider = wallet.provider;
            } else {
                // Use first available wallet or let user choose
                selectedProvider = wallets[0].provider;
            }

            console.log("Using wallet provider:", selectedProvider);
            const ethereumProvider = new ethers.BrowserProvider(selectedProvider);
            
            switchNetwork('eth-sepolia');
            
            // Request account access
            await ethereumProvider.send('eth_requestAccounts', []);


            const web3Signer = await ethereumProvider.getSigner();

            setProvider(ethereumProvider);
            setSigner(web3Signer);
            setEthereum(selectedProvider);

            // Create contract instance
            const contractInstance = new ethers.Contract(contractAddress, ABI, web3Signer);
            setContract(contractInstance);

            setIsConnected(true);
            console.log("Wallet connected successfully!");
        } catch (err: unknown) {
            console.error("Wallet connection error:", err);
            setError((err as Error).message || "Failed to connect wallet");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!ABI || !contractAddress) {
            console.log("ABI or contract address not available yet");
            return;
        }

        // Detect wallets and get ETH price on load
        const initializeApp = async () => {
            const wallets = detectWallets();
            setAvailableWallets(wallets);

            // Get ETH price
            try {
                const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
                const data = await response.json();
                setEthPrice(parseFloat(data.price));
            } catch (priceError) {
                console.warn("Failed to fetch ETH price:", priceError);
            }

            setIsLoading(false);
        };

        initializeApp();
    }, [ABI, contractAddress]);

    // Check user's ETH balance
    const checkBalance = async (): Promise<string> => {
        if (!signer) {
            throw new Error("Signer not available");
        }
        
        try {
            const balance = await signer.provider.getBalance(signer.address);
            const balanceInEth = ethers.formatEther(balance);
            console.log(`Current balance: ${balanceInEth} ETH`);
            return balanceInEth;
        } catch (error) {
            console.error("Error checking balance:", error);
            throw error;
        }
    };

    // Estimate gas for a transaction
    const estimateGas = async (txData: { to?: string; value?: bigint; data?: string }): Promise<bigint> => {
        if (!signer) {
            throw new Error("Signer not available");
        }

        try {
            const gasEstimate = await signer.estimateGas(txData);
            console.log(`Estimated gas: ${gasEstimate.toString()}`);
            return gasEstimate;
        } catch (error) {
            console.error("Error estimating gas:", error);
            throw error;
        }
    };

    const getMoney = async (id: number) => {
        if (!contract) {
            alert("Contract not initialized");
            return;
        }

        try {
            await contract.getMoney(id);
            alert(`Successfully withdrawn funds from game ${id}`);
        } catch (error: unknown) {
            if ((error as { reason?: string }).reason) {
                alert((error as { reason: string }).reason);
            } else {
                console.error("Cannot get money:", error);
                alert("Failed to withdraw funds");
            }
        }
    };

    const getMoney2 = async (id: number, to: string) => {
        if (!contract) {
            alert("Contract not initialized");
            return;
        }

        try {
            await contract.getMoney2(id, to);
            alert(`Successfully withdrawn funds from game ${id}, and donated 10% to ${to}`);
        } catch (error: unknown) {
            if ((error as { reason?: string }).reason) {
                alert((error as { reason: string }).reason);
            } else {
                console.error("Cannot get money:", error);
                alert("Failed to withdraw funds");
            }
        }
    };

    const getMoney3 = async (id: number, to: string) => {
        if (!contract) {
            alert("Contract not initialized");
            return;
        }

        try {
            await contract.getMoney3(id, to);
            alert(`Successfully donated everything to ${to}`);
        } catch (error: unknown) {
            if ((error as { reason?: string }).reason) {
                alert((error as { reason: string }).reason);
            } else {
                console.error("Cannot get money:", error);
                alert("Failed to withdraw funds");
            }
        }
    };

    const betAmount = async (id: number, amount: number) => {
        if (!contract || !signer) {
            alert("Contract or signer not initialized");
            return;
        }

        try {
            // Convert currency to wei
            const valueInWei = ethers.parseEther(amount.toString());
            
            // Check balance before transaction
            const balance = await signer.provider.getBalance(signer.address);
            console.log(`Current balance: ${ethers.formatEther(balance)} ETH`);
            console.log(`Transaction value: ${ethers.formatEther(valueInWei)} ETH`);
            
            // Estimate gas first
            try {
                const gasEstimate = await contract.step.estimateGas(id, { value: valueInWei });
                const gasPrice = await signer.provider.getFeeData();
                const totalGasCost = gasEstimate * (gasPrice.gasPrice || BigInt(0));
                const totalRequired = valueInWei + totalGasCost;
                
                console.log(`Estimated gas: ${gasEstimate.toString()}`);
                console.log(`Gas price: ${gasPrice.gasPrice?.toString()} wei`);
                console.log(`Total gas cost: ${ethers.formatEther(totalGasCost)} ETH`);
                console.log(`Total required: ${ethers.formatEther(totalRequired)} ETH`);
                
                if (balance < totalRequired) {
                    const shortfall = totalRequired - balance;
                    alert(`Insufficient funds. You need ${ethers.formatEther(shortfall)} more ETH for this transaction.\n` +
                          `Balance: ${ethers.formatEther(balance)} ETH\n` +
                          `Required: ${ethers.formatEther(totalRequired)} ETH`);
                    return;
                }
            } catch (gasError) {
                console.error("Gas estimation failed:", gasError);
                alert("Failed to estimate gas. The transaction might fail.");
            }

            const tx = await contract.step(
                id,
                {
                    value: valueInWei,
                    gasLimit: BigInt(1200000),
                }
            );

            console.log("Transaction hash:", tx.hash);
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            alert("Betted successfully!");
        } catch (error: unknown) {
            console.error("Error betting:", error);
            const errorMessage = (error as { reason?: string }).reason || (error as Error).message;
            
            // Provide more specific error messages
            if (errorMessage.includes("insufficient funds")) {
                const balance = await checkBalance();
                alert(`Transaction failed: Insufficient funds\nYour balance: ${balance} ETH\nTry reducing the bet amount or add more ETH to your wallet.`);
            } else if (errorMessage.includes("gas")) {
                alert(`Transaction failed: Gas related error\n${errorMessage}\nTry increasing gas limit or wait for network congestion to reduce.`);
            } else {
                alert("Failed to bet: " + errorMessage);
            }
        }
    };

    const createGame = async (
        hours: number,
        minutes: number,
        seconds: number,
        percent: number,
        money: number,
        currency: string
    ) => {
        if (!contract) {
            alert("Contract not initialized");
            return;
        }

        try {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // Convert currency to wei
            let valueInWei;
            switch (currency) {
                case "wei":
                    valueInWei = BigInt(Math.floor(money));
                    break;
                case "gwei":
                    valueInWei = BigInt(Math.floor(money * 10 ** 9));
                    break;
                case "ETH":
                case "eth":
                case "ether":
                    // Ensure we have a reasonable minimum
                    if (money < 0.000001) {
                        alert("Minimum amount is 0.000001 ETH");
                        return;
                    }
                    valueInWei = ethers.parseEther(money.toString());
                    break;
                case "$":
                    if (ethPrice > 0) {
                        const ethAmount = money / ethPrice;

                        // Check if the ETH amount is too small
                        if (ethAmount < 0.000001) {
                            alert(`Minimum amount is $${(0.000001 * ethPrice).toFixed(6)} (0.000001 ETH)`);
                            return;
                        }

                        // Round to 18 decimal places to avoid precision issues
                        const ethAmountRounded = Math.round(ethAmount * 1e18) / 1e18;
                        valueInWei = ethers.parseEther(ethAmountRounded.toString());
                    } else {
                        alert("ETH price not available");
                        return;
                    }
                    break;
                default:
                    alert("Invalid currency type");
                    return;
            }

            const tx = await contract.createGame(
                totalSeconds,
                percent,
                {
                    value: valueInWei,
                    gasLimit: BigInt(1200000),
                }
            );

            console.log("Transaction hash:", tx.hash);
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            alert("Game created successfully!");
        } catch (error: unknown) {
            console.error("Error creating game:", error);
            alert("Failed to create game: " + ((error as { reason?: string }).reason || (error as Error).message));
        }
    };

    const switchNetwork = async (networkName: 'base-sepolia' | 'eth-sepolia' | 'base-mainnet') => {
        if (!ethereum) {
            alert("Wallet not connected");
            return;
        }

        const networks = {
            'base-sepolia': {
                chainId: '0x14A34', // 84532 in hex
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia-explorer.base.org/']
            },
            'eth-sepolia': {
                chainId: '0xAA36A7', // 11155111 in hex
                chainName: 'Ethereum Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://chain-proxy.wallet.coinbase.com?targetName=ethereum-sepolia'],
                //blockExplorerUrls: ['https://sepolia.etherscan.io/']
            },
            'base-mainnet': {
                chainId: '0x2105', // 8453 in hex
                chainName: 'Base Mainnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org/']
            }
        };

        const targetNetwork = networks[networkName];

        try {
            // Try to switch to the network
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetNetwork.chainId }],
            });

            console.log(`Successfully switched to ${targetNetwork.chainName}`);
        } catch (switchError: unknown) {
            // If network doesn't exist, add it
            if ((switchError as { code?: number }).code === 4902) {
                try {
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [targetNetwork],
                    });
                    console.log(`Successfully added and switched to ${targetNetwork.chainName}`);
                } catch (addError: unknown) {
                    console.error(`Failed to add ${targetNetwork.chainName}:`, addError);
                    alert(`Failed to add ${targetNetwork.chainName}: ${(addError as { message: string }).message}`);
                }
            } else {
                console.error(`Failed to switch to ${targetNetwork.chainName}:`, switchError);
                alert(`Failed to switch to ${targetNetwork.chainName}: ${(switchError as { message: string }).message}`);
            }
        }
    };

    const getGames = async (start: number = 0, end: number = 15000): Promise<GameInfo[]> => {
        if (!contract) {
            console.error("Contract not initialized");
            return [];
        }

        try {
            const [games, ids] = await contract.getGames(start, end);
            const gamesArray = [];

            for (let i = 0; i < games.length; i++) {
                const [last, lastAmount, lastTime, bank, period, minimalIncrease] = games[i];
                const id = ids[i];

                const gameInfo = {
                    lastBetter: last,
                    lastAmountETH: parseFloat(ethers.formatEther(lastAmount)),
                    lastBetTime: Number(lastTime),
                    bankAmountETH: parseFloat(ethers.formatEther(bank)),
                    period: Number(period),
                    minIncrease: Number(minimalIncrease),
                    gameNumber: Number(id),
                };
                gamesArray.push(gameInfo);
            }

            return gamesArray;
        } catch (error: unknown) {
            console.error("Error fetching games:", error);
            return [];
        }
    };

    const contextValue: Web3ContextType = {
        contract: contract as ethers.Contract,
        provider: provider as ethers.BrowserProvider,
        signer: signer as ethers.JsonRpcSigner,
        ethereum: ethereum as ethers.Eip1193Provider,
        ethPrice,
        isConnected,
        isLoading,
        error,
        availableWallets,
        connectWallet,
        checkBalance,
        estimateGas,
        getMoney,
        betAmount,
        createGame,
        getGames,
        switchNetwork,
        getMoney2,
        getMoney3,
    };

    return (
        <Web3Context.Provider value={contextValue}>
            {children}
        </Web3Context.Provider>
    );
};
