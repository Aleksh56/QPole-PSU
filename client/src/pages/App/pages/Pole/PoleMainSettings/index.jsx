import React, { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import CustomSwitch from '@/shared/Switch';
import { v4 } from 'uuid';
import InvisibleLabeledField from '@/shared/InvisibleLabeledField';
import useTabs from '@/hooks/useTabs';
import PoleImageUpload from '@/entities/PoleImageUpload';
import PoleMainSettingsTabs from '@/entities/PoleMainSettingsTabs';
import { MainSettingsContentWrapper, PoleInfoContainer, PoleInfoSwitchContainer } from './styled';
import { poleSwitchData } from './data/PoleSwitchData';
import { poleTabsButtonsData } from './data/PoleTabsButtonsData';
import { StyledFormControlLabel } from '@/constants/styles';
import { useLocation, useParams } from 'react-router-dom';
import { changePoleData, getInfoAboutPole } from './api/apiRequests';

const PoleMainSettingsPage = () => {
  const { id } = useParams();
  const [tabValue, handleTabChange] = useTabs();
  const [poleData, setPoleData] = useState();

  const location = useLocation();
  const isNewPole = location.state?.isNewPole;

  useEffect(() => {
    const fetchPoleData = async () => {
      const responseData = await getInfoAboutPole(id);
      setPoleData(responseData.data);
    };
    if (!isNewPole) {
      fetchPoleData();
    }
  }, [isNewPole]);

  const handleFieldChange = async (fieldName, value) => {
    const response = changePoleData(fieldName, value, id);
    console.log('Response - ', response.data);
    setPoleData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f9fafb' }}>
      <MainSettingsContentWrapper>
        <PoleInfoContainer>
          <PoleImageUpload
            image={poleData?.image}
            onFileSelect={(e) => handleFieldChange('image', e)}
          />
          <InvisibleLabeledField
            label="Название теста"
            placeholder="Введите название"
            value={poleData?.name || ''}
            handleChange={(e) => handleFieldChange('name', e)}
          />
          <InvisibleLabeledField
            label="Описание"
            placeholder="Введите описание"
            value={poleData?.description || ''}
            handleChange={(e) => handleFieldChange('description', e)}
          />
          <Divider sx={{ my: 2 }} />
          <PoleInfoSwitchContainer>
            {poleSwitchData.map((setting) => (
              <StyledFormControlLabel
                key={v4()}
                control={<CustomSwitch focusVisibleClassName={setting.label} />}
                label={setting.label}
              />
            ))}
          </PoleInfoSwitchContainer>
        </PoleInfoContainer>
        <Box sx={{ width: '35%' }}>
          <PoleMainSettingsTabs
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            tabsData={poleTabsButtonsData}
          />
        </Box>
      </MainSettingsContentWrapper>
    </Box>
  );
};

export default PoleMainSettingsPage;
