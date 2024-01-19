import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import React from 'react';

type CompilerProps = {
    
};

const Compiler:React.FC<CompilerProps> = () => {
    
    return (
        <div>
            <Topbar compilerPage={true} />
            <Workspace />
        </div>
    );
}
export default Compiler;