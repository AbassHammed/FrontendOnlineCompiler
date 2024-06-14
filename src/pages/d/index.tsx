import React, { useState } from 'react';

import DashClock from '@/components/DashBoard/DashClock';
import DashTable from '@/components/DashBoard/DashTable';
import SessionCard from '@/components/DashBoard/SessionCard';
import Loading from '@/components/Loading';
import Topbar from '@/components/Topbar';
import { useAuth } from '@/hooks/useAuth';
import { Session } from '@/types';

const Dashboard: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <Topbar compilerPage={false} session={session} />
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
