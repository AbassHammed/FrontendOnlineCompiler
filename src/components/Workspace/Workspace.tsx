import React from 'react';

import Split from 'react-split';

import PDFViewer from './PDFViewer/PDFViewer';
import Playground from './Playground/Playground';

type WorkspaceProps = {
  filePath: string;
  sessionId: string;
  UserId: string;
};

const Workspace: React.FC<WorkspaceProps> = ({ filePath }) => (
  <Split sizes={[59, 75]} className="split bg-[#0f0f0f]">
    <PDFViewer file={filePath} />
    <Playground />
  </Split>
);
export default Workspace;
