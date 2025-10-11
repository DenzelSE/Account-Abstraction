const hre = require("hardhat");

async function main() {


    const Token = await hre.ethers.deployContract("TokenABC");
    await Token.waitForDeployment();
    console.log(`Token deployed to ${Token.target}`);
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});