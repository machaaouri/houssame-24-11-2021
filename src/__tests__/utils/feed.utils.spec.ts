import { SnapshotFeedPayload, TupleOrder } from "../../types";
import { toOrderBookState, updateOrderBookState } from "../../utils/feed.utils";

const bids: TupleOrder[] = [
  [57340.5, 300],
  [57340, 3840],
  [57337.5, 500],
  [57333, 450],
  [57332, 9104],
  [57331.5, 600],
  [57329, 4764],
  [57326, 15317],
  [57325.5, 10000],
  [57324, 10000],
];
const asks: TupleOrder[] = [
  [57354.5, 2687],
  [57368.5, 3840],
  [57369, 3387],
  [57370.5, 300],
  [57374.5, 2500],
  [57384, 62238],
  [57385, 600],
  [57389, 5000],
  [57389.5, 20000],
  [57391.5, 71429],
];

const mockSnapshot = (): SnapshotFeedPayload => {
  return {
    feed: "book_ui_1_snapshot",
    timestamp: 0,
    seq: 0,
    bids,
    asks,
    numLevels: 10,
    product_id: "PI_XBTUSD",
  };
};

describe("Feed snapshot", () => {
  const snapshot = { ...mockSnapshot() };
  const orderBookState = toOrderBookState(snapshot);

  test("Bids totals are correctly calculated", () => {
    expect(
      Array.from(orderBookState.bids.values()).map((bid) => bid.total)
    ).toEqual([
      300, 4140, 4640, 5090, 14194, 14794, 19558, 34875, 44875, 54875,
    ]);
  });

  test("Asks totals are correctly calculated", () => {
    expect(
      Array.from(orderBookState.asks.values()).map((ask) => ask.total)
    ).toEqual([
      2687, 6527, 9914, 10214, 12714, 74952, 75552, 80552, 100552, 171981,
    ]);
  });
});

describe("Feed update (size, total)", () => {
  const snapshot = { ...mockSnapshot() };
  const orderBookState = updateOrderBookState(
    toOrderBookState(snapshot),
    [
      [57340.5, 100],
      [57337.5, 600],
    ],
    [
      [57389.5, 5000],
      [57391.5, 60000],
    ]
  );

  test("Bids are correctly updated", () => {
    const newBids = [...bids];
    newBids[0][1] = 100;
    newBids[2][1] = 600;
    expect(
      Array.from(orderBookState.bids.values()).map(
        (bid) => [bid.price, bid.size] as TupleOrder
      )
    ).toEqual(newBids);
  });

  test("Asks are correctly updated", () => {
    const newAsks = [...asks];
    newAsks[8][1] = 5000;
    newAsks[9][1] = 60000;
    expect(
      Array.from(orderBookState.asks.values()).map(
        (ask) => [ask.price, ask.size] as TupleOrder
      )
    ).toEqual(newAsks);
  });

  test("Bid & ask totals are correctly updated", () => {
    expect({
      bidTotals: Array.from(orderBookState.bids.values()).map(
        (bid) => bid.total
      ),
      askTotals: Array.from(orderBookState.asks.values()).map(
        (ask) => ask.total
      ),
    }).toEqual({
      bidTotals: [
        100, 3940, 4540, 4990, 14094, 14694, 19458, 34775, 44775, 54775,
      ],
      askTotals: [
        2687, 6527, 9914, 10214, 12714, 74952, 75552, 80552, 85552, 145552,
      ],
    });
  });
});

describe("Feed Remove prices with zero size", () => {
  const snapshot = { ...mockSnapshot() };
  const orderBookState = updateOrderBookState(
    toOrderBookState(snapshot),
    [[57340.5, 0]],
    [[57354.5, 0]]
  );

  test("Prices with zero size are removed from the orderbook", () => {
    expect({
      bidPrices: Array.from(orderBookState.bids.values()).map(
        (bid) => bid.price
      ),
      askPrices: Array.from(orderBookState.asks.values()).map(
        (ask) => ask.price
      ),
    }).toEqual({
      bidPrices: [
        57340, 57337.5, 57333, 57332, 57331.5, 57329, 57326, 57325.5, 57324,
      ],
      askPrices: [
        57368.5, 57369, 57370.5, 57374.5, 57384, 57385, 57389, 57389.5, 57391.5,
      ],
    });
  });
});

describe("Add new prices", () => {
  const snapshot = { ...mockSnapshot() };
  const orderBookState = updateOrderBookState(
    toOrderBookState(snapshot),
    [[57338, 250]],
    [[57384.5, 10]]
  );

  test("New prices are inserted in the right spot (ordered) ", () => {
    expect({
      newBid: Array.from(orderBookState.bids.values()).map(
        (bid) => bid.price
      )[2],
      newAsk: Array.from(orderBookState.asks.values()).map(
        (ask) => ask.price
      )[6],
    }).toEqual({
      newBid: 57338,
      newAsk: 57384.5,
    });
  });
});
