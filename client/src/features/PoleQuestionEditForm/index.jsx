import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const PoleQuestionEditForm = ({ question, onSaveQuestion }) => {
  const [editedQuestion, setEditedQuestion] = useState(question);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleSave = () => {
    onSaveQuestion(editedQuestion);
  };

  return (
    <div>
      <TextField
        label="Вопрос"
        variant="outlined"
        fullWidth
        value={editedQuestion.title}
        onChange={(e) => setEditedQuestion({ ...editedQuestion, title: e.target.value })}
        style={{ marginBottom: '10px' }}
      />
      <Button onClick={handleSave} variant="contained">
        Сохранить
      </Button>
    </div>
  );
};

export default React.memo(PoleQuestionEditForm);
