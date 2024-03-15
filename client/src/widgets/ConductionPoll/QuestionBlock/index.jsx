import React, { useState } from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { updateAnswer } from '@/components/03_Pages/Polls/ConductionPoll/store/answer-store';

const QuestionBlock = ({ question }) => {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    console.log(event);
    setValue(event.target.value);
    updateAnswer({ answer_option: parseInt(event.target.value, 10), question: question.id });
  };

  return (
    <FormControl
      component="fieldset"
      sx={{ border: '1px solid black', padding: '20px', width: '100%' }}
    >
      <FormLabel component="legend">{question.name} ?</FormLabel>
      <RadioGroup
        aria-label={question.name}
        name="radio-buttons-group"
        value={value}
        onChange={(e) => handleChange(e)}
      >
        {question?.answer_options?.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            control={<Radio />}
            label={option.name}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default QuestionBlock;
