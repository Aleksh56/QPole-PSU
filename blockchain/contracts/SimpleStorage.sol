// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MiniPoll {
    struct Poll {
        string question;
        string[] options;
        mapping(uint => uint) votes;
    }

    Poll[] public polls;

    function createPoll(string memory question, string[] memory options) public {
        Poll storage newPoll = polls.push();
        newPoll.question = question;
        newPoll.options = options;
    }

    // Голосование в опросе
    function vote(uint pollIndex, uint[] memory answerOptions) public {
        require(pollIndex < polls.length, "Poll index is out of bounds."); // Проверка наличия опроса
        Poll storage poll = polls[pollIndex];
        for (uint i = 0; i < answerOptions.length; i++) {
            uint optionIndex = answerOptions[i];
            require(optionIndex < poll.options.length, "Option index is out of bounds."); // Проверка допустимости optionIndex
            poll.votes[optionIndex]++;
        }
    }

   // Получение результатов опроса
    function getPollResults(uint pollIndex) public view returns (string memory question, string[] memory options, uint[] memory votes) {
        Poll storage poll = polls[pollIndex];
        uint[] memory votesArray = new uint[](poll.options.length);
        for (uint i = 0; i < poll.options.length; i++) {
            votesArray[i] = poll.votes[i];
        }
        return (poll.question, poll.options, votesArray);
    }

    // Получение всех опросов
    function getAllPolls() public view returns (string[] memory questions) {
        questions = new string[](polls.length);
        for (uint i = 0; i < polls.length; i++) {
            questions[i] = polls[i].question;
        }
        return questions;
    }
}
