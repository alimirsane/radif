import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useMemo } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ReactQueryLazyProviderType {
  children: ReactNode;
}

const queryClient =  new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});;

const ReactQueryLazyProvider = (props: ReactQueryLazyProviderType) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {props.children}
    </QueryClientProvider>
  );
};

export default ReactQueryLazyProvider;
