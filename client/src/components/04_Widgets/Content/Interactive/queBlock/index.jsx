import React, { useEffect, useState } from 'react';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  TextField,
} from '@mui/material';
import {
  updateAnswer,
  updateMultipleAnswer,
  resetAnswers,
} from '@/components/03_Pages/Polls/ConductionPoll/store/answer-store';
import { shuffleArray } from '@/utils/js/shuffleArray';
import { StyledFormControl } from './styled';

const QueBlock = ({ question, isMixed }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [fieldValue, setFieldValue] = useState('');
  const [options, setOptions] = useState(question.answer_options ?? []);

  useEffect(() => {
    if (isMixed) {
      const shuffled = shuffleArray([...question.answer_options]);
      const index = shuffled.findIndex((option) => option.order_id === 16);
      if (index !== -1) {
        const [item] = shuffled.splice(index, 1);
        shuffled.push(item);
      }
      setOptions(shuffled);
    }
  }, [question]);

  const handleChange = (event, opt_id, isFree) => {
    const { value, checked } = event.target;
    if (question.has_multiple_choices) {
      if (isFree) {
        setSelectedValues('');
        setFieldValue(value);
        updateMultipleAnswer({ answer_option: opt_id, question: question.id, text: value });
      } else {
        setFieldValue('');
        if (checked) {
          setSelectedValues((prev) => [...prev, opt_id]);
        } else {
          setSelectedValues((prev) => prev.filter((id) => id !== opt_id));
        }
        updateMultipleAnswer({
          answer_option: opt_id,
          question: question.id,
          selected: selectedValues[opt_id],
        });
      }
    } else if (question.is_free) {
      setSelectedValue(value);
      updateAnswer({
        answer_option: opt_id,
        question: question.id,
        text: value,
      });
    } else {
      if (isFree) {
        setFieldValue(value);
        setSelectedValue('');
        updateAnswer({ answer_option: opt_id, question: question.id, text: value });
      } else {
        setFieldValue('');
        setSelectedValue(opt_id);
        updateAnswer({ answer_option: Number(opt_id), question: question.id });
      }
    }
  };

  return (
    <StyledFormControl component="fieldset">
      <Typography>{question.name}</Typography>
      {question.is_free ? (
        options.map((option) => (
          <TextField
            label="Мой ответ"
            variant="outlined"
            fullWidth
            value={selectedValue}
            id={String(option.id)}
            onChange={(e) => handleChange(e, option.id)}
            sx={{ marginTop: '10px' }}
          />
        ))
      ) : (
        <RadioGroup
          aria-label={question.name}
          name="radio-buttons-group"
          value={selectedValue}
          onChange={(e) => handleChange(e, e.target.value)}
        >
          {options.map((option) =>
            option.is_free_response ? (
              <TextField
                key={option.id}
                label="Введите ваш ответ"
                variant="outlined"
                fullWidth
                value={fieldValue || ''}
                onChange={(e) => handleChange(e, option.id, option.is_free_response)}
                sx={{ marginTop: '10px' }}
              />
            ) : (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={
                  question.has_multiple_choices ? (
                    <Checkbox
                      checked={selectedValues?.includes(option.id)}
                      onChange={(e) => handleChange(e, option.id)}
                    />
                  ) : (
                    <Radio checked={selectedValue === option.id.toString()} />
                  )
                }
                label={option.name}
              />
            )
          )}
        </RadioGroup>
      )}
    </StyledFormControl>
  );
};

export default QueBlock;
