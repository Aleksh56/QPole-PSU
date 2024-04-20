import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import QRCode from 'qrcode.react';
import FileSaver from 'file-saver';
import { useParams } from 'react-router';
import { Box } from '@mui/system';

const FrmShareQR = () => {
  const { id } = useParams();
  const [surveyLink, setSurveyLink] = useState('');

  useEffect(() => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const link = `${protocol}//${host}/conduct-poll/${id}`;
    setSurveyLink(link);
  }, [id]);

  const downloadQR = () => {
    const canvas = document.getElementById('qrCodeEl');
    canvas.toBlob(function (blob) {
      FileSaver.saveAs(blob, 'survey-qr-code.png');
    });
  };

  return (
    <Box>
      <QRCode id="qrCodeEl" value={surveyLink} size={256} level={'H'} includeMargin={true} />
      <Button onClick={downloadQR}>Скачать QR-код</Button>
    </Box>
  );
};

export default FrmShareQR;
