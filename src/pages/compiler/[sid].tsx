import Topbar from '@/components/Topbar/Topbar';
import Workspace from '@/components/Workspace/Workspace';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type CompilerProps = {
    
};

const Compiler: React.FC<CompilerProps> = () => {
    
    const router = useRouter();
    const { query } = router;
    const [sessionDetails, setSessionDetails] = useState({
        name: '',
        filePath: ''
    });

    useEffect(() => {
        if (query.filePath && query.sessionName) {
        setSessionDetails({
            name: query.sessionName as string,
            filePath: query.filePath as string
        });
        }
    }, [query]);
    console.log()
    
    return (
        <div>
            <Topbar compilerPage={true} sessionName={sessionDetails.name}/>
            <Workspace filePath={sessionDetails.filePath}/>
        </div>
    );
}
export default Compiler;