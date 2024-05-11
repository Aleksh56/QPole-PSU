import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

import { filterPollsRequest } from './api/apiRequests';
import { MobileFiltersWrapper, StyledButton, StyledStack, StyledStackWrapper } from './styled';

import FilterSelect from '@/components/07_Shared/UIComponents/Fields/filterSelect';
import { appFilterOptions } from '@/data/fields';

const AppPollFilters = ({ handleCreateModalOpen = () => {}, setPollData = () => {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    poll_type: 'Все типы',
    is_closed: 'Все статусы',
    group: 'Для всех',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      <Box
        sx={{
          '@media (min-width: 900px)': {
            display: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 15px',
          }}
        >
          <TuneIcon onClick={() => setShowMobileFilters((prev) => !prev)} />
          <Button onClick={() => handleCreateModalOpen(true)}>Создать опрос</Button>
        </Box>
        <MobileFiltersWrapper show={showMobileFilters}>
          {showMobileFilters && (
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '20px', padding: '15px' }}
            >
              <TextField
                label="Поиск"
                name="name"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
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
            </Box>
          )}
        </MobileFiltersWrapper>
      </Box>
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
          Создать опрос
        </StyledButton>
      </StyledStack>
    </StyledStackWrapper>
  );
};

export default AppPollFilters;
