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
import usePollData from '@/hooks/usePollData';
import useTabs from '@/hooks/useTabs';

const PoleMainSettingsPage = () => {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const { pollStatus } = usePollData(id);
  const [tabValue, handleTabChange] = useTabs();
  const [poleData, setPoleData] = useState();
  const [pendingChanges, setPendingChanges] = useState({});
  const [timeoutHandlers, setTimeoutHandlers] = useState({});
  const [currentDate, setCurrentDate] = useState('');

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
    const currentISODate = new Date().toISOString().slice(0, 16);
    setCurrentDate(currentISODate);
  }, [isNewPole]);

  const handleFieldChange = (fieldName, value) => {
    setPendingChanges((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    clearTimeout(timeoutHandlers[fieldName]);

    const handler = setTimeout(async () => {
      await changePoleData(fieldName, value, id, setPoleData, showAlert, fetchPoleData);
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

  const handleImageDelete = () => deleteImageFx({ id });
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f9fafb' }}>
      <MainSettingsContentWrapper>
        <PoleInfoContainer>
          <PoleImageUpload
            image={poleData?.image}
            onFileSelect={(e) => handleFieldChange('image', e)}
            handleDelete={handleImageDelete}
            disabled={pollStatus}
          />
          <InvisibleLabeledField
            label="Название теста"
            placeholder="Введите название"
            value={
              pendingChanges['name'] !== undefined ? pendingChanges['name'] : poleData?.name || ''
            }
            handleChange={(e) => handleFieldChange('name', e)}
            disabled={pollStatus}
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
            disabled={pollStatus}
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
            <InvisibleLabeledField
              label="Время начала"
              placeholder="Введите время начала опроса"
              type="datetime-local"
              min={currentDate}
              value={
                pendingChanges['start_time'] !== undefined
                  ? pendingChanges['start_time']
                  : poleData?.poll_setts.start_time || ''
              }
              handleChange={(e) => handleFieldChange('start_time', e)}
              disabled={pollStatus}
            />
            <InvisibleLabeledField
              label="Время конца"
              placeholder="Введите время конца опроса"
              type="datetime-local"
              min={currentDate}
              max="9999-12-01T00:00"
              value={
                pendingChanges['end_time'] !== undefined
                  ? pendingChanges['end_time']
                  : poleData?.poll_setts.end_time || ''
              }
              handleChange={(e) => handleFieldChange('end_time', e)}
              disabled={pollStatus}
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
