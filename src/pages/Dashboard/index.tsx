import Loadin from '@/components/Loading/Loading';
import DashTable from '@/components/Table/DashTable';
import Topbar from '@/components/Topbar/Topbar';
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Session } from '@/utils/types';
import SessionCard from '@/components/Cards/SessionCard';

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loadin />;
  }

  return (
    <div className="bg-[#0f0f0f] h-screen">
      <Topbar compilerPage={false} dashboardpage={true} session={session} />
      <SessionCard session={session} />
      <DashTable setSession={setSession} />
    </div>
  );
};
export default Dashboard;
