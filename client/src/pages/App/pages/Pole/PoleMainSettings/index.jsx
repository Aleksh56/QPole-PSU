import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/system';

const Input = styled('input')({
  display: 'none',
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const PoleMainSettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const designSettings = useMemo(
    () => [
      { label: 'Основной цвет', type: 'color' },
      {
        label: 'Тема оформления',
        type: 'select',
        options: ['Светлая', 'Тёмная'],
      },
      { label: 'Цвет кнопок', type: 'color' },
      { label: 'Цвет текста кнопок', type: 'color' },
    ],
    []
  );

  const switchSettings = useMemo(
    () => [
      { label: 'Переключатель 1', checked: false },
      { label: 'Переключатель 2', checked: true },
    ],
    []
  );

  return (
    <Box sx={{ display: 'flex', p: 2, backgroundColor: '#f9fafb' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1200px',
          margin: '24px auto',
        }}
      >
        <Box
          sx={{
            width: '65%',
            backgroundColor: '#fff',
            padding: '40px',
            boxShadow: '0 2px 4px rgba(0,0,0,.05), 0 8px 20px rgba(0,0,0,.1)',
            borderRadius: '5px',
          }}
        >
          <Button
            component="label"
            fullWidth
            sx={{
              border: '1px dashed #C9C9C9',
              minHeight: '200px',
              lineHeight: '145px',
              cursor: 'pointer',
              columnGap: '15px',
              backgroundColor: '#F7F7F7',
              marginBottom: '20px',
            }}
          >
            <PhotoCamera />
            Выбор изображения
            <Input accept="image/*" type="file" hidden />
          </Button>
          {/* <CustomTextField label="Название теста" />
          <CustomTextField label="Описание теста" multiline rows={4} /> */}

          <Divider sx={{ my: 2 }} />
          {switchSettings.map((setting, index) => (
            <FormControlLabel
              key={index}
              control={<Switch defaultChecked={setting.checked} />}
              label={setting.label}
            />
          ))}
        </Box>
        <Box sx={{ width: '35%', ml: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="basic tabs example"
              >
                <Tab label="Дизайн" />
                <Tab label="Тонкие настройки" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              {/* Контент для вкладки "Дизайн" */}
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Основной цвет"
                  variant="outlined"
                  type="color"
                />
                <TextField
                  fullWidth
                  label="Цвет кнопок"
                  variant="outlined"
                  type="color"
                />
                <TextField
                  fullWidth
                  label="Цвет текста кнопок"
                  variant="outlined"
                  type="color"
                />
                {/* Добавьте больше элементов управления при необходимости */}
              </Stack>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {/* Контент для вкладки "Тонкие настройки" */}
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Название теста"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Описание теста"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                {/* Добавьте переключатели и другие элементы управления при необходимости */}
              </Stack>
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PoleMainSettingsPage;
