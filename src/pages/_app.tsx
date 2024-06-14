import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Provider } from '@/Provider';
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>LetsCode</title>
        <meta name="description" content="Online compiler for all sorts of languages." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Icon.png" sizes="180*180" />
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </RecoilRoot>
  );
}
