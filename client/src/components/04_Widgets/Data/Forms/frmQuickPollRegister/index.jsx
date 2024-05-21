import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ContentWrapper, HeaderWrapper, RegTitle } from './styled';

import PrimaryButton from '@/components/07_Shared/UIComponents/Buttons/primaryBtn';

const FrmQuickPollRegister = ({ isCollapsed, pollData, handleStart }) => {
  const [isStudent, setIsStudent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    groupNumber: '',
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { fullName, studentId, groupNumber } = formData;
    const dataToSubmit = [];

    dataToSubmit.push({
      auth_field_name: 'ФИО',
      answer: fullName,
    });

    if (isStudent) {
      dataToSubmit.push({
        auth_field_name: 'Номер студенческого билета',
        answer: studentId,
      });
      dataToSubmit.push({
        auth_field_name: 'Группа',
        answer: groupNumber,
      });
    }

    handleStart(dataToSubmit);
  };

  const validateForm = () => {
    if (isStudent) {
      setIsButtonDisabled(!formData.fullName || !formData.studentId || !formData.groupNumber);
    } else {
      setIsButtonDisabled(!formData.fullName);
    }
  };

  useEffect(() => {
    validateForm();
  }, [formData, isStudent]);

  return (
    <HeaderWrapper>
      <RegTitle>Регистрация на опрос</RegTitle>
      <ContentWrapper>
        <TextField
          label="ФИО"
          variant="outlined"
          fullWidth
          margin="normal"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isStudent}
              onChange={(e) => {
                setIsStudent(e.target.checked);
                validateForm();
              }}
            />
          }
          label="Я студент"
        />
        <AnimatePresence initial={false}>
          {isStudent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ overflow: 'hidden' }}
            >
              <TextField
                label="Номер студенческого билета"
                variant="outlined"
                fullWidth
                margin="normal"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              />
              <TextField
                label="Номер группы"
                variant="outlined"
                fullWidth
                margin="normal"
                name="groupNumber"
                value={formData.groupNumber}
                onChange={handleChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
      {isCollapsed && pollData?.poll_setts?.completion_time !== null && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <PrimaryButton caption="Начать" handleClick={handleSubmit} disabled={isButtonDisabled} />
        </Box>
      )}
    </HeaderWrapper>
  );
};

export default FrmQuickPollRegister;
