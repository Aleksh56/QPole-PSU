import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/components/03_Pages/Home';
import AuthPage from '@/components/03_Pages/Auth';
import AppPageRoutes from '@routes/AppPageRoutes';
import { PrivateRoute } from '@routes/PrivateRoute';
import PollListPage from '@/components/03_Pages/Polls/PollList';
import ConductionPollPage from './components/03_Pages/Polls/ConductionPoll';
import FrmRestore from '@/components/04_Widgets/frmRestore';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/polls" element={<PollListPage />} />
        <Route path="/conduct-poll/:id" element={<ConductionPollPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/password-reset" element={<FrmRestore />} />
        <Route element={<PrivateRoute />}>
          <Route path="/app/*" element={<AppPageRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
