import Web3 from "web3";
const web3 = new Web3("http://188.225.45.226:8545");

const contractAddress = "0xb473b752ab43717e5203117e6f55df2d2e014839";
const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "polls",
    outputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "poll_type",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "question",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "answer_option",
            type: "uint256",
          },
        ],
        internalType: "struct MiniPoll.VoteInput[]",
        name: "votes",
        type: "tuple[]",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "poll_type",
        type: "string",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "field",
        type: "string",
      },
      {
        internalType: "string",
        name: "value",
        type: "string",
      },
    ],
    name: "patchPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPolls",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "question_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ans_id",
        type: "uint256",
      },
    ],
    name: "addAnswerToQuestion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poll_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "question_id",
        type: "uint256",
      },
    ],
    name: "addQuestionToPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contract = new web3.eth.Contract(abi, contractAddress);

async function fetchAllPolls() {
  try {
    const polls = await contract.methods.getAllPolls().call();
    console.log("Polls with Questions:");
    polls.forEach((poll, index) => {
      console.log(`Poll ${index + 1}: ${poll}`);
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
  }
}

async function patchPoll(pollId, field, value) {
  const accounts = await web3.eth.getAccounts();
  const txReceipt = await contract.methods
    .patchPoll(pollId, field, value)
    .send({
      from: accounts[1],
      gas: 3000000,
      gasPrice: "20000000000",
    });
  console.log("Poll patched successfully");
}

async function createPoll(pollId, pollType) {
  try {
    const accounts = await web3.eth.getAccounts();

    const txReceipt = await contract.methods.createPoll(pollId, pollType).send({
      from: accounts[1],
      gas: 3000000,
      gasPrice: "20000000000",
    });

    console.log("Poll created successfully:");
    await createQue("1");
  } catch (error) {
    console.error("Failed to create poll:", error);
  }
}

async function createQue(pollId) {
  try {
    const accounts = await web3.eth.getAccounts();

    const txReceipt = await contract.methods.addQuestionToPoll(pollId).send({
      from: accounts[1],
      gas: 3000000,
      gasPrice: "20000000000",
    });

    console.log("Poll que created successfully!");

    await createAns("1", 0);
  } catch (error) {
    console.error("Failed to create poll:", error);
  }
}

async function createAns(pollId, queId) {
  try {
    const accounts = await web3.eth.getAccounts();

    const txReceipt = await contract.methods
      .addAnswerToQuestion(pollId, queId)
      .send({
        from: accounts[1], // Using the first account in the list
        gas: 3000000, // Setting the gas limit for the transaction
        gasPrice: "20000000000", // Setting the gas price
      });

    console.log("Poll answ created successfully!");
    await vote("1", [{ question: 0, answer_option: 0 }]);
  } catch (error) {
    console.error("Failed to create poll:", error);
  }
}

async function vote(pollId, answers) {
  try {
    const accounts = await web3.eth.getAccounts();
    const formattedAnswers = answers.map((answer) => ({
      question: answer.question,
      answer_option: answer.answer_option,
      text: answer.text || "",
    }));

    const txReceipt = await contract.methods
      .vote(pollId, formattedAnswers)
      .send({
        from: accounts[1], // Using the first account in the list
        gas: 3000000, // Setting the gas limit for the transaction
        gasPrice: "20000000000", // Setting the gas price
      });

    console.log("Success vote!");
    await fetchAllPolls();
  } catch (error) {
    console.error("Failed to create poll:", error);
  }
}

// createPoll("3", "Test poll 2");

// vote("44a958f5-5fa9-44df-b9e4-75297a7089", [
//   { question: 1884, answer_option: 11005 },
// ]);

fetchAllPolls();
