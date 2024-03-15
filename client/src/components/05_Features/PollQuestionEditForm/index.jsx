import React, { useState, useEffect } from 'react';
import { Divider, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import PoleImageUpload from '@/components/06_Entities/PollImageUpload';
import InvisibleLabeledField from '@/shared/InvisibleLabeledField';
import {
  addOptionRequest,
  changeOptionOrderRequest,
  changeOptionRequest,
  deleteOptionRequest,
  getAllOptionsRequest,
  handleChangeAnswerRequest,
  handleChangeQuestionInfoRequest,
} from './api/apiRequests';
import { useParams } from 'react-router-dom';
import { DeleteOutline, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePollType from '@/hooks/usePollType';

const PollQuestionEditForm = ({ question }) => {
  const { id } = useParams();
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const { pollType } = usePollType(id);

  useEffect(() => {
    const correctOption = question.answer_options.find((option) => option.is_correct);
    setSelectedOption(correctOption ? correctOption.id : '');
  }, [question]);

  const handleOptionSelect = async (e, q_id) => {
    const value = e.target.value;
    await handleChangeAnswerRequest(id, q_id, value);
    setSelectedOption(value);
  };

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
    await handleChangeQuestionInfoRequest(fieldName, value, id, q_id);
  };

  const handleOptionChange = async (fieldName, value, opt_id, q_id) => {
    await changeOptionRequest(id, q_id, opt_id, fieldName, value);
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === opt_id ? { ...option, [fieldName]: value } : option
      )
    );
  };

  const handleDeleteOption = async (opt_id, q_id) => {
    await deleteOptionRequest(id, q_id, opt_id);
    fetchOptions();
  };

  const handleAddOption = async () => {
    await addOptionRequest(id, question.id).then(() => fetchOptions());
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setOptions(items);
    await changeOptionOrderRequest(id, question.id, items);
  };

  return (
    <div>
      <PoleImageUpload onFileSelect={(e) => handleFieldChange('image', e)} />
      <InvisibleLabeledField
        label="Заголовок вопроса"
        placeholder="Введите заголовок"
        value={editedQuestion.name || ''}
        handleChange={(e) => handleFieldChange('name', e, question.id)}
      />
      <Divider style={{ margin: '20px 0' }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="options">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {options.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        alignItems: 'center',
                        border: '1px solid black',
                        borderRadius: '6px',
                        padding: '10px',
                        marginBottom: '15px',
                      }}
                    >
                      <InvisibleLabeledField
                        placeholder="Начните вводить"
                        value={item.name || ''}
                        handleChange={(e) => handleOptionChange('name', e, item.id, question.id)}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}>
                        {pollType === 'Викторина' && (
                          <RadioGroup
                            value={selectedOption}
                            onChange={(e) => handleOptionSelect(e, question.id)}
                            sx={{ width: '24px', height: '24px' }}
                          >
                            <FormControlLabel
                              value={item.id.toString()}
                              sx={{ width: '24px', height: '24px', margin: 0 }}
                              control={<Radio sx={{ width: '24px', height: '24px' }} />}
                            />
                          </RadioGroup>
                        )}
                        <DeleteOutline
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleDeleteOption(item.id, question.id)}
                        />
                        <DragIndicator sx={{ cursor: 'grab' }} />
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box sx={{ display: 'grid', justifyContent: 'center', rowGap: '10px' }}>
        {options.length === 0 && <Typography>Вы не создали ни одного варианта ответа</Typography>}
        <button style={{ maxWidth: '100%' }} onClick={() => handleAddOption()}>
          Добавить вариант ответа
        </button>
      </Box>
    </div>
  );
};

export default React.memo(PollQuestionEditForm);
