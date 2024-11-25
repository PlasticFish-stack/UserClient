import { formatGolangDate } from "@/utils/time/date";

export const timeRenderContainer = (key: string, title: string): any => {
  return {
    prop: key,
    headerRenderer: () => (
      <div style="display: flex;align-items: center;position: relative;">
        <div>
          <span>{title}</span>
        </div>
      </div>
    ),
    cellRenderer: ({ row }) => (
      <div style="display: flex;align-items: center">
        <span>{formatGolangDate(row[key])}</span>
      </div>
    )
  };
};
