import { createStore, createEvent } from 'effector';

export const updateAnswer = createEvent();
export const resetAnswers = createEvent();

export const $answersStore = createStore([])
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
