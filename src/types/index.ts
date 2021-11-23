export type Dictionary<T> = { [key: string]: T };

export type SubscriptionResponse = {
  event:
    | "subscribed"
    | "subscribed_failed"
    | "unsubscribed"
    | "unsubscribed_failed";
  feed: string;
  product_ids: string[];
};

export type Side = "sell" | "buy";
export type TupleOrder = [number, number];

// Snapshot
export type SnapshotFeedPayload = {
  feed: "book_ui_1_snapshot";
  numLevels: number;
  product_id: string;
  timestamp: number;
  seq: number;
  bids: TupleOrder[];
  asks: TupleOrder[];
};

// Updates
export type FeedPayload = {
  feed: "book_ui_1";
  product_id: string;
  side: Side;
  seq: number;
  bids: TupleOrder[];
  asks: TupleOrder[];
};

// Failure
export type FeedError = {
  event: "error";
  message: string;
};

export type Order = {
  price: number;
  size: number;
  total: number;
};

// Websocket status
export type WsStatus = "connected" | "disconnected";

// Product (asset pair)
export type ProductStatus = "subscribed" | "unsubscribed";
export type Product = {
  id: string;
  status: ProductStatus;
};

export type OrderBookState = {
  bids: Map<number, Order>;
  asks: Map<number, Order>;
  numLevels: number;
};

// FeedService communicates with FeedContext via this callback func
export type CallbackPayload =
  | {
      event: "snapshot";
      payload: OrderBookState;
    }
  | {
      event: "update";
      payload: { bids: TupleOrder[]; asks: TupleOrder[] };
    }
  | {
      event: "status";
      payload: WsStatus;
    }
  | {
      event: "subscribed" | "unsubscribed";
      payload: string;
    };

export type FeedServiceCallback = (p: CallbackPayload) => void;

// Numbers formatter
export interface IFormatter {
  (value: number): string;
}

export type Tolerance = {
  precision: number;
  minPrecision: number;
};

export type NumberFormat = {
  // Rendering mode
  format: "default" | "percent";
  // Min fractional digits
  minPrecision: number;
  // Max fractional digits
  precision: number;
  // Fraction separator
  fractionSeparator: string;
  // Thousands separator
  thousandSeparator: string;
};
