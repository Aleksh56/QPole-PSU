import React, { useState, useEffect } from 'react';
import { Divider, Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import PoleImageUpload from '@/components/06_Entities/PollImageUpload';
import InvisibleLabeledField from '@/components/07_Shared/UIComponents/Fields/invisibleLabeledField';
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
import usePollType from '@/hooks/usePollType';
import { deleteImageFx } from './model/delete-image';
import { QueSettingsWrapper } from './styled';
import QueTypeSelect from '@/components/06_Entities/QueTypeSelect';
import DraggableList from '@/components/07_Shared/UIComponents/Layouts/draggableList';

const PollQuestionEditForm = ({ question, setSelectedQuestion }) => {
  const { id } = useParams();
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionType, setQuestionType] = useState('Один ответ');
  const [isFreeResponse, setIsFreeResponse] = useState(false);
  const { pollType } = usePollType(id);

  useEffect(() => {
    const correctOption = question.answer_options.find((option) => option.is_correct);
    setSelectedOption(correctOption ? correctOption.id : '');
    setEditedQuestion(question);
  }, [question]);

  useEffect(() => {
    const hasFreeResponse = options.some((option) => option.is_free_response);
    setIsFreeResponse(hasFreeResponse);
  }, [options]);

  const handleOptionSelect = async (e, q_id) => {
    const value = e.target.value;
    await handleChangeAnswerRequest(id, q_id, value);
    setSelectedOption(value);
  };

  const fetchOptions = async () => {
    if (question.is_free) {
      setOptions([]);
    } else {
      await getAllOptionsRequest(id, question.id).then((res) => {
        setOptions(res.data);
        const hasFreeResponse = res.data.some((option) => option.is_free_response);
        setIsFreeResponse(hasFreeResponse);
      });
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [id, question]);

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

  const handleAddOption = async (param) => {
    await addOptionRequest(id, question.id, param).then(() => fetchOptions());
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    const newItems = Array.from(options);

    if (
      !destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      return;
    }
    const isLastFreeResponse = newItems[newItems.length - 1].is_free_response;

    if (destination.index === newItems.length - 1 && isLastFreeResponse) {
      return;
    }

    const [reorderedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, reorderedItem);
    setOptions(newItems);
    await changeOptionOrderRequest(id, question.id, newItems);
  };

  const handleImageDelete = (q_id) => {
    deleteImageFx({ id, q_id });
  };

  return (
    <Box>
      <PoleImageUpload
        image={question?.image}
        onFileSelect={(e) => handleFieldChange('image', e, question.id)}
        handleDelete={() => handleImageDelete(question.id)}
      />
      <QueSettingsWrapper>
        <InvisibleLabeledField
          placeholder="Введите заголовок"
          value={editedQuestion.name || ''}
          handleChange={(e) => handleFieldChange('name', e, question.id)}
        />
        <QueTypeSelect
          question={editedQuestion}
          questionType={questionType}
          setQuestionType={setQuestionType}
          setQuestion={setSelectedQuestion}
        />
      </QueSettingsWrapper>
      <Divider style={{ margin: '30px 0' }} />
      <DraggableList
        items={options}
        onDragEnd={onDragEnd}
        pollType={pollType}
        renderItem={(item) => (
          <>
            <DragIndicator sx={{ cursor: 'grab' }} />
            {pollType === 'Викторина' && (
              <RadioGroup
                value={selectedOption}
                onChange={(e) => handleOptionSelect(e, question.id)}
                sx={{ width: '24px', height: '24px', marginRight: '15px' }}
              >
                <FormControlLabel
                  value={item.id.toString()}
                  sx={{ width: '24px', height: '24px', margin: 0 }}
                  control={<Radio sx={{ width: '24px', height: '24px' }} />}
                />
              </RadioGroup>
            )}
            {item.is_free_response ? (
              <p>Другое</p>
            ) : (
              <InvisibleLabeledField
                placeholder="Начните вводить"
                value={item.name || ''}
                handleChange={(e) => handleOptionChange('name', e, item.id, question.id)}
              />
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}>
              <DeleteOutline
                sx={{ cursor: 'pointer' }}
                onClick={() => handleDeleteOption(item.id, question.id)}
              />
            </Box>
          </>
        )}
      />
      <Box sx={{ display: 'flex', columnGap: '10px' }}>
        {options.length === 0 && !question.is_free && (
          <Typography>Вы не создали ни одного варианта ответа</Typography>
        )}
        {!question.is_free && (
          <>
            <button style={{ maxWidth: '100%' }} onClick={() => handleAddOption()}>
              Добавить ответ
            </button>
            {pollType === 'Опрос' && !isFreeResponse && (
              <>
                <span>или</span>
                <button style={{ maxWidth: '100%' }} onClick={() => handleAddOption('is_free')}>
                  Добавить "Другое"
                </button>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(PollQuestionEditForm);
