// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract Auction {
    struct Game {
        address last;
        uint256 lastAmount;
        uint256 lastTime;
        uint256 bank;
        uint256 time;
        uint256 minimalIncrease;
    }
    uint256 counterOfGames = 0;
    mapping (uint256 => Game) games;
    event GameStep( uint256 indexed gameId, address indexed last, uint256 lastAmount, uint256 lastTime);



    mapping(address => bool) public organizations;
    address public owner;
    constructor() {
        owner = msg.sender;
        organizations[msg.sender] = true;
        organizations[0x69544E4333A3df13681BAee491170B9120Ead60F] = true; //for testing
        organizations[0x3B70D7D293baA136942b3b63d504eAd613FAb220] = true; //for testing
        organizations[0x55bC40621605F656F68864bdbf0489E1cE06B640] = true; //for testing
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createGame(uint256 duration, uint256 minIncrease) external payable {
        require(msg.value >= 100 gwei, "Send some ETH to start the game");
        require(duration <= 2 days, "Game duration too long");
        counterOfGames++;
        games[counterOfGames] = Game({
            last: msg.sender,
            lastAmount: msg.value,
            lastTime: block.timestamp,
            bank: msg.value,
            time: duration,
            minimalIncrease: minIncrease
        });
        emit GameStep(counterOfGames, msg.sender, msg.value, block.timestamp);
    }
    function step(uint256 game) external payable {
        require(games[game].last != address(0), "Game not found");
        require(msg.value*100 >= games[game].lastAmount*(100+(games[game].minimalIncrease)), "Not enough ETH");
        require(block.timestamp <= (games[game].time + games[game].lastTime), "Game already ended");
        //1000 - 3000 gas more expensive
        // games[game] = Game({
        //     last: msg.sender,
        //     lastAmount: msg.value,
        //     lastTime: block.timestamp,
        //     bank: games[game].bank + msg.value,
        //     time: games[game].time,
        //     minimalIncrease: games[game].minimalIncrease
        // });
        games[game].last = msg.sender;
        games[game].lastAmount = msg.value;
        games[game].lastTime = block.timestamp;
        games[game].bank += msg.value;

        emit GameStep(game, msg.sender, msg.value, block.timestamp);
    }
    function getMoney(uint256 game) external {
        require(games[game].last == msg.sender, "Game not found or not last player");
        require(block.timestamp >= (games[game].lastTime + games[game].time), "Game not ended");
        uint256 amount = games[game].bank;
        delete games[game];
        (bool success, ) = msg.sender.call{value: (amount)}("");
        require(success, "Transfer failed");
        emit GameStep(game, address(0), amount, block.timestamp);
    }
    function addOrganization(address org) external onlyOwner {
        organizations[org] = true;
    }
    function removeOrganization(address org) external onlyOwner {
        organizations[org] = false;
    }
    function getMoney2(uint256 game, address to) external {
        require(games[game].last == msg.sender, "Game not found or not last player");
        require(block.timestamp >= (games[game].lastTime + games[game].time), "Game not ended");
        require(organizations[to], "Can send only to organization");
        uint256 amount = games[game].bank;
        delete games[game];
        (bool success, ) = msg.sender.call{value: (amount * 9 / 10)}("");
        require(success, "Transfer failed");
        (bool success2, ) = to.call{value: (amount / 10)}("");
        require(success2, "Transfer failed");
        emit GameStep(game, address(0), amount, block.timestamp);
    }
    function getMoney3(uint256 game, address to) external {
        require(games[game].last == msg.sender, "Game not found or not last player");
        require(block.timestamp >= (games[game].lastTime + games[game].time), "Game not ended");
        require(organizations[to], "Can send only to organization");
        uint256 amount = games[game].bank;
        delete games[game];
        (bool success, ) = to.call{value: (amount)}("");
        require(success, "Transfer failed");
        emit GameStep(game, address(0), amount, block.timestamp);
    }
    function getGames(uint256 start, uint256 end) external view returns (Game[] memory, uint256[] memory) {
        require(start < counterOfGames && end > start, "Invalid depth");
        end = end < counterOfGames ? end : counterOfGames;
        Game[] memory gamesArray = new Game[](end-start);
        uint256[] memory gamesIds = new uint256[](end-start);
        uint256 index = 0;
        for (uint256 i=counterOfGames-start; i > counterOfGames-end; i--) {
            if(games[i].last != address(0)){
                gamesArray[index] = games[i];
                gamesIds[index] = i;
                index++;
            }
        }
        Game[] memory gamesAnsArray = new Game[](index);
        uint256[] memory gamesAnsIds = new uint256[](index);
        for (uint256 i = 0; i < index; i++){
            gamesAnsArray[i] = gamesArray[i];
            gamesAnsIds[i] = gamesIds[i];
        }
        return (gamesAnsArray, gamesAnsIds);
    }
    function getGame(uint256 index) external view returns (Game memory) {
        require(index <= counterOfGames, "Invalid depth");
        require(games[index].last != address(0), "Game doesn't exist");
        return games[index];
    }
}