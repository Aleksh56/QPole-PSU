import { createStore, createEvent } from 'effector';

export const updateAnswer = createEvent();
export const updateMultipleAnswer = createEvent();
export const resetAnswers = createEvent();

export const $answersStore = createStore([])
  .on(updateMultipleAnswer, (state, { question, answer_option, text = null }) => {
    if (!text) {
      const filteredState = state.filter(
        (answer) => !(answer.text && answer.question === question)
      );
      const existingIndex = filteredState.findIndex(
        (answer) => answer.answer_option === answer_option && answer.question === question
      );
      return existingIndex === -1
        ? [...filteredState, { answer_option, question }]
        : filteredState.filter((_, index) => index !== existingIndex);
    } else {
      const filteredState = state.filter((answer) => !answer.text && answer.question === question);
      return [...filteredState, { answer_option, question, text }];
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
