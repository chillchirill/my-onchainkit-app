"use client";
import React from "react";
import { useState } from "react";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { useWeb3 } from "@/app/contexts/Web3Context";

const NewGame = () => {
    const { createGame } = useWeb3();
    const [currency, setCurrency] = useState<string>("ETH");
    const { currencyOptions } = useCurrency();
    const [newGame, setNewGame] = useState({
        minIncrease: 5,
        period: 0,
        minimalBetETH: 0,
    });
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const maxHours = 120;

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(event.target.value);
    };

    const handleCreateGame = () => {
        if (hours < 0 || hours > maxHours || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            alert(`Invalid time input. Please ensure hours (0-${maxHours}), minutes (0-59), and seconds (0-59) are within valid ranges.`);
            return;
        }

        if (newGame.minimalBetETH <= 0) {
            alert("Please enter a valid minimal bet greater than 0.");
            return;
        }

        if (hours * 3600 + minutes * 60 + seconds <= 0) {
            alert("Please set a valid period greater than 0 seconds.");
            return;
        }

        // setGames((prevGames) => [newGameData, ...prevGames]);
        createGame(hours, minutes, seconds, newGame.minIncrease, newGame.minimalBetETH, currency);

        setNewGame({
            minIncrease: 5,
            period: 0,
            minimalBetETH: 0,
        });
        setHours(0);
        setMinutes(0);
        setSeconds(0);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            {/* Min increase section */}
            <div className="bg-pink-100 rounded-lg p-4 mb-6 flex items-center gap-3">
                <label className="text-gray-700 font-semibold text-lg">
                    Min increase:
                </label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={newGame.minIncrease}
                    onChange={(e) => setNewGame({ ...newGame, minIncrease: Number(e.target.value) })}
                />
                <span className="text-gray-700 font-semibold text-lg">%</span>
            </div>

            {/* Period section */}
            <div className="bg-purple-100 rounded-lg p-4 mb-6 flex items-center gap-3">
                <label className="text-gray-700 font-semibold text-lg">
                    Period (TTL):
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="HH"
                        min="0"
                        max={maxHours}
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={hours === 0 ? "" : hours}
                        onChange={(e) => setHours(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                    <span className="text-xl font-mono">:</span>
                    <input
                        type="number"
                        placeholder="MM"
                        min="0"
                        max="59"
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={minutes === 0 ? "" : minutes}
                        onChange={(e) => setMinutes(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                    <span className="text-xl font-mono">:</span>
                    <input
                        type="number"
                        placeholder="SS"
                        min="0"
                        max="59"
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={seconds === 0 ? "" : seconds}
                        onChange={(e) => setSeconds(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                </div>
                <div className="ml-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                </div>
            </div>

            {/* Amount input section */}
            <div className="flex gap-4 mb-6">
                <select
                    value={currency}
                    onChange={handleCurrencyChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newGame.minimalBetETH === 0 ? "" : newGame.minimalBetETH}
                    onChange={(e) => setNewGame({ ...newGame, minimalBetETH: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0 })}
                />
            </div>

            {/* Create game button */}
            <div className="bg-gray-100 rounded-lg p-6">
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                    onClick={handleCreateGame}
                >
                    Create game...
                </button>
            </div>
        </div>
    );
};

export default NewGame;