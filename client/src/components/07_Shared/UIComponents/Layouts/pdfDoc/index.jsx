import React from 'react';
import { Document, Page, Text } from '@react-pdf/renderer';

const PDFDoc = ({ items }) => {
  return (
    <Document>
      <Page size="A4">
        {items.map((item, index) => (
          <Text key={index}>
            {Object.entries(item)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </Text>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDoc;
