import "@/styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {

    useEffect(() => {
    const preventCopy = (event: { preventDefault: () => any; }) => event.preventDefault();
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
        <link rel="icon" href="/favicon.png"/>
      </Head>
      <ToastContainer className="no-select"/>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
