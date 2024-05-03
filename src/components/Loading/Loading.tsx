import React from 'react';

import { Spinner } from '@nextui-org/react';

const Loading: React.FC = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-[#303030]">
    <Spinner color="secondary" size="lg" />
  </div>
);

export default Loading;
