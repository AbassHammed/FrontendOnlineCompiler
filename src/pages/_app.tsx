import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Wrapper } from '@/components/wrapper';
import { SessionProvider } from '@/hooks/useSession';
import { NextUIProvider } from '@nextui-org/react';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>LetsCode</title>
        <meta name="description" content="Online compiler for C, C++ and Python programs." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Icon.png" sizes="180*180" />
      </Head>
      <Toaster richColors position="top-center" closeButton />
      <SessionProvider>
        <NextUIProvider>
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </NextUIProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
