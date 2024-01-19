import Topbar from '@/components/Topbar/Topbar';
import React from 'react';

type DashboardProps = {
    
};

const Dashboard:React.FC<DashboardProps> = () => {
    
    return (
        <div>
            <Topbar compilerPage={true} />
        </div>
    );
}
export default Dashboard;