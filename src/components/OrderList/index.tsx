import React from "react";
import { linearGradient } from "../../helpers/gradient";
import { Order, Side } from "../../types";
import { format, priceFormat } from "../../utils/format";
import "./OrderList.scss";

type ListProps = {
  rowHeight: number;
  side: Side;
  isMobile: boolean;
  orders: Order[];
  total: number;
  titles: string[];
  showTitles: boolean;
};

export const OrderList = (props: ListProps) => {
  const { side, isMobile, titles, showTitles, total } = props;
  const rootCls = `order-list ${isMobile && side === "sell" ? "reverse" : ""}`;

  const titlesRenderer = () => {
    if (!showTitles) return null;

    const cls = `titles ${side}`;
    return (
      <div className={cls}>
        {titles.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    );
  };

  const orderRenderer = (order: Order) => {
    const cls = `order ${side}`;
    const key = `${order.price}:${order.size}`;
    const depth = (order.total / total) * 100;

    const style: React.CSSProperties = {
      height: props.rowHeight,
      background: linearGradient({ side, depth, isMobile }),
    };

    return (
      <div key={key} className={cls} style={style}>
        <span className="price">{priceFormat(order.price)}</span>
        <span>{format(order.size)}</span>
        <span>{format(order.total)}</span>
      </div>
    );
  };

  return (
    <div className="order-list">
      {titlesRenderer()}
      <div className={rootCls}>{props.orders.map(orderRenderer)}</div>
    </div>
  );
};
