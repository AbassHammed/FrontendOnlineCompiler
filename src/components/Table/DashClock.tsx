import React from 'react';

import { Card } from '@nextui-org/react';
import { Text } from 'nextui-org-react-old';
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
    <Card className="flex flex-col items-center justify-center max-w-[400px] bg-[#282828] text-white m-10 p-5">
      <Text h3 className="mb-2 text-white">
        {day}
      </Text>
      <Clock
        format={'HH:mm'}
        ticking
        timezone={'Europe/Paris'}
        className="text-[100px] leading-none"
      />
      <Text className="mt-2 text-white">{date}</Text>
    </Card>
  );
};

export default DashClock;
