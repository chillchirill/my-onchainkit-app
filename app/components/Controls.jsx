import SimpleNetworkSwitcher from "./SimpleNetworkSwitcher";
import { useCurrency } from "../contexts/CurrencyContext";

const Controls = () => {
    const { setCurrency, currency, currencyOptions } = useCurrency();
    // const [leftRange, setLeftRange] = useState(1);
    // const [rightRange, setRightRange] = useState(20);
    // const [showFinished, setShowFinished] = useState(false);

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-4 p-6">
            {/* Action Buttons */}
            {/* <div className="flex justify-center">
                <Link href={"/"} className="">
                    <p className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-lg text-base sm:text-lg text-center">
                        My Games
                    </p>
                </Link>
            </div>
            */}

            {/* Game Controls */}
            {/* <div className="bg-gray-100 p-3 sm:p-4 rounded-lg"> */}
                {/* Mobile: Stack vertically, Desktop: Single row */}
                {/* <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"> */}

                    {/* Navigation and Range Inputs Row */}
                    {/* <div className="flex items-center justify-center gap-2 sm:gap-4 flex-shrink-0">
                        <button className="text-gray-600 hover:text-gray-800 text-xl sm:text-2xl font-bold px-2 py-1 touch-manipulation"
                            onClick={() => {
                                const rangeSize = rightRange - leftRange;
                                setLeftRange(Math.max(1, leftRange - rangeSize));
                                setRightRange(Math.max(leftRange, rightRange - rangeSize));
                            }}>
                            &lt;&lt;
                        </button>

                        <input
                            type="number"
                            value={leftRange}
                            onChange={(e) => setLeftRange(Number(e.target.value))}
                            className="w-12 sm:w-16 p-1 sm:p-2 text-center text-sm sm:text-base border border-gray-300 rounded"
                        />

                        <span className="text-gray-600 font-bold text-sm sm:text-base">-</span>

                        <input
                            type="number"
                            value={rightRange}
                            onChange={(e) => setRightRange(Number(e.target.value))}
                            className="w-12 sm:w-16 p-1 sm:p-2 text-center text-sm sm:text-base border border-gray-300 rounded"
                        />

                        <button className="text-gray-600 hover:text-gray-800 text-xl sm:text-2xl font-bold px-2 py-1 touch-manipulation"
                            onClick={() => {
                                const rangeSize = rightRange - leftRange;
                                setLeftRange(leftRange + rangeSize);
                                setRightRange(rightRange + rangeSize);
                            }}>
                            &gt;&gt;
                        </button>
                    </div> */}

                    {/* Currency Selector - Full width on mobile */}
                    <div className="flex justify-center sm:justify-start">
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
                    </div>

                    {/* Finished Games Checkbox - Center on mobile */}
                    {/* <div className="flex items-center justify-center sm:justify-start gap-2 sm:ml-auto">
                        <span className="text-gray-700 text-sm sm:text-base">Show finished games?</span>
                        <input
                            type="checkbox"
                            value={showFinished}
                            onChange={(e) => setShowFinished(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-2 border-blue-600 rounded focus:ring-blue-500 touch-manipulation"
                        />
                    </div>
                </div>
            </div> */}

            <SimpleNetworkSwitcher />
        </div>
    );
};

export default Controls;
