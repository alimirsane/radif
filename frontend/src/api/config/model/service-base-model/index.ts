export interface ServiceBaseModel<DATA_TYPE> {
  status: number;
  message: string;
  data: DATA_TYPE;
  errors: Array<string>;
}
