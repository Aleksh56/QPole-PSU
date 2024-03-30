import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
} from '@mui/material';
import {
  updateAnswer,
  updateMultipleAnswer,
} from '@/components/03_Pages/Polls/ConductionPoll/store/answer-store';
import { shuffleArray } from '@/utils/js/shuffleArray';
import { StyledFormControl } from './styled';

const QuestionBlock = ({ question, isMixed }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState(question.answer_options ?? []);

  useEffect(() => {
    if (isMixed) {
      setOptions(shuffleArray(question.answer_options));
    }
  }, [question]);

  const handleChange = (event) => {
    const optionId = parseInt(event.target.value, 10);
    const existingIndex = selectedValues.findIndex((id) => id === optionId);

    if (question.has_multiple_choices) {
      if (existingIndex !== -1) {
        const newValues = [...selectedValues];
        newValues.splice(existingIndex, 1);
        setSelectedValues(newValues);
        updateMultipleAnswer({ answer_option: optionId, question: question.id, selected: false });
      } else {
        setSelectedValues([...selectedValues, optionId]);
        updateMultipleAnswer({ answer_option: optionId, question: question.id, selected: true });
      }
    } else {
      setSelectedValue(optionId);
      updateAnswer({ answer_option: optionId, question: question.id });
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <Typography>{question.name}</Typography>
      <RadioGroup
        aria-label={question.name}
        name="radio-buttons-group"
        value={selectedValues}
        onChange={(e) => handleChange(e)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            control={
              question.has_multiple_choices ? (
                <Checkbox
                  checked={selectedValues.includes(option.id)}
                  onChange={(e) => handleChange(e)}
                />
              ) : (
                <Radio checked={selectedValue === option.id} />
              )
            }
            label={option.name}
          />
        ))}
      </RadioGroup>
    </StyledFormControl>
  );
};

export default QuestionBlock;
