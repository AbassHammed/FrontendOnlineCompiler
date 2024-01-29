import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loadin from '@/components/Loading/Loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/auth');
  }, [router]);

  return <Loadin />;
}
