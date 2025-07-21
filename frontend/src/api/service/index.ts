import { apiNoToast, apiToast } from "@api/config";
import { AxiosInstance, AxiosRequestConfig } from "axios";
import { QueryService } from "@api/config/query";
import { ServiceBaseModel } from "@api/config/model/service-base-model";
import { MutateService } from "@api/config/mutate";
import { PaginationModel } from "@api/config/model/pagination-model";

export interface ServiceBaseProps {
  waiting?: string;
  success?: string;
  fail?: string;
}

export abstract class ServiceBase {
  static language: string = "no-language";
  url: string;
  protected api: AxiosInstance | undefined = undefined;

  constructor(
    url: string,
    withToast: boolean | undefined,
    props: ServiceBaseProps | undefined,
  ) {
    this.url = url;
    this.api = withToast
      ? apiToast(ServiceBase.language, props)
      : apiNoToast(ServiceBase.language);
  }

  public getAll<RESPONSE_TYPE>(config?: AxiosRequestConfig) {
    return new QueryService(async () => {
      const response = await this.api?.get<
        ServiceBaseModel<Array<RESPONSE_TYPE>>
      >(config?.url ?? this.url, config);
      return response?.data;
    }, [
      config?.url ?? this.url,
      ...Object.values(config?.params ?? {}).filter((param) => param),
      ...Object.values(config?.data ?? {}).filter((data) => data),
    ]);
  }

  public getAllPagination<RESPONSE_TYPE>(config?: AxiosRequestConfig) {
    return new QueryService(async () => {
      const response = await this.api?.get<
        ServiceBaseModel<PaginationModel<RESPONSE_TYPE>>
      >(config?.url ?? this.url, config);
      return response?.data;
    }, [
      config?.url ?? this.url,
      ...Object.values(config?.params ?? {}).filter((param) => param),
      ...Object.values(config?.data ?? {}).filter((data) => data),
    ]);
  }

  getById<RESPONSE_TYPE>(
    itemId: string | undefined,
    config?: AxiosRequestConfig,
  ) {
    return new QueryService(async () => {
      const response = await this.api?.get<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url + itemId + "/",
        config,
      );
      return response?.data;
    }, [
      config?.url ?? this.url,
      itemId,
      ...Object.values(config?.params ?? {}).filter((param) => param),
      ...Object.values(config?.data ?? {}).filter((data) => data),
    ]);
  }

  create<RESPONSE_TYPE, REQUEST_TYPE>(
    config?: AxiosRequestConfig & { formData?: boolean },
  ) {
    return new MutateService(async (data: REQUEST_TYPE) => {
      const formData = new FormData();
      const safeData: any = data ?? {};
      Object.keys(safeData).forEach((key) =>
        formData.append(key, safeData[key]),
      );
      const response = await this.api?.post<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url,
        config?.formData ?? false ? formData : data,
        {
          ...config,
          headers:
            config?.formData ?? false
              ? {
                  ...config?.headers,
                  "Content-Type": "multipart/form-data",
                }
              : config?.headers,
        },
      );
      return response?.data;
    });
  }

  updateAll<RESPONSE_TYPE, REQUEST_TYPE>(
    config?: AxiosRequestConfig & { formData?: boolean },
  ) {
    return new MutateService(async (data: REQUEST_TYPE) => {
      const formData = new FormData();
      const safeData: any = data ?? {};
      Object.keys(safeData).forEach((key) =>
        formData.append(key, safeData[key]),
      );
      const response = await this.api?.put<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url,
        config?.formData ?? false ? formData : data,
        {
          ...config,
          headers:
            config?.formData ?? false
              ? {
                  ...config?.headers,
                  "Content-Type": "multipart/form-data",
                }
              : config?.headers,
        },
      );
      return response?.data;
    });
  }

  updateSome<RESPONSE_TYPE, REQUEST_TYPE>(
    config?: AxiosRequestConfig & { formData?: boolean },
  ) {
    return new MutateService(async (data: REQUEST_TYPE) => {
      const formData = new FormData();
      const safeData: any = data ?? {};
      Object.keys(safeData).forEach((key) =>
        formData.append(key, safeData[key]),
      );
      const response = await this.api?.patch<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url,
        config?.formData ?? false ? formData : data,
        {
          ...config,
          headers:
            config?.formData ?? false
              ? {
                  ...config?.headers,
                  "Content-Type": "multipart/form-data",
                }
              : config?.headers,
        },
      );
      return response?.data;
    });
  }

  delete<RESPONSE_TYPE>(itemId: string, config?: AxiosRequestConfig) {
    return new MutateService(async () => {
      const response = await this.api?.delete<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url + itemId,
        config,
      );
      return response?.data;
    });
  }

  public query<RESPONSE_TYPE>(config?: AxiosRequestConfig) {
    return new QueryService(async () => {
      const response = await this.api?.get<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url,
        config,
      );
      return response?.data;
    }, [
      config?.url ?? this.url,
      ...Object.values(config?.params ?? {}).filter((param) => param),
      ...Object.values(config?.data ?? {}).filter((data) => data),
    ]);
  }

  public mutate<RESPONSE_TYPE, REQUEST_TYPE>(
    type: "delete" | "post" | "put" | "patch",
    config?: AxiosRequestConfig & { formData?: boolean },
  ) {
    return new MutateService(async (data: REQUEST_TYPE) => {
      const formData = new FormData();
      const safeData: any = data ?? {};
      Object.keys(safeData).forEach((key) =>
        formData.append(key, safeData[key]),
      );
      const response = await this.api?.[type]<ServiceBaseModel<RESPONSE_TYPE>>(
        config?.url ?? this.url,
        config?.formData ?? false ? formData : data,
        {
          ...config,
          headers:
            config?.formData ?? false
              ? {
                  ...config?.headers,
                  "Content-Type": "multipart/form-data",
                }
              : config?.headers,
        },
      );
      return response?.data;
    });
  }

  public mutateRare<RESPONSE_TYPE, REQUEST_TYPE>(
    type: "delete" | "post" | "put" | "patch",
    config?: AxiosRequestConfig & { formData?: boolean },
  ) {
    return new MutateService(async (data: REQUEST_TYPE) => {
      const formData = new FormData();
      const safeData: any = data ?? {};
      Object.keys(safeData).forEach((key) =>
        formData.append(key, safeData[key]),
      );
      const response = await this.api?.[type]<RESPONSE_TYPE>(
        config?.url ?? this.url,
        config?.formData ?? false ? formData : data,
        {
          ...config,
          headers:
            config?.formData ?? false
              ? {
                  ...config?.headers,
                  "Content-Type": "multipart/form-data",
                }
              : config?.headers,
        },
      );
      return response?.data;
    });
  }
}

export const createInstanceCreator = <T extends ServiceBase>(
  url: string,
  ServiceClass: new (
    url: string,
    withToast?: boolean,
    props?: ServiceBaseProps,
  ) => T,
) => {
  return (withToast?: boolean, props?: ServiceBaseProps) => {
    return new ServiceClass(url, withToast, props);
  };
};
