import React, { useEffect, useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { TypeSelect } from './styled';
import { useParams } from 'react-router-dom';
import usePollType from '@/hooks/usePollType';
import { changePollTypeFx } from './models/change-poll-type';
import { RadioButtonChecked, CheckBox, ShortText } from '@mui/icons-material';

const QueTypeSelect = ({ question }) => {
  const { id } = useParams();
  const { pollType, isMultiple } = usePollType(id);
  const [questionType, setQuestionType] = useState('Один ответ');

  export const queTypes = [
    {
      caption: 'Один ответ',
      name: 'single',
      icon: <RadioButtonChecked fontSize="small" />,
      type: { has_multiple_choices: 0 },
    },
    {
      caption: 'Несколько ответов',
      name: 'multiple',
      icon: <CheckBox fontSize="small" />,
      type: { has_multiple_choices: 1 },
    },
    {
      caption: 'Развернутый ответ',
      name: 'free',
      icon: <ShortText fontSize="small" />,
      type: { is_free: 1 },
    },
  ];

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
