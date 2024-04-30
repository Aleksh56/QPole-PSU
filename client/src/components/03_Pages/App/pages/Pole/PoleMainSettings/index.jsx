import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { changePoleData, getInfoAboutPole } from './api/apiRequests';
import { poleTabsButtonsData } from './data/PoleTabsButtonsData';
import { deleteImageFx } from './model/image-delete';
import { MainSettingsContentWrapper, PoleInfoContainer } from './styled';

import { useAlert } from '@/app/context/AlertProvider';
import PoleImageUpload from '@/components/06_Entities/PollImageUpload';
import PollMainSettingsTabs from '@/components/06_Entities/PollMainSettingsTabs';
import InvisibleLabeledField from '@/components/07_Shared/UIComponents/Fields/invisibleLabeledField';
import useTabs from '@/hooks/useTabs';

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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
            <InvisibleLabeledField
              label="Время начала"
              placeholder="Введите время начала опроса"
              type="datetime-local"
              min="0001-01-01T00:00"
              max="9999-12-01T00:00"
              value={
                pendingChanges['start_time'] !== undefined
                  ? pendingChanges['start_time']
                  : poleData?.poll_setts.start_time || ''
              }
              handleChange={(e) => handleFieldChange('start_time', e)}
            />
            <InvisibleLabeledField
              label="Время конца"
              placeholder="Введите время конца опроса"
              type="datetime-local"
              min="2024-01-01T00:00"
              max="9999-12-01T00:00"
              value={
                pendingChanges['start_time'] !== undefined
                  ? pendingChanges['start_time']
                  : poleData?.poll_setts.end_time || ''
              }
              handleChange={(e) => handleFieldChange('end_time', e)}
            />
          </Box>
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
