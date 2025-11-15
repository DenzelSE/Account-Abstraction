const hre = require("hardhat");

const EP_address = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
const CELO_PM_address = "0x0000000071727de22e5e9d8baf0edac6f37da032"
// const AF_address = "0x36aA4C333d66e5760Fd20Eb7B2958ee6B5a96Bc6"
const PM_address = "0xf718E2E350188a3B4a06A4eb03a749181a77CD3E"
const COUNT_address = "0xAFE0926e3dcF9d0d81Ef8E0d51FA068F43cd5060"
const Token_address = "0x640ba6878C2B85E9038689fC1D7eC06A71ECE0d5"


AF_NONCE = 2; // think it's used to track of tx's(?)

async function main() {

    // const Account1 = await hre.ethers.deployContract("Counter");
    // await Account1.waitForDeployment();
    // console.log(`Account deployed to ${Account1.target}`);

    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint", EP_address
    );
    const COUNTER_CONTRACT = await hre.ethers.getContractAt("Counter", COUNT_address);
    const Account = await hre.ethers.getContractFactory("Account");
    const Token_contract = await hre.ethers.getContractAt("TokenABC", Token_address);


    
    const [signer] = await hre.ethers.getSigners();
    const addr1 = await signer.getAddress(); // This will be the smart wallet owner


    let initCode = AF_address + AccountFactory.interface.encodeFunctionData("createAccount", [addr1]).slice(2); // determines reusability of an address(create a new one/reuse existing)
    

    let sender // sender needs to have a balance on the entry point to be able to execute UserOps

    try {
        sender = await EntryPoint.getSenderAddress(initCode);
        // This always reverts!!! 
    } catch (error) {
        sender = "0x" + error.data.slice(-40);
        console.log('sender: ', sender)
    }

    // const code = await hre.ethers.provider.getCode(sender);
    // if (code !== "0x") {
    //     initCode = "0x";
    // }

    // For calling an external contract, we first need to encode the original function call
    // const incrementFunctionOnExternalContract = COUNTER_CONTRACT.interface.encodeFunctionData("increment");
    const Token = Token_contract.interface.encodeFunctionData("mintTo", [sender, 5]);

    // To call an external function from the smart wallet, we must encode the original function call
    // inside the execute method from the smart wallet
    const new_token = Account.interface.encodeFunctionData("execute", [Token_address, 0, Token]);


    // // the goal is to have smart account call another functions from another smart contract

    userOp = {
        sender,
        nonce: await EntryPoint.getNonce(sender, 0),
        initCode: "0x",// If the wallet has already been created, pass "0X", otherwise just use the default initCode which creates the wallet
        callData: new_token, // call the execute method on the Smart Wallet
        callGasLimit: 400_000,
        verificationGasLimit: 800_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseUnits("30", "gwei"), //changed to parseUnits line 56 & 57
        maxPriorityFeePerGas: hre.ethers.parseUnits("30", "gwei"),
        paymasterAndData: PM_address,
        signature: "0x", // This value will be updated after getting the userOpHash. Keep it like this for now
    }

    const userOpHash = await EntryPoint.getUserOpHash(userOp);

    const signature = await signer.signMessage(hre.ethers.getBytes(userOpHash));
    userOp.signature = signature;

    const pm_B = await EntryPoint.balanceOf(PM_address);
    console.log(pm_B);

    try {
        const txHash = await EntryPoint.handleOps([userOp], addr1); //was getting a FailedOp(0, "AA23 reverted: ECDSA: invalid signature length") so added signature line 64 & 67
        
} catch (error) {
    console.log("error ", error.data)
    console.log("txHash: ", txHash)
}
    // Checking to see if external contract function was actually called
    // const count = await COUNTER_CONTRACT.count()
    // console.log(count.toString(), 'is the count')

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});