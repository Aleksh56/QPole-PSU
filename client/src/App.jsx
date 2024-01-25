import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/Home';
import AuthPage from '@pages/Auth';
import AppPageRoutes from '@routes/AppPageRoutes';
import { PrivateRoute } from '@routes/PrivateRoute';
import PasswordResetPage from '@pages/Auth/PasswordReset';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/password-reset" element={<PasswordResetPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/app/*" element={<AppPageRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
