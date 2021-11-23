import {
  Order,
  OrderBookState,
  SnapshotFeedPayload,
  TupleOrder,
} from "../types";

// Calculate bids & asks totals
export const computeTotals = (
  numLevels: number,
  bids: TupleOrder[],
  asks: TupleOrder[]
): { bids: Map<number, Order>; asks: Map<number, Order> } => {
  const orders = { bids: new Map(), asks: new Map() };
  let bidsTotal = 0;
  let asksTotal = 0;

  for (let i = 0; i < numLevels; i++) {
    if (i < bids.length) {
      const [price, size] = bids[i];
      bidsTotal += size;
      orders.bids.set(price, { price, size, total: bidsTotal });
    }

    if (i < asks.length) {
      const [price, size] = asks[i];
      asksTotal += size;
      orders.asks.set(price, { price, size, total: asksTotal });
    }
  }
  return orders;
};

// Transform orderbook snapshot to OrderBookState
export const toOrderBookState = (data: SnapshotFeedPayload): OrderBookState => {
  const { bids, asks, numLevels } = data;
  return {
    numLevels,
    ...computeTotals(numLevels, bids, asks),
  };
};

// Update OrderBookState
// ... this would update the size, add or remove an order and eventually re-calculate the totals
export const updateOrderBookState = (
  oldOrderBook: OrderBookState,
  bids: TupleOrder[],
  asks: TupleOrder[]
) => {
  // Update bids side
  for (const entry of bids) {
    const [price, size] = entry;
    // Remove zero size from the orderbook
    if (size === 0) oldOrderBook.bids.delete(price);
    // Add / update
    else oldOrderBook.bids.set(price, { price, size, total: 0 });
  }
  // Update asks side
  for (const entry of asks) {
    const [price, size] = entry;
    if (size === 0) oldOrderBook.asks.delete(price);
    else oldOrderBook.asks.set(price, { price, size, total: 0 });
  }
  // DESC sorting
  const newBids = [...oldOrderBook.bids.entries()]
    .sort((a, b) => b[0] - a[0])
    .map((bid) => [bid[1].price, bid[1].size] as TupleOrder);
  // ASC sorting
  const newAsks = [...oldOrderBook.asks.entries()]
    .sort()
    .map((ask) => [ask[1].price, ask[1].size] as TupleOrder);

  return {
    ...oldOrderBook,
    ...computeTotals(oldOrderBook.numLevels, newBids, newAsks),
  };
};
