import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import theme from "@/themes";
import { useBetas } from "@/stores/useBetas";

const App = ({ Component, pageProps }: AppProps) => {
  const [showChild, setShowChild] = useState(false);
  const { fetchBetas } = useBetas();

  useEffect(() => {
    setShowChild(true);
    fetchBetas();
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
          <Component {...pageProps} />
        )}
      </ChakraProvider>
    </>
  );
};

export default App;
