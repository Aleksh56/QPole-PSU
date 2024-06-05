import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { patchPollSettingsFx } from '@/api/models/Poll/PollSettings/patch-poll-settings';

const usePollSettings = (initialSettings) => {
  const { id } = useParams();
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSwitchChange = useCallback(
    (field) => async (event) => {
      const value = event.target.checked;
      patchPollSettingsFx({ id, value, field });
      setSettings((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return [settings, handleSwitchChange];
};

export default usePollSettings;
