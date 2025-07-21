import axios from "axios";
import { createHash, randomBytes } from "crypto";

const OIDC_CONFIG = {
  // issuer: "https://uac.meta.sharif.ir",
  authorizationEndpoint: process.env.NEXT_PUBLIC_AUTHORIZATION_URL ?? "",
  tokenEndpoint: process.env.NEXT_PUBLIC_TOKEN_URL ?? "",
  userinfoEndpoint: process.env.NEXT_PUBLIC_USER_INFO_URL ?? "",
  logoutEndpoint: process.env.NEXT_PUBLIC_LOGOUT_URL ?? "",
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL ?? "",
};

// Generate a code verifier and code challenge for PKCE

export const generatePKCE = () => {
  const codeVerifier = randomBytes(32).toString("hex"); // Generate a random code verifier
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/\+/g, "-") // Make it URL-safe
    .replace(/\//g, "_") // Make it URL-safe
    .replace(/=+$/, ""); // Remove '=' padding

  return { codeVerifier, codeChallenge };
};

// Generate the authorization URL
export const initiateOIDCLogin = (codeChallenge: string): string => {
  const params = new URLSearchParams({
    client_id: OIDC_CONFIG.clientId,
    response_type: "code",
    scope: "openid profile",
    redirect_uri: OIDC_CONFIG.redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${OIDC_CONFIG.authorizationEndpoint}?${params.toString()}`;
};
