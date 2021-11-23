import React from "react";
import { OrderBook } from "./pages/OrderBook";
import { FeedProvider } from "./contexts/feed.context";

const AppRenderer = () => {
  return (
    <FeedProvider>
      <OrderBook />
    </FeedProvider>
  );
};

const App = () => <AppRenderer />;

export default App;
