import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { config } from "../config";
import { usePageVisibility } from "../hooks/usePageVisibility";
import { FeedService } from "../services/feed.service";
import {
  CallbackPayload,
  Order,
  OrderBookState,
  Product,
  ProductStatus,
  WsStatus,
} from "../types";
import { updateOrderBookState } from "../utils/feed.utils";

const product_ids = config.REACT_APP_PRODUCT_IDS;
const url = config.REACT_APP_WS;

type ContextType = {
  connect: () => void;
  disconnect: () => void;
  toggleFeed: () => void;
  product: Product;
  status: WsStatus;
  orders: { bids: Order[]; asks: Order[] };
};

const defaultValue = {
  connect: () => {},
  disconnect: () => {},
  toggleFeed: () => {},
  status: "disconnected" as WsStatus,
  product: { id: product_ids[0], status: "unsubscribed" as ProductStatus },
  orders: { bids: [], asks: [], total: 0 },
};

const FeedContext = createContext<ContextType>(defaultValue);

export const useFeed = () => {
  return useContext(FeedContext);
};

export type Props = {
  children: ReactNode;
};

export const FeedProvider = (props: Props) => {
  const ws = useRef<FeedService>();
  const isVisible = usePageVisibility();
  const [status, setStatus] = useState<WsStatus>("disconnected");
  const [product, setProduct] = useState<Product>({
    id: product_ids[0],
    status: "unsubscribed",
  });

  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: new Map(),
    asks: new Map(),
    numLevels: 0,
  });

  useEffect(() => {
    connect();
    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (status === "connected") ws.current?.subscribe(product.id);
  }, [status]);

  useEffect(() => {
    if (!isVisible) disconnect();
  }, [isVisible]);

  function feedSericeEventHandler(props: CallbackPayload) {
    switch (props.event) {
      case "snapshot":
        setOrderBook(props.payload);
        break;
      case "update":
        const { bids, asks } = props.payload;
        setOrderBook((prev) => updateOrderBookState({ ...prev }, bids, asks));
        break;
      case "status":
        setStatus(props.payload);
        break;
      case "subscribed":
        console.log(props.payload, "subscribed");
        setProduct({ id: props.payload, status: "subscribed" });
        break;
      case "unsubscribed":
        console.log(props.payload, "unsubscribed");
        setProduct({ id: props.payload, status: "unsubscribed" });
        const newProduct = next(props.payload);
        newProduct && ws.current?.subscribe(newProduct);
        break;
      default:
        break;
    }
  }

  // Get the next product from the config
  function next(id: string) {
    let index = product_ids.indexOf(id);
    if (index > -1) {
      return product_ids[index + 1 >= product_ids.length ? 0 : ++index];
    }
    return undefined;
  }

  function connect() {
    try {
      ws.current = new FeedService(url, feedSericeEventHandler);
    } catch (e) {
      console.log("Error while instantiating FeedSocketClient");
    }
  }

  function disconnect() {
    ws.current?.disconnect();
  }

  function toggleFeed() {
    ws.current?.unsubscribe(product.id);
  }

  const value = {
    status,
    product,
    orders: {
      bids: Array.from(orderBook.bids.values()),
      asks: Array.from(orderBook.asks.values()),
    },
    connect,
    disconnect,
    toggleFeed,
  };

  return (
    <FeedContext.Provider value={value}>{props.children}</FeedContext.Provider>
  );
};
