import { Order } from "../types";
export const rowHeight = 25;

export const getTotal = (bids: Order[], asks: Order[]) => {
  return Math.max(
    bids[bids.length - 1]?.total || 0,
    asks[asks.length - 1]?.total || 0
  );
};

export const getMaxRows = (
  orderBookDivHeight: number,
  isMobile: boolean,
  bidsLength: number,
  asksLlength: number
) => {
  const listHeight =
    (orderBookDivHeight -
      (50 /* top-bar height */ + /* bottom-bar height */ 60)) /
    (isMobile ? 2 : 1);

  let max = Math.max(bidsLength, asksLlength);
  let n = 0;
  while (n < max && n * rowHeight < listHeight) ++n;
  return (max = n - (isMobile ? 2 /** titles + spread */ : 0));
};
