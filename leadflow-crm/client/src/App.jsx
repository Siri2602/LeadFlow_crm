import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import KanbanPage from './pages/KanbanPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#161b22', color: '#e6edf3', border: '1px solid #30363d', fontSize: '13px' },
            success: { iconTheme: { primary: '#3fb950', secondary: '#161b22' } },
            error: { iconTheme: { primary: '#f85149', secondary: '#161b22' } },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
