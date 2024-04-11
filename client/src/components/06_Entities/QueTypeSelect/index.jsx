import React, { useEffect, useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { TypeSelect } from './styled';
import { queTypes } from '@/data/fields';
import { useParams } from 'react-router-dom';
import usePollType from '@/hooks/usePollType';
import { changePollTypeFx } from './models/change-poll-type';

const QueTypeSelect = ({ question }) => {
  const { id } = useParams();
  const { pollType, isMultiple } = usePollType(id);
  const [questionType, setQuestionType] = useState('Один ответ');

  useEffect(() => {
    console.log(question);
    const initialQuestionType = question.is_free
      ? 'free'
      : question.has_multiple_choices
      ? 'multiple'
      : 'single';
    const initialQuestionTypeObject = queTypes.find((item) => item.name === initialQuestionType);
    console.log(initialQuestionType);
    setQuestionType(initialQuestionTypeObject.caption);
  }, [question]);

  const handleTypeChange = async (e) => {
    console.log(e);
    const selectedType = e.target.value;
    setQuestionType(selectedType);

    const selectedTypeObject = queTypes.find((item) => item.name === selectedType);
    if (selectedTypeObject) {
      console.log(selectedTypeObject.type);
      await changePollTypeFx(id, question.id, selectedTypeObject.type);
    }
  };

  return (
    <TypeSelect value={questionType} onChange={(e) => handleTypeChange(e)}>
      {queTypes.map((item) => (
        <MenuItem key={item.name} value={item.caption}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.caption} />
        </MenuItem>
      ))}
    </TypeSelect>
  );
};

export default QueTypeSelect;
