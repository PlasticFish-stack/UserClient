import type { CategoryTypes } from "@/api/productCategory";

export type StateProps = {
  categoryData: Array<CategoryTypes>;
  loading: boolean;
};
