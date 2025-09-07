"use client";
import React from "react";
import { useState } from "react";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { useWeb3 } from "@/app/contexts/Web3Context";

const NewGame = () => {
    const { createGame } = useWeb3();
    const [currency, setCurrency] = useState<string>("ETH");
    const { currencyOptions } = useCurrency();
    const [minIncrease, setMinIncrease] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [minimalBetETH, setMinimalBetETH] = useState("");

    const checkInputForGameCreation = () => {
        const _hours = parseInt(hours);
        const _minutes = parseInt(minutes);
        const _seconds = parseInt(seconds);
        const _minimalBetETH = parseFloat(minimalBetETH);
        const _minIncrease = parseFloat(minIncrease);

        if (isNaN(_hours) || isNaN(_minutes) || isNaN(_seconds) || isNaN(_minimalBetETH) || isNaN(_minIncrease)) {
            alert("Please enter valid numeric values for hours, minutes, seconds, minimal bet, and min increase.");
            return false;
        }

        if (_hours < 0 || _hours > maxHours || _minutes < 0 || _minutes > 59 || _seconds < 0 || _seconds > 59) {
            alert(`Invalid time input. Please ensure hours (0-${maxHours}), minutes (0-59), and seconds (0-59) are within valid ranges.`);
            return false;
        }

        if (_minimalBetETH <= 0) {
            alert("Please enter a valid minimal bet greater than 0.");
            return false;
        }

        return true;
    };

    const maxHours = 120;

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(event.target.value);
    };

    const handleCreateGame = () => {
        if (!checkInputForGameCreation()) {
            alert("Invalid input. Please correct the errors and try again.");
            return;
        }

        const _hours = parseInt(hours);
        const _minutes = parseInt(minutes);
        const _seconds = parseInt(seconds);
        const _minIncrease = parseInt(minIncrease);
        const _minimalBetETH = parseFloat(minimalBetETH);

        // setGames((prevGames) => [newGameData, ...prevGames]);
        createGame(_hours, _minutes, _seconds, _minIncrease, _minimalBetETH, currency);

        setMinIncrease("");
        setHours("");
        setMinutes("");
        setSeconds("");
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
                    lang="en-US"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={minIncrease}
                    onChange={(e) => setMinIncrease(e.target.value)}
                />
                <span className="text-gray-700 font-semibold text-lg">%</span>
            </div>

            {/* Period section */}
            <div className="bg-purple-100 rounded-lg p-4 mb-6">
                <label className="text-gray-700 font-semibold text-lg mb-3 block">
                    Period (TTL):
                </label>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            placeholder="HH"
                            min="0"
                            max={maxHours}
                            className="w-12 sm:w-16 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                        />
                        <span className="text-sm sm:text-lg font-mono text-gray-600">h</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            placeholder="MM"
                            min="0"
                            max="59"
                            className="w-12 sm:w-16 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                        />
                        <span className="text-sm sm:text-lg font-mono text-gray-600">m</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            placeholder="SS"
                            min="0"
                            max="59"
                            className="w-12 sm:w-16 px-1 sm:px-2 py-2 border border-gray-300 rounded-lg text-gray-700 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value)}
                        />
                        <span className="text-sm sm:text-lg font-mono text-gray-600">s</span>
                    </div>

                    <div className="ml-2">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                    </div>
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
                    lang="en-US"
                    placeholder="Enter amount..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={minimalBetETH}
                    onChange={(e) => setMinimalBetETH(e.target.value)}
                />
            </div>

            {/* Create game button */}
            <div className="rounded-lg p-6">
                <button className="w-full bg-gray-100 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                    onClick={handleCreateGame}
                >
                    Create game...
                </button>
            </div>
        </div>
    );
};

export default NewGame;