import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AnimatedBackground from './components/common/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SchedulingPage from './pages/SchedulingPage';
import MemoryPage from './pages/MemoryPage';
import DeadlockPage from './pages/DeadlockPage';
import DiskPage from './pages/DiskPage';
import FileSystemPage from './pages/FileSystemPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function ProtectedRoute({ children, adminOnly = false, strict = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading..." /></div>;
  if (strict && !user) return <Navigate to="/login" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/scheduling" element={<SchedulingPage />} />
      <Route path="/memory" element={<MemoryPage />} />
      <Route path="/deadlock" element={<DeadlockPage />} />
      <Route path="/disk" element={<DiskPage />} />
      <Route path="/filesystem" element={<FileSystemPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/profile" element={<ProtectedRoute strict><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly strict><AdminPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedBackground />
        <div className="relative z-10">
          <AppRoutes />
        </div>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#111128', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          success: { iconTheme: { primary: '#00ff88', secondary: '#111128' }},
          error: { iconTheme: { primary: '#ff3e8e', secondary: '#111128' }},
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
