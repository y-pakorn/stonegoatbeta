import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { DESCRIPTION, ICON, TITLE, URL } from "@/constants/texts";
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
        <meta key="meta-title" name="title" content={TITLE} />
        <meta key="meta-description" name="description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta key="og-title" property="og:title" content={TITLE} />
        <meta
          key="og-description"
          property="og:description"
          content={DESCRIPTION}
        />
        <meta key="og-image" property="og:image" content={ICON} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={URL} />
        <meta key="twitter-title" property="twitter:title" content={TITLE} />
        <meta
          key="twitter-description"
          property="twitter:description"
          content={DESCRIPTION}
        />
        <meta key="twitter-image" property="twitter:image" content={ICON} />
        <title key="title">{TITLE}</title>
        <link rel="icon" type="image/png" href={ICON} />
        <meta
          name="keywords"
          content="stonegoat, beta, rock climbing, bouldering, climbing gym, bouldering gym"
        />
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
