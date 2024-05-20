import PollResultsSVG from '@assets/Analytics.svg';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import { Button, MenuItem, Select } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';

import { getPollAnswersFx, getPollResultsFx } from './model/get-results';
import { ResultsGridWrapper, SettingsWrapper, Wrapper } from './styled';

import PollResultCard from '@/components/05_Features/Data/Cards/pollResCard';
import PollResultsPDF from '@/components/06_Entities/pollResultsPDF';
import NoDataHelper from '@/components/07_Shared/UIComponents/Utils/Helpers/noDataHelper';
import PdfExporter from '@/components/07_Shared/UIComponents/Utils/Helpers/pdfExporter';
import usePageTitle from '@/hooks/usePageTitle';
import usePollData from '@/hooks/usePollData';

const PollResultsPage = () => {
  usePageTitle('pollres');
  const { id } = useParams();
  const { t } = useTranslation();
  const { pollData } = usePollData(id);
  const [questions, setQuestions] = useState([]);
  const [chartType, setChartType] = useState('pie');
  const [isResults, setIsResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showPDFExporter, setShowPDFExporter] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPollResultsFx({ id });
      const answers = await getPollAnswersFx({ id });
      setAnswers(answers);
      setQuestions(data.questions);
      setIsResults(data.participants_quantity > 0);
    };
    fetchResults();
  }, [id]);

  const handleChartTypeChange = (event) => setChartType(event.target.value);
  const handleDownloadClick = () => {
    setShowPDFExporter(true);
  };

  return isResults ? (
    <Wrapper>
      <SettingsWrapper>
        <Select value={chartType} onChange={handleChartTypeChange} displayEmpty>
          <MenuItem value="pie">
            <PieChartIcon /> Pie Chart
          </MenuItem>
          <MenuItem value="bar">
            <BarChartIcon /> Bar Chart
          </MenuItem>
        </Select>
        <Button onClick={handleDownloadClick}>{t('button.downloadPDF')}</Button>
        {showPDFExporter && (
          <Suspense fallback={<div>Загрузка PDF...</div>}>
            <PdfExporter
              document={<PollResultsPDF data={answers} pollData={pollData} />}
              fileName="poll-results.pdf"
            />
          </Suspense>
        )}
      </SettingsWrapper>
      <ResultsGridWrapper>
        {questions.map((item) => (
          <PollResultCard key={v4()} data={item} chartType={chartType} />
        ))}
      </ResultsGridWrapper>
    </Wrapper>
  ) : (
    <NoDataHelper
      title="Результатов еще нет"
      description="Результаты появятся после первого прохождения опроса"
      image={PollResultsSVG}
    />
  );
};

export default PollResultsPage;
