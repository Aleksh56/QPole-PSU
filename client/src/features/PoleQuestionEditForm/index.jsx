import React, { useState, useEffect } from 'react';
import { Divider, Typography, Box } from '@mui/material';
import PoleImageUpload from '@/entities/PoleImageUpload';
import InvisibleLabeledField from '@/shared/InvisibleLabeledField';
import {
  addOptionRequest,
  getAllOptionsRequest,
  handleChangeQuestionInfoRequest,
} from './api/apiRequests';
import { useParams } from 'react-router-dom';

const PoleQuestionEditForm = ({ question }) => {
  const { id } = useParams();
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [options, setOptions] = useState([]);

  const fetchOptions = async () => {
    await getAllOptionsRequest(id, question.id).then((res) => setOptions(res.data));
  };

  useEffect(() => {
    fetchOptions();
  }, [id, question.id]);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleFieldChange = async (fieldName, value, q_id) => {
    const updatedQuestion = { ...editedQuestion, [fieldName]: value };
    setEditedQuestion(updatedQuestion);
    await handleChangeQuestionInfoRequest(fieldName, value, id, q_id).then((res) =>
      console.log(res)
    );
  };

  const handleAddOption = async () => {
    await addOptionRequest(id, question.id).then(() => fetchOptions());
  };

  return (
    <div>
      <PoleImageUpload onFileSelect={(e) => handleFieldChange('image', e)} />
      <InvisibleLabeledField
        label="Заголовок вопроса"
        placeholder="Введите заголовок"
        value={editedQuestion.name !== null ? question.name : ''}
        handleChange={(e) => handleFieldChange('name', e, question.id)}
      />
      <Divider style={{ margin: '20px 0' }} />
      {options.length === 0 && (
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            justifyContent: 'center',
            padding: '50px 0',
          }}
        >
          <Typography sx={{ marginBottom: '15px' }}>Вы не добавили ни одного варианта</Typography>
          <button onClick={() => handleAddOption()}>Добавить вариант ответа</button>
        </Box>
      )}
      {options.length > 0 &&
        options.map((item) => (
          <Box
            sx={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              alignItems: 'center',
            }}
          >
            <InvisibleLabeledField
              placeholder="Начните вводить"
              value={''}
              handleChange={(e) => handleFieldChange('name', e)}
            />
            <p>X</p>
            <p>M</p>
          </Box>
        ))}
      <button onClick={() => handleAddOption()}>Добавить вариант ответа</button>
    </div>
  );
};

export default React.memo(PoleQuestionEditForm);
