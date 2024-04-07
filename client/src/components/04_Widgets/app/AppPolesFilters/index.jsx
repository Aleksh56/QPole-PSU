import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { StyledButton, StyledStack, StyledStackWrapper } from './styled';
import { filterPollsRequest } from './api/apiRequests';
import FilterSelect from '@/components/07_Shared/UIComponents/Fields/filterSelect';
import { appFilterOptions } from '@/data/fields';

const AppPolesFilters = ({ handleCreateModalOpen = () => {}, setPollData = () => {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    poll_type: 'Все типы',
    is_closed: 'Все статусы',
    group: 'Для всех',
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const adjustedValue = value === 'Все типы' || value === 'Все статусы' ? '' : value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    applyFilters(name, adjustedValue);
  };

  const applyFilters = async (field, value) => {
    await filterPollsRequest(field, value, setPollData);
  };

  return (
    <StyledStackWrapper>
      <StyledStack>
        <TextField
          label="Поиск"
          name="name"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Введите название"
          onChange={handleFilterChange}
        />
        {appFilterOptions.map((filter) => (
          <FilterSelect
            key={filter.name}
            label={filter.label}
            name={filter.name}
            value={filters[filter.name]}
            options={filter.options}
            onChange={handleFilterChange}
          />
        ))}
        <StyledButton variant="contained" onClick={() => handleCreateModalOpen(true)}>
          Создать новый опрос
        </StyledButton>
      </StyledStack>
    </StyledStackWrapper>
  );
};

export default AppPolesFilters;
