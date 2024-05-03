import React from 'react';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer/PDFViewer'), { ssr: false });
const Playground = dynamic(() => import('./Playground/Playground'), { ssr: false });

const Workspace = () => (
  <div className="flex h-[calc(100vh-50px)]">
    <PDFViewer />
    <Playground />
  </div>
);
export default Workspace;
