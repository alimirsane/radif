export type FBDependencies =
  | {
      logicalOperator: "and" | "or";
      conditions:
        | Array<{
            name: string;
            values: Array<string>;
          }>
        | undefined;
    }
  | undefined;
