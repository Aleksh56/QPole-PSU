import { PDFDownloadLink } from '@react-pdf/renderer';

const PdfExporter = ({ document, fileName }) => (
  <PDFDownloadLink
    document={document}
    fileName={fileName}
    style={{ textDecoration: 'none', padding: '10px', color: '#4a4a4a' }}
  >
    {({ blob, url, loading, error }) => (loading ? 'Подготовка документа...' : 'Выгрузить в PDF')}
  </PDFDownloadLink>
);

export default PdfExporter;
