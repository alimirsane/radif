export class QueryService<RESPONSE> {
  queryKey: Array<any>;
  queryFn: () => Promise<RESPONSE>;

  constructor(query: () => Promise<RESPONSE>, key: Array<any>) {
    this.queryKey = key;
    this.queryFn = query;
  }
}
