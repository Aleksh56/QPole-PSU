import { Document, Font, Page, StyleSheet, Text } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 14,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

const PollResultsPDF = ({ data, pollData }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const currentISODate = new Date().toISOString().slice(0, 16);
    setCurrentDate(currentISODate);
  }, []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Результаты опроса: {pollData.name}</Text>
        <Text style={styles.subtitle}>
          Результаты экспортированы: {currentDate}
          {'\n'}Тип опроса: {pollData.poll_type.name}
        </Text>
        <Text style={styles.infoText}>
          Автор опроса: {pollData.author.surname} {pollData.author.name}
        </Text>
        <Text style={styles.infoText}>{pollData.description}</Text>
        <Text style={styles.infoText}>Дата начала: -</Text>
        <Text style={styles.infoText}>Дата окончания: -</Text>
        <Text style={styles.infoText}>Количество вопросов: {pollData.questions_quantity}</Text>
        <Text style={styles.infoText}>Количество голосов: {pollData.participants_quantity}</Text>
        <Text style={styles.infoText}>
          Защита от списывания: {pollData.mix_options || pollData.mix_questions ? 'Да' : 'Нет'}
        </Text>
      </Page>
    </Document>
  );
};

export default PollResultsPDF;
