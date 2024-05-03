import { SVGProps } from 'react';

export type UserInfo = {
  uid: string;
  email: string;
  fullName: string;
  imageUrl: string;
  createdAt: string;
};

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Session = {
  sessionDoc: string;
  sessionId: string;
  sessionName: string;
  filePath: string;
  time: string;
  date: string;
  userId: string;
};

export type User = {
  docId: string;
  name: string;
  connected: boolean;
  joinedAt: string | undefined;
  quitedAt?: string | null;
};

export const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'STATUS', uid: 'status' },
  { name: 'CONNECTED', uid: 'connect' },
  { name: 'DISCONNECTED', uid: 'disconnect' },
  { name: 'ACTIONS', uid: 'actions' },
];
