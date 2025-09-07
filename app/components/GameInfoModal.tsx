"use client";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { useWeb3 } from "@/app/contexts/Web3Context";
import { ethers } from "ethers";
import GameInfo from "@/app/types/GameInfo";

interface GameInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameId: number;
}

const GameInfoModal: React.FC<GameInfoModalProps> = ({ isOpen, onClose, gameId }) => {
    const [betAmountVal, setBetAmount] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState("ETH");
    const { currencyOptions } = useCurrency();
    const { contract, betAmount } = useWeb3();
    const [game, setGame] = useState<GameInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !contract) return;
        
        const fetchGameData = async () => {
            setIsLoading(true);
            try {
                console.log("Fetching game data for ID:", gameId);

                const [last, lastAmount, lastTime, bank, time, minimalIncrease] =
                    await contract.getGame(gameId);

                console.log("Game data:", {
                    last,
                    lastAmount,
                    lastTime,
                    bank,
                    time,
                    minimalIncrease,
                });

                const gameInfo = {
                    lastBetter: last,
                    lastAmountETH: parseFloat(ethers.formatEther(lastAmount)),
                    lastBetTime: Number(lastTime),
                    bankAmountETH: parseFloat(ethers.formatEther(bank)),
                    period: Number(time),
                    minIncrease: Number(minimalIncrease),
                    gameNumber: gameId,
                };

                setGame(gameInfo);
            } catch (error) {
                console.error("Error fetching game data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameData();
    }, [isOpen, contract, gameId]);

    const handlePay = () => {
        if (!betAmountVal || parseFloat(betAmountVal) <= 0) {
            alert("Please enter a valid bet amount");
            return;
        }
        betAmount(gameId, parseFloat(betAmountVal)).catch((reason) => {
            alert(reason);
        });
        onClose(); // Close modal after betting
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Game #{gameId} Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-500 text-lg">Loading game details...</div>
                        </div>
                    ) : game ? (
                        <>
                            {/* Game Info Display */}
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-green-100 rounded-lg p-4">
                                        <span className="text-gray-700 font-semibold">Bank: </span>
                                        <span className="text-gray-800 font-mono">{game.bankAmountETH} ETH</span>
                                    </div>
                                    <div className="bg-purple-100 rounded-lg p-4">
                                        <span className="text-gray-700 font-semibold">Last Amount: </span>
                                        <span className="text-gray-800 font-mono">{game.lastAmountETH} ETH</span>
                                    </div>
                                    <div className="bg-pink-100 rounded-lg p-4">
                                        <span className="text-gray-700 font-semibold">Min Increase: </span>
                                        <span className="text-gray-800 font-mono">{game.minIncrease}%</span>
                                    </div>
                                    <div className="bg-cyan-100 rounded-lg p-4">
                                        <span className="text-gray-700 font-semibold">Minimal Bet: </span>
                                        <span className="text-gray-800 font-mono">
                                            {(game.lastAmountETH * (1 + game.minIncrease / 100)).toFixed(6)} ETH
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Betting Form */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Place Your Bet</h3>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                                    <select
                                        value={selectedCurrency}
                                        onChange={(e) => setSelectedCurrency(e.target.value)}
                                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium"
                                    >
                                        {currencyOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        step="0.000001"
                                        min="0"
                                        placeholder="Enter amount..."
                                        value={betAmountVal}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />

                                    <button
                                        onClick={handlePay}
                                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        Place Bet
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-red-500 text-lg">Failed to load game data</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameInfoModal;
