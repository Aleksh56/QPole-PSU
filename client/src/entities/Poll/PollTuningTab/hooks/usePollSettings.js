import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pathcPollSettingsFx } from '../model/patch-poll';

const usePollSettings = (initialSettings) => {
  const { id } = useParams();
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSwitchChange = useCallback(
    (s_field) => async (event) => {
      const checked = event.target.checked;
      await pathcPollSettingsFx({ id, checked, s_field });
      setSettings((prev) => ({ ...prev, [s_field]: checked }));
    },
    []
  );

  return [settings, handleSwitchChange];
};

export default usePollSettings;
