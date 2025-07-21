export class Base64Handler {
  static encodeToJWT = <TYPE>(object: TYPE): string => {
    // Convert object to JSON string
    const jsonString: string = JSON.stringify(object);

    // Encode JSON string to Base64
    const base64String: string = btoa(jsonString);

    // Sign the Base64 string with the key (you can use HMAC for simplicity)
    return btoa(base64String + process.env.NEXT_PUBLIC_COOKIE_KEY);
  };

  static decodeJWTToObject = <TYPE>(
    jwt: string | undefined,
  ): TYPE | undefined => {
    if (!jwt) return undefined;
    // Decode signed JWT to Base64
    const decodedJWT: string = atob(jwt);

    // Verify signature (you can use HMAC for simplicity)
    const [base64String] = decodedJWT.split(
      process.env.NEXT_PUBLIC_COOKIE_KEY ?? "",
    );

    if (base64String + process.env.NEXT_PUBLIC_COOKIE_KEY !== decodedJWT) {
      throw new Error("Invalid signature");
    }

    // Decode Base64 string to JSON
    const jsonString: string = atob(base64String);

    // Parse JSON string to object
    return JSON.parse(jsonString);
  };
}
