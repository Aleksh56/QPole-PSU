import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const PollFilters = () => {
  const [state, setState] = useState({
    filterOne: false,
    filterTwo: false,
    filterThree: false,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const matches = useMediaQuery('(max-width:1000px)');

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const toggleFilters = () => setIsFiltersOpen(!isFiltersOpen);

  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        position: 'sticky',
        top: '20px',
        zIndex: 1000,
        backgroundColor: '#fff',
        marginBottom: '20px',
      }}
    >
      {matches ? (
        <Box>
          <Button
            onClick={toggleFilters}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
            }}
          >
            <FilterListIcon sx={{ mr: 1 }} /> Фильтры
          </Button>
          {isFiltersOpen && (
            <Box sx={{ p: 2 }}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  {Object.keys(state).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={<Checkbox checked={state[key]} onChange={handleChange} name={key} />}
                      label={`Фильтр ${key.slice(-1)}`}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
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
                  <Checkbox
                    checked={state.filterThree}
                    onChange={handleChange}
                    name="filterThree"
                  />
                }
                label="Фильтр 3"
              />
            </FormGroup>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default PollFilters;
