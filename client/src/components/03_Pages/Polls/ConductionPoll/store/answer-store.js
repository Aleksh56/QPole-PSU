import { createStore, createEvent } from 'effector';

export const updateAnswer = createEvent();
export const updateMultipleAnswer = createEvent();
export const resetAnswers = createEvent();

export const $answersStore = createStore([])
  // .on(updateMultipleAnswer, (state, { question, answer_option, text = null }) => {
  //   if (!text) {
  //     const filteredState = state.filter((answer) => !answer.text && answer.question === question);
  //     const existingIndex = filteredState.findIndex(
  //       (answer) => answer.answer_option === answer_option && answer.question === question
  //     );
  //     return existingIndex === -1
  //       ? [...filteredState, { answer_option, question }]
  //       : filteredState.filter((_, index) => index !== existingIndex);
  //   } else {
  //     const filteredState = state.filter((answer) => !answer.text && answer.question === question);
  //     return [...filteredState, { answer_option, question, text }];
  //   }
  // })
  .on(updateMultipleAnswer, (state, { question, answer_option, text = null, selected }) => {
    if (text !== null) {
      // При вводе текста удаляем все предыдущие ответы этого вопроса (чекбоксы) и добавляем текстовый ответ
      const newState = state.filter((answer) => answer.question !== question);
      return [...newState, { answer_option, question, text }];
    } else {
      // При выборе чекбокса удаляем все текстовые ответы и обновляем выбор чекбоксов
      const filteredState = state.filter(
        (answer) => !(answer.question === question && answer.text)
      );

      const existingAnswerIndex = filteredState.findIndex(
        (answer) => answer.question === question && answer.answer_option === answer_option
      );
      if (selected) {
        if (existingAnswerIndex === -1) {
          // Если чекбокс выбран и его еще нет, добавляем его
          return [...filteredState, { answer_option, question }];
        }
      } else {
        // Если чекбокс снят, удаляем его из состояния
        if (existingAnswerIndex !== -1) {
          return filteredState.filter(
            (answer) => !(answer.question === question && answer.answer_option === answer_option)
          );
        }
      }
      return filteredState;
    }
  })
  .on(updateAnswer, (state, payload) => {
    const answerIndex = state.findIndex((answer) => answer.question === payload.question);
    if (answerIndex > -1) {
      return state.map((answer) => (answer.question === payload.question ? payload : answer));
    } else {
      return [...state, payload];
    }
  })
  // .on(updateMultipleAnswer, (state, { question, answer_option, selected }) => {
  //   const existingAnswerIndex = state.findIndex(
  //     (answer) => answer.question === question && answer.answer_option === answer_option
  //   );

  //   if (selected) {
  //     // If the checkbox is selected, add a placeholder text
  //     if (existingAnswerIndex === -1) {
  //       return [...state, { answer_option, question }];
  //     }
  //   } else {
  //     // If the checkbox is deselected, remove the corresponding answer
  //     if (existingAnswerIndex !== -1) {
  //       return state.filter(
  //         (answer) => !(answer.question === question && answer.answer_option === answer_option)
  //       );
  //     }
  //   }

  //   return state;
  // })
  .reset(resetAnswers);

$answersStore.watch((state) => console.log(state));
