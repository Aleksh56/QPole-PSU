import React, { useEffect } from 'react';
import { StyledProfileContainer, StyledProfileFieldsBox } from '@/constants/styles';
import { FormControl, MenuItem, Select, Typography } from '@mui/material';
import useFormInput from '@/hooks/useFormInput';

const ProfileTimezone = ({ caption = '', selectCaption = '', options = [] }) => {
  const selectedOption = useFormInput('');

  useEffect(() => {
    const getAllTimeZones = async () => {
      await fetch('http://worldtimeapi.org/api/timezone').then((res) => {
        const data = res;
        console.log(data);
      });
    };
    getAllTimeZones();
  }, []);

  return (
    <StyledProfileContainer>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          marginTop: '48px',
          fontSize: '18px',
          lineHeight: '24px',
          '@media (max-width: 768px)': {
            marginTop: '20px',
          },
        }}
      >
        {caption}
      </Typography>
      <StyledProfileFieldsBox>
        <FormControl fullWidth>
          <Typography id="demo-simple-select-label" sx={{ marginBottom: '6px', fontSize: '14px' }}>
            {selectCaption}
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption.value}
            onChange={selectedOption.onChange}
            sx={{ padding: '6px', '& .MuiSelect-select': { padding: 0 } }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledProfileFieldsBox>
    </StyledProfileContainer>
  );
};

export default ProfileTimezone;
