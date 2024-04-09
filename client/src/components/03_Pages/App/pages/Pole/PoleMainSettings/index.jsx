import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CustomSwitch from '@/components/07_Shared/UIComponents/Buttons/switch';
import { v4 } from 'uuid';
import InvisibleLabeledField from '@/components/07_Shared/UIComponents/Fields/invisibleLabeledField';
import useTabs from '@/hooks/useTabs';
import PoleImageUpload from '@/components/06_Entities/PollImageUpload';
import PollMainSettingsTabs from '@/components/06_Entities/PollMainSettingsTabs';
import { MainSettingsContentWrapper, PoleInfoContainer, PoleInfoSwitchContainer } from './styled';
import { poleTabsButtonsData } from './data/PoleTabsButtonsData';
import { StyledFormControlLabel } from '@/constants/styles';
import { useLocation, useParams } from 'react-router-dom';
import { changePoleData, getInfoAboutPole } from './api/apiRequests';
import { deleteImageFx } from './model/image-delete';
import { useAlert } from '@/app/context/AlertProvider';

const PoleMainSettingsPage = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const [tabValue, handleTabChange] = useTabs();
  const [poleData, setPoleData] = useState();
  const [pendingChanges, setPendingChanges] = useState({});
  const [timeoutHandlers, setTimeoutHandlers] = useState({});

  const location = useLocation();
  const isNewPole = location.state?.isNewPole;

  const fetchPoleData = async () => {
    const responseData = await getInfoAboutPole(id);
    setPoleData(responseData.data);
  };

  useEffect(() => {
    if (!isNewPole) {
      fetchPoleData();
    }
  }, [isNewPole]);

  const handleFieldChange = (fieldName, value) => {
    setPendingChanges((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    if (timeoutHandlers[fieldName]) {
      clearTimeout(timeoutHandlers[fieldName]);
    }

    const handler = setTimeout(async () => {
      await changePoleData(fieldName, value, id, fetchPoleData, showAlert);
      setPendingChanges((prevState) => ({
        ...prevState,
        [fieldName]: undefined,
      }));
    }, 1500);

    setTimeoutHandlers((prevState) => ({
      ...prevState,
      [fieldName]: handler,
    }));
  };

  const handleImageDelete = () => {
    deleteImageFx({ id });
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f9fafb' }}>
      <MainSettingsContentWrapper>
        <PoleInfoContainer>
          <PoleImageUpload
            image={poleData?.image}
            onFileSelect={(e) => handleFieldChange('image', e)}
            handleDelete={handleImageDelete}
          />
          <InvisibleLabeledField
            label="Название теста"
            placeholder="Введите название"
            value={
              pendingChanges['name'] !== undefined ? pendingChanges['name'] : poleData?.name || ''
            }
            handleChange={(e) => handleFieldChange('name', e)}
          />
          <InvisibleLabeledField
            label="Описание"
            placeholder="Введите описание"
            value={
              pendingChanges['description'] !== undefined
                ? pendingChanges['description']
                : poleData?.description || ''
            }
            handleChange={(e) => handleFieldChange('description', e)}
          />
        </PoleInfoContainer>
        <Box sx={{ width: '35%' }}>
          <PollMainSettingsTabs
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            tabsData={poleTabsButtonsData}
            pollData={poleData}
          />
        </Box>
      </MainSettingsContentWrapper>
    </Box>
  );
};

export default PoleMainSettingsPage;
