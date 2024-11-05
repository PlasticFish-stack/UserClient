import type { InformationTypes } from "@/api/information";

export type StateProps = {
  loading: boolean;
  informationData: InformationTypes[];
  curInformation: InformationTypes;
  type: "Add" | "Edit";
};
