import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import theme from "@/themes";
import { useBetas } from "@/stores/useBetas";
import { GoogleAnalytics } from "nextjs-google-analytics";
import TagManager from "react-gtm-module";

const App = ({ Component, pageProps }: AppProps) => {
  const [showChild, setShowChild] = useState(false);
  const { fetchBetas } = useBetas();

  useEffect(() => {
    setShowChild(true);
    fetchBetas();
    TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM ?? "" });
  }, []);

  return (
    <>
      <Head>
        <title key="title">{TITLE}</title>
        <meta name="description" content={DESCRIPTION} key="description" />
      </Head>

      <ChakraProvider theme={theme}>
        {typeof window === "undefined" || !showChild ? (
          <></>
        ) : (
          <>
            <GoogleAnalytics trackPageViews />
            <Component {...pageProps} />
          </>
        )}
      </ChakraProvider>
    </>
  );
};

export default App;
