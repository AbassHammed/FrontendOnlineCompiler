import Loadin from '@/components/Loading/Loading';
import DashTable from '@/components/Table/DashTable';
import Topbar from '@/components/Topbar/Topbar';
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { Session } from '@/utils/types';
import SessionCard from '@/components/Cards/SessionCard';
import DashClock from '@/components/Table/DashClock';

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loadin />;
  }

  return (
    <div className="bg-[#0f0f0f] min-h-screen">
      <Topbar compilerPage={false} dashboardpage={true} session={session} />
      <div
        className="flex justify-between items-start max-w-4xl w-full mx-auto"
        style={{ height: 'calc(100vh - TopbarHeight - TableHeight)' }}>
        <div className="flex-1 m-2">
          <SessionCard session={session} />
        </div>
        <div className="flex-1 m-2">
          <DashClock />
        </div>
      </div>
      <DashTable setSession={setSession} />
    </div>
  );
};
export default Dashboard;
