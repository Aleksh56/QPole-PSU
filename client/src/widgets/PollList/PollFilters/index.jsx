import React from 'react';
import { Box, Typography, FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const PollFilters = () => {
  const [state, setState] = React.useState({
    filterOne: false,
    filterTwo: false,
    filterThree: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        maxHeight: 'max-content',
      }}
    >
      <Typography variant="h6" sx={{ my: 2 }}>
        <FilterListIcon /> Фильтры
      </Typography>
      <FormControl component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={state.filterOne} onChange={handleChange} name="filterOne" />
            }
            label="Фильтр 1"
          />
          <FormControlLabel
            control={
              <Checkbox checked={state.filterTwo} onChange={handleChange} name="filterTwo" />
            }
            label="Фильтр 2"
          />
          <FormControlLabel
            control={
              <Checkbox checked={state.filterThree} onChange={handleChange} name="filterThree" />
            }
            label="Фильтр 3"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default PollFilters;
