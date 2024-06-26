import { useCallback, useState } from 'react';

import { useSession } from '@/hooks/useSession';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface NavProps {
  pageNumber: number;
  numPages: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

const Nav: React.FC<NavProps> = ({ pageNumber, numPages, goToPrevPage, goToNextPage }) => (
  <div className="flex h-9 w-full items-center justify-center dark:bg-[#333] bg-[#fafafa] text-gray-400 overflow-x-hidden rounded-t-md">
    <div className="flex items-center space-x-4 ">
      <button
        onClick={goToPrevPage}
        disabled={pageNumber <= 1}
        className="flex items-center justify-center rounded-sm dark:hover:bg-dark-fill-2 hover:bg-[#e7e7e7] h-7 w-7 cursor-pointer">
        <HiOutlineChevronLeft />
      </button>
      <div className="dark:bg-[#0f0f0f] bg-[#f0f0f0] dark:text-white text-black rounded-md px-2 py-1 text-sm font-medium">
        <span>{pageNumber}</span>
        <span className="text-gray-400"> / {numPages}</span>
      </div>
      <button
        onClick={goToNextPage}
        disabled={pageNumber >= numPages}
        className="flex items-center justify-center rounded-sm dark:hover:bg-dark-fill-2 hover:bg-[#e7e7e7] h-7 w-7 cursor-pointer">
        <HiOutlineChevronRight />
      </button>
    </div>
  </div>
);

const PDFViewer = () => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const { sessionData } = useSession();

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const goToPrevPage = useCallback(() => setPageNumber(prev => Math.max(prev - 1, 1)), []);
  const goToNextPage = useCallback(
    () => setPageNumber(prev => Math.min(prev + 1, numPages)),
    [numPages],
  );

  return (
    <div
      tabIndex={-1}
      className="dark:bg-[#282828] bg-white rounded-lg overflow-hidden ml-2 mb-2 flex-auto w-[40%] focus:ring-1 focus:ring-[#969696] focus:ring-opacity-50 
                       active:ring-1 active:ring-[#969696] active:ring-opacity-50">
      <Nav
        pageNumber={pageNumber}
        numPages={numPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          <Document
            file={sessionData?.filePath}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-full"
            renderMode="canvas">
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
