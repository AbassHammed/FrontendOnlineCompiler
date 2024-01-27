import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { SessionProvider } from '@/hooks/useSession';
import { NextUIProvider } from '@nextui-org/react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const preventCopy = (event: { preventDefault: () => any }) => event.preventDefault();
    document.addEventListener('copy', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
    };
  }, []);
  return (
    <RecoilRoot>
      <Head>
        <title>LetsCode</title>
        <meta name="description" content="Online compiler for C, C++ and Python programs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Toaster richColors position="top-center" closeButton />
      <SessionProvider>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
