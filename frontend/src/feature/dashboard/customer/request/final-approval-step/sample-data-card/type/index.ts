import { FormResponseType } from "@api/service/form-response/type";

export interface SampleDataType {
  // sampleID: string;
  // description: object[];
  sampleNumber: number;
  sample: FormResponseType;
  requestIsCompleted?: boolean;
  test_unit_type?: string;
}
