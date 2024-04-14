import React, { useEffect, useState } from 'react';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { TypeSelect } from './styled';
import { useParams } from 'react-router-dom';
import usePollType from '@/hooks/usePollType';
import { changePollTypeFx } from './models/change-poll-type';
import { RadioButtonChecked, CheckBox, ShortText } from '@mui/icons-material';

const QueTypeSelect = ({ question, questionType, setQuestionType, setQuestion }) => {
  const { id } = useParams();
  const { pollType, isMultiple } = usePollType(id);

  const queTypes = [
    {
      caption: 'Один ответ',
      name: 'single',
      icon: <RadioButtonChecked fontSize="small" />,
      type: { has_multiple_choices: false, is_free: false },
    },
    {
      caption: 'Несколько ответов',
      name: 'multiple',
      icon: <CheckBox fontSize="small" />,
      type: { has_multiple_choices: true, is_free: false },
    },
    {
      caption: 'Развернутый ответ',
      name: 'free',
      icon: <ShortText fontSize="small" />,
      type: { is_free: true, has_multiple_choices: false },
    },
  ];

  useEffect(() => {
    console.log(question);
    let initialQuestionType = 'single';
    if (question.is_free) {
      initialQuestionType = 'free';
    } else if (question.has_multiple_choices) {
      initialQuestionType = 'multiple';
    }

    const initialQuestionTypeObject = queTypes.find((item) => item.name === initialQuestionType);
    console.log(initialQuestionType);

    // Устанавливаем отображаемую подпись для типа вопроса
    setQuestionType(initialQuestionTypeObject.caption);
    console.log(questionType);
  }, [question]);

  const handleTypeChange = async (e) => {
    console.log(e);
    const selectedType = e.target.value;
    setQuestionType(selectedType);

    const selectedTypeObject = queTypes.find((item) => item.caption === selectedType);
    if (selectedTypeObject) {
      console.log(selectedTypeObject.type);
      await changePollTypeFx(id, question.id, selectedTypeObject.type).then((res) =>
        setQuestion(res.data)
      );
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
