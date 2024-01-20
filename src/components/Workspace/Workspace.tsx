import React from 'react';
import Split from "react-split";
import PDFViewer from './PDFViewer/PDFViewer';
import Playground from './Playground/Playground';

type WorkspaceProps = { 
    filePath: string;
};

const Workspace: React.FC<WorkspaceProps> = ({filePath}) => {
    
    return (
        <Split sizes={[59, 75]} className="split bg-[#0f0f0f]">
            <PDFViewer file="https://www.africau.edu/images/default/sample.pdf" />
            <Playground />
        </Split>
    );
};
export default Workspace;