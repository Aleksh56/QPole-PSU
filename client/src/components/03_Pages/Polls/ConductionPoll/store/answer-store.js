import { createStore, createEvent } from 'effector';

export const updateAnswer = createEvent();
export const updateMultipleAnswer = createEvent();
export const resetAnswers = createEvent();

export const $answersStore = createStore([])
  .on(updateMultipleAnswer, (state, { question, answer_option }) => {
    const answerObject = { answer_option, question };
    const existingIndex = state.findIndex(
      (answer) => answer.answer_option === answer_option && answer.question === question
    );

    if (existingIndex === -1) {
      return [...state, answerObject];
    } else {
      return state.filter((_, index) => index !== existingIndex);
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
  .reset(resetAnswers);

$answersStore.watch((state) => console.log(state));
