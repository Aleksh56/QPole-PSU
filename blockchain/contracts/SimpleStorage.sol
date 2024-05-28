// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MiniPoll { 
    struct VoteInput {
        uint question;
        uint answer_option;
    }

    struct AnswerOption{
        uint id;
        string name;
        uint question;
        uint votes;
    }

    struct Question {
        uint id;
        string name;
        AnswerOption[] answer_options;
    }

    struct Poll {
        string poll_id;
        string name;
        string poll_type;
        Question[] questions;
        string[] options;
    }

    Poll[] public polls;
    mapping(string => bool) private existingPollIDs;
    mapping(string => VoteInput[]) private pollResponses;

     function vote(string memory poll_id, VoteInput[] memory votes) public {
        (uint pollIndex, bool found) = findPollIndex(poll_id);
        require(found, "Poll not found");

        for (uint i = 0; i < votes.length; i++) {
            (uint questionIndex, bool questionFound) = findQuestionIndex(pollIndex, votes[i].question);
            require(questionFound, "Question not found");

            (uint answerIndex, bool answerFound) = findAnswerIndex(pollIndex, questionIndex, votes[i].answer_option);
            require(answerFound, "Answer option not found");

            polls[pollIndex].questions[questionIndex].answer_options[answerIndex].votes++;
        }
        pollResponses[poll_id] = votes;
    }

    function getPollResponses(string memory poll_id) public view returns (VoteInput[] memory) {
        return pollResponses[poll_id];
    }

    function findAnswerIndex(uint pollIndex, uint questionIndex, uint answerId) private view returns (uint, bool) {
        Question storage question = polls[pollIndex].questions[questionIndex];
        for (uint i = 0; i < question.answer_options.length; i++) {
            if (question.answer_options[i].id == answerId) {
                return (i, true);
            }
        }
        return (0, false);
    }


    function createPoll(string memory poll_id, string memory poll_type) public {
        require(!existingPollIDs[poll_id], "Poll with this ID already exists.");

        Poll storage newPoll = polls.push();
        newPoll.poll_id = poll_id;
        newPoll.poll_type = poll_type;
        
        existingPollIDs[poll_id] = true;
    }

    function patchPoll(string memory poll_id, string memory field, string memory value) public {
        (uint index, bool found) = findPollIndex(poll_id);
        require(found, "Poll not found");

         if (keccak256(bytes(field)) == keccak256(bytes("name"))) {
            polls[index].name = value;
        } else {
            revert("Field not recognized");
        }
    }

    function findPollIndex(string memory poll_id) private view returns (uint, bool) {
        for (uint i = 0; i < polls.length; i++) {
            if (keccak256(bytes(polls[i].poll_id)) == keccak256(bytes(poll_id))) {
                return (i, true);
            }
        }
        return (0, false);
    }

    function uintToString(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k - 1;
            bstr[k] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

function getAllPolls() public view returns (string[] memory) {
    string[] memory allPolls = new string[](polls.length);
    for (uint i = 0; i < polls.length; i++) {
        string memory questionDetails = "";
        for (uint j = 0; j < polls[i].questions.length; j++) {
            if (j > 0) {
                questionDetails = string(abi.encodePacked(questionDetails, ", "));
            }
            string memory answersDetails = formatAnswers(polls[i].questions[j].answer_options);
            questionDetails = string(abi.encodePacked(questionDetails, "{QID: ", uintToString(polls[i].questions[j].id),
                ", QName: ", polls[i].questions[j].name, ", Answers: [", answersDetails, "]}"));
        }
        allPolls[i] = string(abi.encodePacked("Poll ID: ", polls[i].poll_id, ", Name: ", polls[i].name,
            ", Type: ", polls[i].poll_type, ", Questions: [", questionDetails, "]"));
    }
    return allPolls;
}

    function formatAnswers(AnswerOption[] storage answers) private view returns (string memory) {
        string memory details = "";
        for (uint k = 0; k < answers.length; k++) {
            if (k != 0) {
                details = string(abi.encodePacked(details, ", "));
            }
            details = string(abi.encodePacked(details, "{AID: ", uintToString(answers[k].id), ", AName: ", answers[k].name));
        }
        return details;
    }


     function findQuestionIndex(uint pollIndex, uint question_id) private view returns (uint, bool) {
        for (uint i = 0; i < polls[pollIndex].questions.length; i++) {
            if (polls[pollIndex].questions[i].id == question_id) {
                return (i, true);
            }
        }
        return (0, false);
    }

    function addAnswerToQuestion(string memory poll_id, uint question_id, uint ans_id) public {
        (uint pollIndex, bool pollFound) = findPollIndex(poll_id);
        require(pollFound, "Poll not found");

        (uint questionIndex, bool questionFound) = findQuestionIndex(pollIndex, question_id);
        require(questionFound, "Question not found");

        AnswerOption storage newAnswer = polls[pollIndex].questions[questionIndex].answer_options.push();

        newAnswer.id = ans_id;
        newAnswer.question = polls[pollIndex].questions[questionIndex].id;

        polls[pollIndex].questions[questionIndex].answer_options.push(newAnswer);
    }
    

    function addQuestionToPoll(string memory poll_id, uint question_id) public {
        (uint pollIndex, bool found) = findPollIndex(poll_id);
        require(found, "Poll not found");

        Question storage newQuestion = polls[pollIndex].questions.push();
        newQuestion.id = question_id; 
        newQuestion.name = "";

        polls[pollIndex].questions.push(newQuestion);
    }

}
