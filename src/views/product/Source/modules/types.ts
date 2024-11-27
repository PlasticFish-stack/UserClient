import type { BrandTypes } from "@/api/brand";
import type { CurrencyTypes } from "@/api/currency";
import type { CategoryTypes } from "@/api/productCategory";
import type { SourceTypes } from "@/api/source";

export type StateProps = {
  data: SourceTypes[];
  total: number;
  loading: boolean;
  categoryData: CategoryTypes[];
  brandData: BrandTypes[];
  categoryMapping: {
    [key: string]: CategoryTypes;
  };

  brandMapping: {
    [key: string]: BrandTypes;
  };
  currencyData: CurrencyTypes[];
};

export enum FileType {
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
