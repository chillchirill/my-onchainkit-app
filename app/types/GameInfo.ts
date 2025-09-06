import { AddressLike } from "ethers";

interface GameInfo {
    lastBetter: string;
    lastAmountETH: number;
    // UNIX time in UTC
    lastBetTime: number;
    bankAmountETH: number;
    // Period of betting in seconds
    period: number;
    minIncrease: number;
    gameNumber: number;
};

export default GameInfo;