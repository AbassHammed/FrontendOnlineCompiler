import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Snippet,
} from '@nextui-org/react';
import { Session } from '@/utils/types';

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
