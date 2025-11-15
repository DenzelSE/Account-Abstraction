const hre = require("hardhat");

const EP_address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const AF_address = "0x4DdFdf7724662063B035AA032e802c00f17Aed15"
const COUNT_address = "0xAFE0926e3dcF9d0d81Ef8E0d51FA068F43cd5060"
const PM_Address = "0xf718E2E350188a3B4a06A4eb03a749181a77CD3E"

AF_NONCE = 2; // think it's used to track of tx's(?)

async function main() {
    // const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    // const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_address);
    // const COUNTER_CONTRACT = await hre.ethers.getContractAt("Counter", COUNT_address);
    // const Account = await hre.ethers.getContractFactory("Account");


    const [signer] = await hre.ethers.getSigners();
    const addr1 = await signer.getAddress(); // This will be the smart wallet owner


    const signature = await signer.signMessage(hre.ethers.getBytes(hre.ethers.id('hello')));

    const Test = await hre.ethers.getContractFactory('Test');
    await Test.deploy(signature);

    console.log('Signature: ', signature);
    console.log('Address',addr1)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});