import { Button } from '@mui/material';
import { Box } from '@mui/system';
import FileSaver from 'file-saver';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import usePollData from '@/hooks/usePollData';

const FrmShareQR = () => {
  const { id } = useParams();
  const { pollType } = usePollData(id);
  const { t } = useTranslation();
  const [surveyLink, setSurveyLink] = useState('');

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const link = `${protocol}//${host}/${pollType === 'Быстрый' ? 'quick-conduct-poll' : 'conduct-poll'}/${id}`;

    setSurveyLink(link);
  }, [id, pollType]);

  const downloadQR = () => {
    const canvas = document.getElementById('qrCodeEl');
    canvas.toBlob(function (blob) {
      FileSaver.saveAs(blob, 'survey-qr-code.png');
    });
  };

  return (
    <Box>
      <QRCode id="qrCodeEl" value={surveyLink} size={256} level={'H'} includeMargin={true} />
      <Button onClick={downloadQR}>{t('button.downloadQR')}</Button>
    </Box>
  );
};

export default FrmShareQR;
