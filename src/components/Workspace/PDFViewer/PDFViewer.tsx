import { useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiOutlineChevronRight, HiOutlineChevronLeft } from 'react-icons/hi2';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string;
}

interface NavProps {
  pageNumber: number;
  numPages: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}

const Nav = ({ pageNumber, numPages, goToPrevPage, goToNextPage }: NavProps) => (
  <div className="flex h-9 w-full items-center justify-center bg-[#303030] text-white overflow-x-hidden rounded-t-lg shadow-md">
    <div className="flex items-center space-x-4 ">
      <button
        onClick={goToPrevPage}
        disabled={pageNumber <= 1}
        className="flex items-center justify-center rounded-sm hover:bg-dark-fill-2 h-7 w-7 cursor-pointer">
        <HiOutlineChevronLeft />
      </button>
      <div className="bg-[#0f0f0f] text-white rounded-md px-2 py-1 text-sm font-medium">
        <span>{pageNumber}</span>
        <span className="text-gray-400"> / {numPages}</span>
      </div>
      <button
        onClick={goToNextPage}
        disabled={pageNumber >= numPages}
        className="flex items-center justify-center rounded-sm hover:bg-dark-fill-2 h-7 w-7 cursor-pointer">
        <HiOutlineChevronRight />
      </button>
    </div>
  </div>
);

const PDFViewer = ({ file }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => setPageNumber(prev => Math.max(prev - 1, 1)), []);
  const goToNextPage = useCallback(
    () => setPageNumber(prev => Math.min(prev + 1, numPages)),
    [numPages],
  );

  return (
    <div className="bg-[#282828] rounded-lg shadow-xl overflow-hidden ml-2 mb-2">
      <Nav
        pageNumber={pageNumber}
        numPages={numPages}
        goToPrevPage={goToPrevPage}
        goToNextPage={goToNextPage}
      />
      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          <Document
            file={file}
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
