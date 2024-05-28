import PollResultsSVG from '@assets/Analytics.svg';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import { MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import { w3cwebsocket } from 'websocket';

import { getPollAnswersFx, getPollResultsFx } from './model/get-results';
import { ResultsGridWrapper, SettingsWrapper, StldSelect, Wrapper } from './styled';

import PollResultCard from '@/components/05_Features/Data/Cards/pollResCard';
import GenExcelResults from '@/components/06_Entities/genExcelResults';
import NoDataHelper from '@/components/07_Shared/UIComponents/Utils/Helpers/noDataHelper';
import config from '@/config';
import usePageTitle from '@/hooks/usePageTitle';

const PollResultsPage = () => {
  usePageTitle('pollres');
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [chartType, setChartType] = useState('pie');
  const [isResults, setIsResults] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await getPollResultsFx({ id });
      const answers = await getPollAnswersFx({ id });
      setAnswers(answers);
      setQuestions(data.questions);
      setIsResults(data.participants_quantity > 0);
    };
    fetchResults();

    const socket = new w3cwebsocket(`ws://${config.serverUrl.wsMain}/`);

    socket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      if (message.type === 'results') {
        setQuestions(message.data.questions);
        setIsResults(message.data.participants_quantity > 0);
      } else if (message.type === 'answers') {
        setAnswers(message.data);
      }
    };

    return () => {
      socket.close();
    };
  }, [id]);

  const handleChartTypeChange = (event) => setChartType(event.target.value);

  return isResults ? (
    <Wrapper>
      <SettingsWrapper>
        <StldSelect value={chartType} onChange={handleChartTypeChange} displayEmpty>
          <MenuItem value="pie">
            <PieChartIcon /> Pie Chart
          </MenuItem>
          <MenuItem value="bar">
            <BarChartIcon /> Bar Chart
          </MenuItem>
        </StldSelect>
        <GenExcelResults questions={questions} data={answers} />
      </SettingsWrapper>
      <ResultsGridWrapper>
        {questions.map((item) => (
          <PollResultCard key={v4()} data={item} chartType={chartType} answers={answers} />
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
