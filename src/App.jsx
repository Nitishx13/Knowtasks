import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import layouts
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardRoutes from './components/layout/DashboardRoutes.jsx';

// Import pages
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotesPage from './pages/notes/NotesPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import LibraryPage from './pages/dashboard/LibraryPage';
import ResearchPage from './pages/dashboard/ResearchPage';
import SummarizePage from './pages/dashboard/SummarizePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        
        {/* Protected routes with DashboardLayout */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/dashboard" element={<DashboardRoutes />}>
          <Route index element={<DashboardPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="summarize" element={<SummarizePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
