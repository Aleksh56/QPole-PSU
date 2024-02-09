import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { StyledButton, StyledStack, StyledStackWrapper } from './styled';

const AppPolesFilters = ({ handleCreateModalOpen }) => {
  const types = ['Все типы', 'Type 2', 'Type 3'];
  const statuses = ['Все статусы', 'Status 2', 'Status 3'];
  const groups = ['Для всех', 'Group 2', 'Group 3'];

  return (
    <StyledStackWrapper>
      <StyledStack>
        <TextField
          label="Поиск"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Введите название"
        />

        <TextField
          select
          label="Тип"
          variant="outlined"
          defaultValue="Все типы"
          style={{ minWidth: '120px' }}
        >
          {types.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Статус"
          variant="outlined"
          defaultValue="Все статусы"
          style={{ minWidth: '120px' }}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Группа"
          variant="outlined"
          defaultValue="Для всех"
          style={{ minWidth: '120px' }}
        >
          {groups.map((group) => (
            <MenuItem key={group} value={group}>
              {group}
            </MenuItem>
          ))}
        </TextField>

        <StyledButton
          variant="contained"
          onClick={() => handleCreateModalOpen()}
        >
          Создать новый опрос
        </StyledButton>
      </StyledStack>
    </StyledStackWrapper>
  );
};

export default AppPolesFilters;
