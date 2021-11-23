import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { TopBar } from "../../components/TopBar";
import { OrderList } from "../../components/OrderList";
import "./OrderBook.scss";
import { BottomBar } from "../../components/BottomBar";
import { Spread } from "../../components/Spread";
import { useFeed } from "../../contexts/feed.context";
import { getMaxRows, getTotal, rowHeight } from "../../utils/orderbook.utils";

const titles = ["PRICE", "SIZE", "TOTAL"];

export const OrderBook = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: 500 });
  const [height, setHeight] = useState(0);
  const { orders, status } = useFeed();
  const { bids, asks } = orders;

  const newHeight = useCallback(() => {
    setHeight(ref.current?.clientHeight || 0);
  }, [setHeight]);

  useEffect(() => {
    setHeight(ref.current?.clientHeight || 0);
    window.addEventListener("resize", newHeight);
    return () => {
      window.removeEventListener("resize", newHeight);
    };
  }, []);

  // Adjust maxRows depending on the list-container height
  const maxRows = getMaxRows(height, isMobile, bids.length, asks.length);
  const bidOrders = bids.slice(0, maxRows);
  const askOrders = asks.slice(0, maxRows);
  // Highest total in the book (totals of trimmed rows are excluded)
  const total = getTotal(bidOrders, askOrders);

  return (
    <div className="order-book" ref={ref}>
      <TopBar title="Order Book">
        {!isMobile && <Spread bid={bids[0]} ask={asks[0]} />}
      </TopBar>
      {height && (
        <div className={`list-container ${status}`}>
          <OrderList
            rowHeight={rowHeight}
            side="buy"
            orders={bidOrders}
            isMobile={isMobile}
            total={total}
            titles={titles}
            showTitles={!isMobile}
          />
          {isMobile && <Spread bid={bids[0]} ask={asks[0]} />}
          <OrderList
            rowHeight={rowHeight}
            side="sell"
            orders={askOrders}
            isMobile={isMobile}
            total={total}
            titles={titles}
            showTitles={true}
          />
        </div>
      )}
      <BottomBar />
    </div>
  );
};
