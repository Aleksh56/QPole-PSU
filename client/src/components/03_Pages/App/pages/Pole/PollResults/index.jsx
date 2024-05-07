import PollResultsSVG from '@assets/Analytics.svg';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import { MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { v4 } from 'uuid';

import { getPollResultsFx } from './model/get-results';
import { ResultsGridWrapper, SettingsWrapper, Wrapper } from './styled';

import PollResultCard from '@/components/05_Features/Data/Cards/pollResCard';
import PollResultsPDF from '@/components/06_Entities/pollResultsPDF';
import NoDataHelper from '@/components/07_Shared/UIComponents/Utils/Helpers/noDataHelper';
import PdfExporter from '@/components/07_Shared/UIComponents/Utils/Helpers/pdfExporter';

const PollResultsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [chartType, setChartType] = useState('pie');
  const [isResults, setIsResults] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPollResultsFx({ id });
      setQuestions(data.questions);
      setIsResults(data.participants_quantity > 0);
    };
    fetchResults();
  }, []);

  const handleChartTypeChange = (event) => setChartType(event.target.value);

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
        <PdfExporter>
          <PollResultsPDF data={questions} />
        </PdfExporter>
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
