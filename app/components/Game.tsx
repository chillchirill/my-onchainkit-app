"use client";
import React, { useState, useEffect } from "react";
import GameInfo from "@/app/types/GameInfo";
import { useCurrency, convertCurrency } from "@/app/contexts/CurrencyContext";
import { bigIntToFormat } from "@/app/helpers/bigIntToString";
import Link from "next/dist/client/link";
import { useWeb3 } from "@/app/contexts/Web3Context";
import DonationModal from "./DonationModal";

const Game = ({ game, showMoreInfoButton = true }: { game: GameInfo, showMoreInfoButton: boolean }): React.JSX.Element => {
    const { ethPrice, getMoney2, getMoney3, betAmount } = useWeb3();

    // State to track if component has mounted (hydration complete)
    const [isMounted, setIsMounted] = useState(false);

    // State for countdown timer - initialize with a safe default
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // State for donation modal
    const [showDonationModal, setShowDonationModal] = useState(false);

    const { currency } = useCurrency();

    // Handle donation modal confirmation
    const handleDonationConfirm = async (donationOption: 'partial' | 'full', charityAddress: string) => {
        try {
            if (donationOption === 'partial') {
                await getMoney2(game.gameNumber, charityAddress);
            } else {
                await getMoney3(game.gameNumber, charityAddress);
            }
        } catch (error) {
            console.error("Error processing donation:", error);
        }
    };

    // Helper function to format seconds to HH:MM:SS
    const secondsToClock = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Effect to handle mounting and initial time calculation
    useEffect(() => {
        setIsMounted(true);
        const periodSeconds = Number(game?.period);
        const elapsedSeconds = Math.floor(Date.now() / 1000) - Number(game?.lastBetTime);
        const remaining = Math.max(0, periodSeconds - elapsedSeconds);
        setTimeLeft(remaining);
    }, [game]);

    // Countdown effect - only run after mounting
    useEffect(() => {
        if (!isMounted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // Cleanup function
        return () => clearInterval(timer);
    }, [isMounted, timeLeft]);

    // Determine time display color based on remaining time
    const getTimeColor = () => {
        if (!isMounted) return "bg-gray-100"; // Safe default during SSR
        if (timeLeft <= 0) return "text-red-600 bg-red-100";
        if (timeLeft <= 300) return "text-orange-600 bg-orange-200"; // Last 5 minutes
        if (timeLeft <= 600) return "text-yellow-600 bg-yellow-100"; // Last 10 minutes
        return "text-gray-800 bg-orange-100";
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200 my-6">
            {/* Top row - Bank, Time, Number */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-100 rounded-lg p-4">
                    <span className="text-gray-700 font-semibold">Bank: </span>
                    {/* <span className="text-gray-800 font-mono">{formatCurrency(convertCurrency(game.bankAmountETH, "ETH", currency), currency)}</span> */}
                    {/* <span className="text-gray-800 font-mono">{bigIntToFormat(convertCurrency(game.bankAmountETH, "ETH", currency), currency)}</span> */}
                    <span className="text-gray-800 font-mono">{bigIntToFormat(convertCurrency(game?.bankAmountETH, "ETH", currency, ethPrice), currency)}</span>
                </div>
                <div className={`rounded-lg p-4 text-center ${getTimeColor()}`}>
                    <span className="text-gray-700 font-semibold">Time left: </span>
                    <span className={`font-mono font-bold ${!isMounted ? 'text-gray-500' : timeLeft <= 0 ? 'text-red-600' : timeLeft <= 300 ? 'text-orange-600' : 'text-gray-800'}`}>
                        {!isMounted ? "Loading..." : timeLeft <= 0 ? "EXPIRED" : secondsToClock(timeLeft)}
                    </span>
                </div>
                <div className="bg-gray-200 rounded-lg p-4 text-right">
                    <span className="text-gray-700 font-semibold text-xl">№ {game?.gameNumber}</span>
                </div>
            </div>

            {/* Middle row - Last Amount, Min increase */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-purple-100 rounded-lg p-4">
                    <span className="text-gray-700 font-semibold">Last Amount: </span>
                    {/* <span className="text-gray-800 font-mono">{formatCurrency(convertCurrency(game.lastAmountETH, "ETH", currency), currency)}</span> */}
                    <span className="text-gray-800 font-mono">{bigIntToFormat(convertCurrency(game.lastAmountETH, "ETH", currency, ethPrice), currency)}</span>
                </div>
                <div className="bg-pink-100 rounded-lg p-4">
                    <span className="text-gray-700 font-semibold">Min increase: </span>
                    <span className="text-gray-800 font-mono">{game?.minIncrease}%</span>
                </div>
            </div>

            {/* Bottom info row - Minimal bet, Period */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-cyan-100 rounded-lg p-4">
                    <span className="text-gray-700 font-semibold">Minimal bet: </span>
                    {/* <span className="text-gray-800 font-mono">{formatCurrency(convertCurrency(game.minimalBetETH, "ETH", currency), currency)}</span> */}
                    <span className="text-gray-800 font-mono">{bigIntToFormat(convertCurrency(game?.lastAmountETH * (1 + game?.minIncrease / 100), "ETH", currency, ethPrice), currency)}</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                    <span className="text-gray-700 font-semibold">Period: </span>
                    <span className="text-gray-800 font-mono">{secondsToClock(game?.period)}</span>
                </div>
            </div>

            {/* Action buttons */}
            <div className={showMoreInfoButton ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
                {showMoreInfoButton && (
                    <Link href={`/game/${game?.gameNumber}`} className="">
                        <p className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg text-center">More Info...</p>
                    </Link>
                )}
                {
                    timeLeft <= 0 ?
                        (<button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                            onClick={() => setShowDonationModal(true)}>
                            Get money...
                        </button>) :
                        (<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                            onClick={() => {
                                betAmount(game.gameNumber, game.lastAmountETH * (1 + game.minIncrease / 100)).catch((reason) => {
                                    alert(reason);
                                });
                            }}>
                            Bet minimum...
                        </button>)
                }

            </div>

            {/* Donation Modal */}
            <DonationModal
                isOpen={showDonationModal}
                onClose={() => setShowDonationModal(false)}
                onConfirm={handleDonationConfirm}
                gameNumber={game?.gameNumber || 0}
            />
        </div>
    );
};

export default Game;