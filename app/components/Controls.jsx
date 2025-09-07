import { useCurrency } from "../contexts/CurrencyContext";

const Controls = () => {
    const { setCurrency, currency, currencyOptions } = useCurrency();


    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4 p-6">
            {/* Currency Selector and Refresh Button - Same row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <select
                    className="w-full sm:w-auto p-2 text-sm sm:text-base border border-gray-300 rounded bg-white min-w-[100px]"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                >
                    {currencyOptions.map((option) => (
                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>
                    ))}
                </select>

                <button
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors duration-200"
                    onClick={() => window.location.reload()}
                >
                    Refresh Games
                </button>
            </div>
        </div>
    );
};

export default Controls;
