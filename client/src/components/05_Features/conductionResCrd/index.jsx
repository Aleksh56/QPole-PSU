import React, { useState } from 'react';
import { OptionName, OptionsWrapper, StyledFormControl, StyledOption } from './styled';
import { Typography } from '@mui/material';

const ConductionResCrd = ({ question = {}, answers }) => {
  const options = question.answer_options ?? [];

  return (
    <StyledFormControl component="fieldset">
      <Typography>{question.name}</Typography>
      <OptionsWrapper>
        {options.map((item) => {
          const foundAnswer = answers.find((ans) => ans.answer_option === item.id);
          const isCorrect = foundAnswer ? foundAnswer.is_correct : null;
          return (
            <StyledOption key={item.id} isCorrect={isCorrect}>
              <OptionName>{item.name}</OptionName>
            </StyledOption>
          );
        })}
      </OptionsWrapper>
    </StyledFormControl>
  );
};

export default ConductionResCrd;
