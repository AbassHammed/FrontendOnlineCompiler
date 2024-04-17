import React from 'react';

import dynamic from 'next/dynamic';

// import Playground from './Playground/Playground';

// import PDFViewer from './PDFViewer/PDFViewer';
const PDFViewer = dynamic(() => import('./PDFViewer/PDFViewer'), { ssr: false });
const Playground = dynamic(() => import('./Playground/Playground'), { ssr: false });

const Workspace = () => (
  <div className="flex h-[calc(100vh-50px)] bg-[#0f0f0f]">
    <PDFViewer />
    <Playground />
  </div>
);
export default Workspace;
