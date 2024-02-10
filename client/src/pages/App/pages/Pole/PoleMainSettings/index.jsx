import React from 'react';
import { Box, Divider } from '@mui/material';
import CustomSwitch from '@/shared/Switch';
import { v4 } from 'uuid';
import InvisibleLabeledField from '@/shared/InvisibleLabeledField';
import useTabs from '@/hooks/useTabs';
import PoleImageUpload from '@/entities/PoleImageUpload';
import PoleMainSettingsTabs from '@/entities/PoleMainSettingsTabs';
import {
  MainSettingsContentWrapper,
  PoleInfoContainer,
  PoleInfoSwitchContainer,
  StyledFormControlLabel,
} from './styled';
import { poleSwitchData } from './data/PoleSwitchData';
import { poleTabsButtonsData } from './data/PoleTabsButtonsData';

const PoleMainSettingsPage = () => {
  const [tabValue, handleTabChange] = useTabs();

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f9fafb' }}>
      <MainSettingsContentWrapper>
        <PoleInfoContainer>
          <PoleImageUpload />
          <InvisibleLabeledField
            label="Название теста"
            placeholder="Введите название"
          />
          <InvisibleLabeledField
            label="Описание"
            placeholder="Введите описание"
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
