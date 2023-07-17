import type { AppProps } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>My truth</title>
        <meta name="description" content="Twitter clone" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Toaster position="bottom-left" />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
