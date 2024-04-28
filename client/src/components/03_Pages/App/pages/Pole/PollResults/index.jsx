import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { ResultsGridWrapper, SettingsWrapper, Wrapper } from './styled';
import PollResultCard from '@/components/05_Features/PollResultCard';
import { getPollResultsFx } from './model/get-results';
import { useParams } from 'react-router';
import { v4 } from 'uuid';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PdfExporter from '@/components/07_Shared/UIComponents/Utils/Helpers/pdfExporter';
import PollResultsPDF from '@/components/06_Entities/pollResultsPDF';
import NoResultsPoll from '@/components/05_Features/NoResultsPoll';

const PollResultsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPollResultsFx({ id });
      setQuestions(data.questions);
    };
    fetchResults();
  }, []);

  const handleChartTypeChange = (event) => setChartType(event.target.value);

  return questions.length > 0 ? (
    <Wrapper>
      <SettingsWrapper>
        <Select value={chartType} onChange={handleChartTypeChange} displayEmpty>
          <MenuItem value="pie">
            <PieChartIcon /> Pie Chart
          </MenuItem>
          <MenuItem value="bar">
            <BarChartIcon /> Bar Chart
          </MenuItem>
          <MenuItem value="line">Line Chart</MenuItem>
        </Select>
        <PdfExporter children={<PollResultsPDF data={questions} />} />
      </SettingsWrapper>
      <ResultsGridWrapper>
        {questions.map((item) => (
          <PollResultCard key={v4()} data={item} chartType={chartType} />
        ))}
      </ResultsGridWrapper>
    </Wrapper>
  ) : (
    <NoResultsPoll />
  );
};

export default PollResultsPage;
