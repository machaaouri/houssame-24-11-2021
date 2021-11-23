import { Queue } from "../helpers/queue";
import {
  FeedPayload,
  FeedServiceCallback,
  SnapshotFeedPayload,
  TupleOrder,
} from "../types";
import { toOrderBookState } from "../utils/feed.utils";

export class FeedService extends WebSocket {
  private currentProduct: string | null = null;
  private queue = new Queue<{ bids: TupleOrder[]; asks: TupleOrder[] }>();
  private intervalRef;

  constructor(url: string, callback: FeedServiceCallback) {
    super(url);
    // Events & Feed
    this.onmessage = (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      // Process events
      if (data.event) {
        if (data.event === "subscribed" || data.event === "unsubscribed")
          callback({ event: data.event, payload: data.product_ids[0] });
      }
      // Process feeds
      else if (data.feed) {
        if (data.feed === "book_ui_1_snapshot") {
          callback({
            event: "snapshot",
            payload: toOrderBookState(data as SnapshotFeedPayload),
          });
        } else if (
          data.feed === "book_ui_1" &&
          data.product_id === this.currentProduct
        ) {
          const { bids, asks } = data as FeedPayload;
          this.queue.enqueue({ bids, asks });
        }
      }
    };

    this.onopen = (ev: Event) => {
      console.log("Socket connected");
      callback({ event: "status", payload: "connected" });
    };

    this.onclose = (ev: CloseEvent) => {
      console.log("Socket closed");
      clearInterval(this.intervalRef);
      callback({ event: "status", payload: "disconnected" });
    };

    this.onerror = (ev: Event) => {
      console.error(ev);
    };

    this.intervalRef = setInterval(() => {
      try {
        const orders: { bids: TupleOrder[]; asks: TupleOrder[] } = {
          bids: [],
          asks: [],
        };
        const updates = this.queue.dequeue(this.queue.size());
        for (const item of updates) {
          item.bids && orders.bids.push(...item.bids);
          item.asks && orders.asks.push(...item.asks);
        }
        callback({ event: "update", payload: orders });
      } catch {
        console.error("Error while processing feed updates");
      }
    }, 100);
  }

  message = (event: "subscribe" | "unsubscribe", product_id: string) =>
    JSON.stringify({
      event,
      feed: "book_ui_1",
      product_ids: [product_id],
    });

  public subscribe(product_id: string) {
    try {
      console.log("Subscribing to", product_id);
      this.currentProduct = product_id;
      this.send(this.message("subscribe", product_id));
    } catch {
      console.error("Error while subscribing to", product_id);
    }
  }

  public unsubscribe(product_id: string) {
    try {
      console.log("Unsubscribing from", product_id);
      this.currentProduct = null;
      this.send(this.message("unsubscribe", product_id));
      this.queue.clear();
    } catch {
      console.error("Error while unsubscribing from", product_id);
    }
  }

  public disconnect() {
    try {
      this.close();
    } catch {
      console.error("Error while closing connection !");
    }
  }
}
