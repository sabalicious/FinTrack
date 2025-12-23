import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Planning from "./pages/Planning";
import Currencies from "./pages/Currencies";
import Settings from "./pages/Settings";
import Debts from "./pages/Debts";
import Templates from "./pages/Templates";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { GoalsProvider } from "./context/GoalsContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <GoalsProvider>
          <Routes>
            {/* Публичные роуты */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Защищённые роуты */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/currencies" element={<Currencies />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            
            {/* Редирект на дашборд для корневого пути */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </GoalsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
