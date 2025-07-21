import axios from "axios";
import * as process from "process";
import { getCookieByName } from "@utils/cookie-handler";
import toast from "react-hot-toast";

const configHeaders = (language: string) => {
  const header: Record<string, string | undefined> = {
    "X-CSRFToken": undefined,
    Authorization: undefined,
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
  };

  header["X-CSRFToken"] = getCookieByName("csrftoken");
  header["Authorization"] = `Token ${getCookieByName("token")}`;

  if (!getCookieByName("csrftoken")) delete header["X-CSRFToken"];
  if (!getCookieByName("token")) delete header["Authorization"];

  return header;
};

const createApiInstance = (options: {
  language: string;
  toast?: {
    enable?: boolean;
    waiting?: string;
    success?: string;
    fail?: string;
  };
  useToken?: boolean;
  withCredentials?: boolean;
  useLoadingOverlay?: boolean; //handle loading overlay
}) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
    withCredentials: options.withCredentials,
    headers: configHeaders(options.language),
  });

  api.interceptors.request.use(
    (config) => {
      if (config.params?.useLoadingOverlay === false) {
        return config;
      }
      if (options.toast?.enable) {
        (config as any).loadingToastId = toast.loading(
          options.toast.waiting ?? "در حال انتظار",
        );
      } else if (config.method?.toLowerCase() === "get") {
        const node = document.getElementById("api-loading");
        if (!node) {
          document?.getElementById("__next")?.insertAdjacentHTML(
            "afterbegin",
            `
              <div id="api-loading" style="  
                z-index: 1000000;
                position: fixed;
                width: 100vw;
                height: 100vh;
                -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
                background: rgba(0, 0, 0, 0.4)
              ">
                    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" class="w-[24px] h-[24px] text-gray-200 animate-spin first:fill-common-gray last:fill-common-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    </div>
              </div>
    `,
          );
        } else {
          if (node.classList.contains("hidden")) {
            document?.getElementById("api-loading")?.classList.remove("hidden");
          }
        }
      }

      if (options.useToken) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      const node = document.getElementById("api-loading");
      node?.classList.add("hidden");
      if (options.toast?.enable) {
        toast.dismiss((response.config as any).loadingToastId);
        setTimeout(() => {
          toast.success(options.toast?.success ?? "موفقیت آمیز");
        }, 500);
      }

      return response;
    },
    (error) => {
      const node = document.getElementById("api-loading");
      node?.classList.add("hidden");
      if (options.toast?.enable) {
        toast.dismiss((error.config as any).loadingToastId);
        setTimeout(() => {
          if (navigator.onLine) {
            // console.log("error", error);
            toast.error(
              options.toast?.fail ??
                error.response?.data?.data?.non_field_errors?.[0] ??
                error.response?.data?.errors?.[0] ??
                error.response?.data?.errors?.errors?.[0] ??
                error.response?.data?.data?.reason ??
                error.response?.message ??
                `خطا در انجام عملیات`,
            );
          } else {
            toast.error("عدم دسترسی به اینترنت");
          }
        }, 500);
      }
      return Promise.reject("error");
    },
  );

  return api;
};

export const apiNoToast = (language: string) =>
  createApiInstance({
    withCredentials: true,
    language: language,
    toast: {
      enable: false,
    },
  });
export const apiToast = (
  language: string,
  message:
    | {
        waiting?: string;
        success?: string;
        fail?: string;
      }
    | undefined,
) =>
  createApiInstance({
    withCredentials: true,
    language: language,
    toast: {
      ...message,
      enable: true,
    },
  });
