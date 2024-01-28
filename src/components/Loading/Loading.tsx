import React from 'react';
import { Loading } from 'nextui-org-react-old';

const Loadin: React.FC = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-[#303030]">
    <Loading type="points" color="secondary" size="xl" />
  </div>
);

export default Loadin;
