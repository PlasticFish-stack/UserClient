import type { CurrencyTypes } from "@/api/currency";
import type { InjectionKey } from "vue";

export interface StateProps {
  currencyData: CurrencyTypes[];
  rowData: CurrencyTypes;
}
export interface EditCurrencyFunction {
  (row: CurrencyTypes): void;
}

export interface StarChangeFunction {
  (row: CurrencyTypes): void;
}

export const editCurrencyKey: InjectionKey<EditCurrencyFunction> =
  Symbol("editCurrency");
export const starChangeKey: InjectionKey<StarChangeFunction> =
  Symbol("starChange");
