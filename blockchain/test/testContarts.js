import Web3 from "web3";
const web3 = new Web3("http://188.225.45.226:8545");

const contractAddress = "0xb2d6368a79250607c9d4688b260f20d0cecbd368";
const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "get",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];

const contract = new web3.eth.Contract(abi, contractAddress);

async function testTransaction() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("Using account:", accounts[0]);

    console.log("Sending set(555) transaction...");
    const setReceipt = await contract.methods.set(555).send({
      from: accounts[0],
      gasPrice: "20000000000",
      gas: "210000",
    });
    console.log("Transaction receipt:", setReceipt);

    console.log("Calling get()...");
    const result = await contract.methods.get().call();
    console.log("Stored value is: " + result);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

testTransaction();
