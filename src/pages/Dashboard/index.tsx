import Topbar from '@/components/Topbar/Topbar';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';

type DashboardProps = {
    
};

const Dashboard: React.FC<DashboardProps> = () => {
    const { user, loading } = useAuth();

    if (loading || !user)
        return <div>loading ... </div>
    
    return (
        <div>
            <Topbar compilerPage={true} />
        </div>
    );
}
export default Dashboard;