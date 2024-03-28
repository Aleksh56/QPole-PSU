// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnonymousSurvey {
    // Структура для хранения информации об опросе
    struct Survey {
        uint id; // Уникальный идентификатор опроса
        string question; // Вопрос опроса
    }

    // Событие для уведомления о новом ответе
    event AnswerReceived(uint surveyId, string answer);

    // Массив для хранения опросов
    Survey[] public surveys;

    // Ответы на опросы, ключ - ID опроса, значение - массив ответов
    mapping(uint => string[]) public answers;

    // Функция для создания нового опроса
    function createSurvey(string memory _question) public {
        surveys.push(Survey(surveys.length, _question));
    }

    // Функция для отправки ответа на опрос
    function answerSurvey(uint _surveyId, string memory _answer) public {
        require(_surveyId < surveys.length, "Survey does not exist.");
        answers[_surveyId].push(_answer);
        emit AnswerReceived(_surveyId, _answer);
    }

    // Функция для получения вопроса опроса по ID
    function getSurveyQuestion(uint _surveyId) public view returns (string memory) {
        require(_surveyId < surveys.length, "Survey does not exist.");
        return surveys[_surveyId].question;
    }

    // Функция для получения всех ответов на опрос по ID
    function getSurveyAnswers(uint _surveyId) public view returns (string[] memory) {
        require(_surveyId < surveys.length, "Survey does not exist.");
        return answers[_surveyId];
    }
}
