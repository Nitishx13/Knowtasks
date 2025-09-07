import DashboardPage from './DashboardPage';
import UserDashboardPage from './UserDashboardPage';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      {user ? <UserDashboardPage /> : <DashboardPage />}
    </DashboardLayout>
  );
}
