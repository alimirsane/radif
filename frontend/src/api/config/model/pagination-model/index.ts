export interface PaginationModel<DATA_TYPE> {
  count: number;
  next: string | null;
  previous: string | null;
  page_count: number;
  page_size: number;
  results: DATA_TYPE;
  file_url?: string;
}
