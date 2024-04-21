import Web3 from 'web3';
const web3 = new Web3('http://127.0.0.1:7545');

const contractAddress = '0x2dF6865E3d485D90fe7d92B28e2Af5f12749CA74';
const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'x',
        type: 'uint256',
      },
    ],
    name: 'set',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'get',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const contract = new web3.eth.Contract(abi, contractAddress);

async function testTransaction() {
  const accounts = await web3.eth.getAccounts();
  //   await contract.methods.set(123).send({ from: accounts[0] }); // Вызов функции set
  const result = await contract.methods.get().call(); // Вызов функции get
  console.log('Stored value is: ' + result);
}

testTransaction();
