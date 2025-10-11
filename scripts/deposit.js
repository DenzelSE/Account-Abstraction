const hre = require("hardhat");


const EP_address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const AF_address = "0x36aA4C333d66e5760Fd20Eb7B2958ee6B5a96Bc6"
const PM_address = "0xf718E2E350188a3B4a06A4eb03a749181a77CD3E"


async function main() {
    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_address);    


    // const [signer] = await hre.ethers.getSigners();
    // const addr1 = await signer.getAddress();

    
    // const initCode = AF_address + AccountFactory.interface.encodeFunctionData("createAccount", [addr1]).slice(2);

    // let sender // was getting AA14 initCode must return sender so commented out line 13 to 15 and uncommented out  26 to 31
    // try {
    //     await EntryPoint.getSenderAddress(initCode);
    // } catch (error) {
        
    //     sender = "0x" + error.data.data.slice(-40);
    //     console.log('You are here', sender)
    // }

    await EntryPoint.depositTo(PM_address, {
        value: hre.ethers.parseEther("0.1"),
    });
    console.log("deposit was successful to", PM_address);
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});