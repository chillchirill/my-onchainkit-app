"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the currency types
export type CurrencyType = '$' | 'ETH' | 'gwei' | 'wei';

// Define the context type
interface CurrencyContextType {
    currency: CurrencyType;
    setCurrency: (currency: CurrencyType) => void;
    currencyOptions: CurrencyType[];
}

// Create the context
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider component props
interface CurrencyProviderProps {
    children: ReactNode;
    defaultCurrency?: CurrencyType;
}

// Provider component
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
    children,
    defaultCurrency = 'wei'
}) => {
    const [currency, setCurrency] = useState<CurrencyType>(defaultCurrency);

    const currencyOptions: CurrencyType[] = ['$', 'ETH', 'gwei', 'wei'];

    const value: CurrencyContextType = {
        currency,
        setCurrency,
        currencyOptions
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Custom hook to use the currency context
export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);

    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }

    return context;
};

// Helper function to format amounts based on currency type
export const formatCurrency = (amount: number | string, currency: CurrencyType): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    switch (currency) {
        case '$':
            return `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        case 'ETH':
            return `${numAmount.toFixed(6)} ETH`;
        case 'gwei':
            return `${numAmount.toLocaleString()} gwei`;
        case 'wei':
            return `${numAmount.toLocaleString()} wei`;
        default:
            return `${numAmount} ${currency}`;
    }
};

// Helper function to convert between currency types (mock implementation)
export const convertCurrency = (
    amount: number | bigint,
    fromCurrency: CurrencyType,
    toCurrency: CurrencyType,
    ethPrice: number
): number => {
    // Convert BigInt to number if needed
    const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
    
    // This is a simplified conversion - you'd want to use real exchange rates
    // and proper wei/gwei/ETH conversions in a real application

    if (fromCurrency === toCurrency) return numAmount;

    // Mock conversion rates (replace with real conversion logic)
    const conversionRates: Record<CurrencyType, Record<CurrencyType, number>> = {
        'wei': {
            'wei': 1,
            'gwei': 1e-9,
            'ETH': 1e-18,
            '$': 1e-18 * ethPrice
        },
        'gwei': {
            'wei': 1e9,
            'gwei': 1,
            'ETH': 1e-9,
            '$': 1e-9 * ethPrice
        },
        'ETH': {
            'wei': 1e18,
            'gwei': 1e9,
            'ETH': 1,
            '$': ethPrice
        },
        '$': {
            'wei': 1e18 / ethPrice,
            'gwei': 1e9 / ethPrice,
            'ETH': 1 / ethPrice,
            '$': 1
        }
    };

    return numAmount * (conversionRates[fromCurrency]?.[toCurrency] ?? 1);
};
