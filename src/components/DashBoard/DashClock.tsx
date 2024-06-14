import React from 'react';

import Clock from 'react-live-clock';

const DashClock: React.FC = () => {
  const currentDate = new Date();
  const day = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
  const date = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col items-center justify-center max-w-[400px] bg-gray-8 rounded-lg text-white m-10 p-5">
      <h1 className="mb-2 text-white">{day}</h1>
      <Clock
        format={'HH:mm'}
        ticking
        timezone={'Europe/Paris'}
        className="text-[100px] leading-none"
      />
      <h1 className="mt-2 text-white">{date}</h1>
    </div>
  );
};

export default DashClock;
