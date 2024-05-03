import React from 'react';

import { Icons } from '@/components/icons';

const Loading: React.FC = () => (
  <div className="flex justify-center items-center h-screen w-screen bg-[#303030]">
    <Icons.spinner className="animate-spin" />
  </div>
);

export default Loading;
