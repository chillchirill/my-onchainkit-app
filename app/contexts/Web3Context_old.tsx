"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { Chain, parseEther, type Address } from 'viem';
import AuctionAddress from '@/app/artifacts/Auction-address.json';
import AuctionArtifact from '@/app/artifacts/Auction.json';
import GameInfo from '../types/GameInfo';

interface MiniKitUser {
    address?: string;
    displayName?: string;
    avatar?: string;
}

interface Web3ContextType {
    // MiniKit specific
    miniKitUser: MiniKitUser | null;
    isMiniKitReady: boolean;
    
    // Wallet connection
    address: Address | undefined;
    isConnected: boolean;
    chain: Chain | undefined;
    
    // Contract interaction
    contractAddress: Address;
    contractAbi: object;
    
    // App state
    ethPrice: number;
    isLoading: boolean;
    error: string | null;
    
    // Contract methods
    getMoney: (id: number) => Promise<void>;
    betAmount: (id: number, amount: number) => Promise<void>;
    createGame: (hours: number, minutes: number, seconds: number, percent: number, money: number, currency: string) => Promise<void>;
    getGames: () => Promise<GameInfo[]>;
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
    // Wagmi hooks
    const { address, isConnected, chain } = useAccount();
    //const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    
    // Contract write hook
    const { writeContractAsync } = useWriteContract();
    
    // App state
    const [ethPrice, setEthPrice] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error] = useState<string | null>(null);

    const contractAbi = AuctionArtifact.abi;
    const contractAddress = AuctionAddress.address as Address;
    
    // Simple MiniKit user simulation - you can enhance this later
    const miniKitUser: MiniKitUser | null = address ? {
        address: address,
        displayName: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
    } : null;
    
    const isMiniKitReady = isConnected;

    // Fetch ETH price on mount
    useEffect(() => {
        const fetchEthPrice = async () => {
            try {
                const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
                const data = await response.json();
                setEthPrice(parseFloat(data.price));
            } catch (error) {
                console.warn("Failed to fetch ETH price:", error);
            }
        };

        fetchEthPrice();
        setIsLoading(false);
    }, []);

    const getMoney = async (id: number) => {
        if (!isConnected || !address) {
            alert("Wallet not connected");
            return;
        }

        try {
            const hash = await writeContractAsync({
                abi: contractAbi,
                address: contractAddress,
                functionName: 'getMoney',
                args: [BigInt(id)],
            });
            
            console.log("Transaction hash:", hash);
            alert(`Successfully withdrawn funds from game ${id}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Cannot get money:", error);
            alert("Failed to withdraw funds: " + errorMessage);
        }
    };

    const betAmount = async (id: number, amount: number) => {
        if (!isConnected || !address) {
            alert("Wallet not connected");
            return;
        }

        try {
            const valueInWei = parseEther(amount.toString());

            const hash = await writeContractAsync({
                abi: contractAbi,
                address: contractAddress,
                functionName: 'step',
                args: [BigInt(id)],
                value: valueInWei,
            });

            console.log("Transaction hash:", hash);
            alert("Betted successfully!");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error betting:", error);
            alert("Failed to bet: " + errorMessage);
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
        if (!isConnected || !address) {
            alert("Wallet not connected");
            return;
        }

        try {
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // Convert currency to wei
            let valueInWei: bigint;
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
                    valueInWei = parseEther(money.toString());
                    break;
                case "$":
                    if (ethPrice > 0) {
                        const ethAmount = money / ethPrice;
                        valueInWei = parseEther(ethAmount.toString());
                    } else {
                        alert("ETH price not available");
                        return;
                    }
                    break;
                default:
                    alert("Invalid currency type");
                    return;
            }

            const hash = await writeContractAsync({
                abi: contractAbi,
                address: contractAddress,
                functionName: 'createGame',
                args: [BigInt(totalSeconds), BigInt(percent)],
                value: valueInWei,
            });

            console.log("Transaction hash:", hash);
            alert("Game created successfully!");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error creating game:", error);
            alert("Failed to create game: " + errorMessage);
        }
    };

    const getGames = async (start: number = 0, end: number = 15000): Promise<GameInfo[]> => {
        if (!publicClient) {
            console.error("Public client not available");
            return [];
        }

        try {
            const result = await publicClient.readContract({
                abi: contractAbi,
                address: contractAddress,
                functionName: 'getGames',
                args: [BigInt(start), BigInt(end)],
            }) as [Array<[string, bigint, bigint, bigint, bigint, bigint]>, bigint[]];

            const [games, ids] = result;
            const gamesArray: GameInfo[] = [];

            for (let i = 0; i < games.length; i++) {
                const [last, lastAmount, lastTime, bank, period, minimalIncrease] = games[i];
                const id = ids[i];

                const gameInfo: GameInfo = {
                    lastBetter: last,
                    lastAmountETH: Number(lastAmount),
                    lastBetTime: Number(lastTime),
                    bankAmountETH: Number(bank),
                    period: Number(period),
                    minIncrease: Number(minimalIncrease),
                    gameNumber: Number(id),
                };
                gamesArray.push(gameInfo);
            }

            return gamesArray;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error fetching games:", errorMessage);
            return [];
        }
    };

    const contextValue: Web3ContextType = {
        // MiniKit specific
        miniKitUser,
        isMiniKitReady,
        
        // Wallet connection
        address,
        isConnected,
        chain,
        
        // Contract interaction
        contractAddress,
        contractAbi,
        
        // App state
        ethPrice,
        isLoading,
        error,
        
        // Contract methods
        getMoney,
        betAmount,
        createGame,
        getGames,
    };

    return (
        <Web3Context.Provider value={contextValue}>
            {children}
        </Web3Context.Provider>
    );
};
