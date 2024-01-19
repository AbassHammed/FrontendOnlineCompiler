import React from 'react';
import Split from "react-split";
import PDFViewer from './PDFViewer/PDFViewer';
import Playground from './Playground/Playground';

type WorkspaceProps = { };

const Workspace: React.FC<WorkspaceProps> = () => {
    
    return (
        <Split sizes={[59, 75]} className="split bg-[#0f0f0f]">
            <PDFViewer file={"/fnac.pdf"} />
            <Playground />
        </Split>
    );
};
export default Workspace;