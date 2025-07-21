if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return [...this].reverse();
  };
}

import "@styles/globals.scss";
import type { AppProps } from "next/app";
import { iranSans } from "@data/font";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import NextNProgress from "nextjs-progressbar";
import Navigation from "@feature/dashboard/common/navigation";
import { Toaster } from "react-hot-toast";
import { RouteBreadcrumb } from "@feature/dashboard/common/breadcrumb/handler";
import { convertRouteToName } from "@data/routes/convert-to-name";
import { useEffect, useMemo } from "react";
import Head from "next/head";
import { UserGuide } from "@feature/dashboard/common/user-guide";
import { routes } from "@data/routes";

const ModalHandler = dynamic(() => import("@utils/modal-handler"));
const RQProvider = dynamic(() => import("@api/lazy-provider"));
declare global {
  interface Window {
    RAYCHAT_TOKEN?: string;
    Raychat?: {
      setUser: (user: {
        email?: string;
        name?: string;
        phone?: string;
      }) => void;
      logout?: () => void;
      unloadUser?: any;
      loadUser?: any;
      getUser?: any;
    };
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const title = useMemo(() => {
    return convertRouteToName(router.asPath);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Raychat) {
      window.RAYCHAT_TOKEN = "6675781f-671b-4164-b8d3-cf35a61afff4";
      const s = document.createElement("script");
      s.src = "https://widget-react.raychat.io/install/widget.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
        window.RAYCHAT_TOKEN = "6675781f-671b-4164-b8d3-cf35a61afff4";
        (function () {
          var d = document;
          var s = d.createElement("script");
          s.src = "https://widget-react.raychat.io/install/widget.js";
          s.async = true;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();
      `,
          }}
        /> */}
      </Head>
      <RQProvider>
        <main className={iranSans.className}>
          <Toaster
            containerStyle={{ zIndex: 100 }}
            toastOptions={{ duration: 3000, style: { zIndex: 10001 } }}
            position="top-center"
          />
          <NextNProgress
            color="#4E46B4"
            startPosition={0.3}
            stopDelayMs={200}
            height={5}
            showOnShallow={true}
            options={{ showSpinner: false }}
          />
          {router.asPath.includes("/dashboard") && <Navigation />}
          <ModalHandler />
          {!router.asPath.includes("auth") && <RouteBreadcrumb />}
          <Component {...pageProps} />
          {router.asPath.includes(routes.operatorRequest()) && <UserGuide />}
        </main>
      </RQProvider>
    </>
  );
}
