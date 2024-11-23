import type { SourceTypes } from "@/api/source";

export type StateProps = {
  data: SourceTypes[];
  total: number;
  loading: boolean;
};
