import React from 'react';

import { Session } from '@/types';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
  Snippet,
} from '@nextui-org/react';

type SessionCardProps = {
  session: Session | null;
};

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const classNames = React.useMemo(
    () => ({
      base: ['bg-[#282828]'],
    }),
    [],
  );
  if (!session) {
    return (
      <Card classNames={classNames} className="max-w-[400px] text-dark-label-2 m-10">
        <CardBody>
          <p>Nothing to display.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card classNames={classNames} className="max-w-[400px] text-dark-label-2 m-10">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{session.sessionName}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <Snippet
          tooltipProps={{
            color: 'foreground',
            content: 'Copy the session Id',
            disableAnimation: true,
            placement: 'right',
            closeDelay: 0,
          }}>
          {session.sessionId}
        </Snippet>
        <p className="text-md m-1">
          <span className="text-blue-500">Time:</span>
          <span className="text-white mx-2">{session.time}</span>
          <span className="text-green-500">Date:</span>
          <span className="text-white ml-2">{session.date}</span>
        </p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={session.filePath}>
          See your PDF file.
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SessionCard;
