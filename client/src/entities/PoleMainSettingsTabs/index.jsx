import CustomTabPanel from '@/shared/TabPanel';
import { Grid,Tab } from '@mui/material';
import React from 'react';
import { StyledTabs, TabsButtonsContainer } from './styled';

const PoleMainSettingsTabs = ({ tabValue, handleTabChange, tabsData }) => {
  return (
    <Grid>
      <TabsButtonsContainer>
        <StyledTabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          {tabsData.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              sx={{ textTransform: 'initial' }}
            />
          ))}
        </StyledTabs>
      </TabsButtonsContainer>
      {tabsData.map((tab, index) => (
        <CustomTabPanel key={tab.label} value={tabValue} index={index}>
          <tab.component />
        </CustomTabPanel>
      ))}
    </Grid>
  );
};

export default PoleMainSettingsTabs;
