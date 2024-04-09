import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';

const PdfExporter = ({ children }) => (
  <PDFDownloadLink
    document={children}
    fileName="poll-results.pdf"
    style={{ textDecoration: 'none', padding: '10px', color: '#4a4a4a' }}
  >
    {({ blob, url, loading, error }) => (loading ? 'Подготовка документа...' : 'Выгрузить в PDF')}
  </PDFDownloadLink>
);

export default PdfExporter;
