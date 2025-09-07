"use client";
import React, { useState } from "react";

interface Charity {
    name: string;
    address: string;
    description: string;
}

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (donationOption: 'partial' | 'full', charityAddress: string) => void;
    gameNumber: number;
}

const charities: Charity[] = [
    {
        name: "Example Charity 1",
        address: "0x69544E4333A3df13681BAee491170B9120Ead60F",
        description: "International humanitarian aid"
    },
    {
        name: "Example Charity 2",
        address: "0x3B70D7D293baA136942b3b63d504eAd613FAb220",
        description: "Children's emergency relief"
    },
    {
        name: "Example Charity 3",
        address: "0x55bC40621605F656F68864bdbf0489E1cE06B640",
        description: "Medical humanitarian aid"
    }
];

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onConfirm, gameNumber }) => {
    const [selectedCharity, setSelectedCharity] = useState<string>(charities[0].address);
    const [donationType, setDonationType] = useState<'partial' | 'full'>('partial');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(donationType, selectedCharity);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        🎉 Congratulations!
                    </h2>
                    <p className="text-gray-600">
                        You can claim the winnings from Game #{gameNumber}
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Would you like to make a donation?
                    </h3>

                    {/* Donation type selection */}
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="donationType"
                                value="partial"
                                checked={donationType === 'partial'}
                                onChange={(e) => setDonationType(e.target.value as 'partial')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-gray-700">Donate 10% to charity</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="donationType"
                                value="full"
                                checked={donationType === 'full'}
                                onChange={(e) => setDonationType(e.target.value as 'full')}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-gray-700">Donate everything to charity</span>
                        </label>
                    </div>

                    {/* Charity selection */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select charity:
                        </label>
                        <select
                            value={selectedCharity}
                            onChange={(e) => setSelectedCharity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {charities.map((charity) => (
                                <option key={charity.address} value={charity.address}>
                                    {charity.name} - {charity.description}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {donationType === 'partial' ? 'Donate 10% & Keep 90%' : 'Donate Everything'}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationModal;
