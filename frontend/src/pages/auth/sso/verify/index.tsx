import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiAuth } from "@api/service/auth";
import { routes } from "@data/routes";
import { setCookie } from "@utils/cookie-handler";

const Verify = () => {
  const router = useRouter();
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedVerifier = localStorage.getItem("pkce_code_verifier");
      setCodeVerifier(storedVerifier);
    }
  }, []);

  // console.log("Router Query:", router.query);

  const { mutateAsync } = useMutation(
    apiAuth(false).sendSharifData({
      code: router.query.code,
      scope: router.query.scope,
      code_verifier: codeVerifier,
    }),
  );

  const sendData = async () => {
    if (!codeVerifier) {
      // console.warn("Code verifier not available yet. Skipping request.");
      return;
    }

    try {
      const response = await mutateAsync({});
      // console.log("SSO Data Sent:", response);
      // console.log("User Auth Token:", (response?.data as any)?.user_auth_token);
      if (!(response?.data as any)?.user_auth_token) {
        router.push(routes.signup());
      } else {
        setCookie("token", (response?.data as any)?.user_auth_token, 7);
        router.push(routes.customer());
      }
    } catch (error) {
      console.error("SSO Data Send Failed:", error);
    }
  };

  useEffect(() => {
    if (!isClient || !router.query.code) {
      // console.log("Skipping SSO process: Not client-side or no code provided.");
      return;
    }

    sendData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, codeVerifier, isClient]);

  return <div className="p-8">در حال انتقال...</div>;
};

export default Verify;
