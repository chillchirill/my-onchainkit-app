//даний файл створен
const hre = require('hardhat');
const ethers = hre.ethers;
const fs = require('fs');
const path = require('path');
//network повинна бути не hardhat 
async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }
  //перший з 20 адресів
  const [deployer] = await ethers.getSigners()
  // console.log("Balance:", (await deployer.getBalance()).toString());
  //адрес того хто деплоїть
  console.log("Deploying with", await deployer.getAddress())

  const MyTokenFactory = await ethers.getContractFactory("Auction", deployer);

  // Деплой без аргументів, якщо є — передати в масиві
  const skill = await MyTokenFactory.deploy();

  // Чекаємо на завершення деплою
  await skill.waitForDeployment();

  console.log("Deployed to:", await skill.getAddress());

  // Зберігаємо ABI та адресу
  await saveFrontendFiles({
    Auction: skill
  });
}

//збурігає важливі фали про контракт
async function saveFrontendFiles(contracts) {
  const contractsDir = path.join(__dirname, '/..', '/front')

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }
  //до кожного контракту звертається
  for (const [name, contract] of Object.entries(contracts)) {
    const address = await contract.getAddress(); // або contract.target
    //перезаписує
    fs.writeFileSync(
      path.join(contractsDir, `${name}-address.json`),
      JSON.stringify({ address }, null, 2)
    );

    const artifact = await artifacts.readArtifact(name); // ім'я контракту
    fs.writeFileSync(
      path.join(contractsDir, `${name}.json`),
      JSON.stringify(artifact, null, 2)
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
