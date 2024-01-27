import Loadin from '@/components/Loading/Loading';
import DashTable from '@/components/Table/DashTable';
import Topbar from '@/components/Topbar/Topbar';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

type DashboardProps = {};

const Dashboard: React.FC<DashboardProps> = () => {
  const { user, loading } = useAuth();

  if (loading || !user) return <Loadin />;

  return (
    <div className="bg-[#0f0f0f] h-screen">
      <Topbar compilerPage={false} dashboardpage={true} />
      <DashTable />
    </div>
  );
};
export default Dashboard;
