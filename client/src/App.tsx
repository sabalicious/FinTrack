import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../../client/src/layouts/MainLayout';
import Dashboard from '../../client/src/pages/Dashboard';
import Transactions from '../../client/src/pages/Transactions';
import Goals from '../../client/src/pages/Goals';
import Settings from '../../client/src/pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
