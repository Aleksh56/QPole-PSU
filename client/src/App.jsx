import AppPageRoutes from '@routes/AppPageRoutes';
import { PrivateRoute } from '@routes/PrivateRoute';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminPrivateRoute from './app/Routes/AdminPrivateRoute';
import AdminPanelPage from './components/03_Pages/Admin';
import ConductionPollPage from './components/03_Pages/Polls/ConductionPoll';
import FastConductionPollPage from './components/03_Pages/Polls/FastConductionPoll';

import AuthPage from '@/components/03_Pages/Auth';
import HomePage from '@/components/03_Pages/Home';
import PollListPage from '@/components/03_Pages/Polls/PollList';
import FrmRestore from '@/components/04_Widgets/Data/Forms/frmRestore';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/polls" element={<PollListPage />} />
        <Route path="/conduct-poll/:id" element={<ConductionPollPage />} />
        <Route path="/quick-conduct-poll/:id" element={<FastConductionPollPage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/password-reset" element={<FrmRestore />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin-panel/*" element={<AdminPanelPage />} />
          </Route>
          <Route path="/app/*" element={<AppPageRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
