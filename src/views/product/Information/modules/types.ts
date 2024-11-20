import type { BrandTypes } from "@/api/brand";
import type { InformationTypes } from "@/api/information";
import type { CategoryTypes } from "@/api/productCategory";

export type StateProps = {
  loading: boolean;
  informationData: InformationTypes[];
  curInformation: InformationTypes;
  type: "Add" | "Edit";
  categoryData: CategoryTypes[];
  brandData: BrandTypes[];
  categoryMapping: {
    [key: string]: CategoryTypes;
  };
  brandMapping: {
    [key: string]: BrandTypes;
  };
};
