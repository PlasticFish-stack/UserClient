import type { BrandTypes } from "@/api/brand";

export type StateProps = {
  brandData: BrandTypes[];
  loading: boolean;
  type: "Add" | "Edit";
  curBrand: BrandTypes;
};
