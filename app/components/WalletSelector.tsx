"use client";
import React from 'react';
import { useWeb3 } from '@/app/contexts/Web3Context';

const WalletSelector = () => {
    const { availableWallets, connectWallet, isConnected, isLoading, error } = useWeb3();

    if (isConnected) {
        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Wallet Connected
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                Loading wallets...
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Connect Your Wallet</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {availableWallets.length > 0 ? (
                    availableWallets.map((wallet) => (
                        <button
                            key={wallet.type}
                            onClick={() => connectWallet(wallet.type)}
                            className="w-full flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                {wallet.name === 'MetaMask' ? '🦊' : '🔷'}
                            </div>
                            <div className="text-left">
                                <div className="font-semibold">{wallet.name}</div>
                                <div className="text-sm text-gray-600">
                                    {wallet.installed ? 'Installed' : 'Not installed'}
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">No compatible wallets found</p>
                        <p className="text-sm text-gray-500">
                            Please install{' '}
                            <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                MetaMask
                            </a>
                            {' '}or{' '}
                            <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Coinbase Wallet
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletSelector;
