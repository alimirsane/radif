import { MutationFunction } from "@tanstack/react-query";

export class MutateService<RESPONSE, REQUEST> {
  mutationFn: MutationFunction<RESPONSE, REQUEST>;

  constructor(query: MutationFunction<RESPONSE, REQUEST>) {
    this.mutationFn = query;
  }
}
