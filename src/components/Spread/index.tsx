import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Order } from "../../types";
import { delta, spreadFormat } from "../../utils/format";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "25px",
      alignItems: "center",
      justifyContent: "center",
      gap: "5px",
      color: "#787b86",
      fontSize: "14px",
      fontWeight: 700,
      "& > *": { flexBasis: "10%", textAlign: "center" },
    },
  })
);

export const Spread = (props: { bid: Order; ask: Order }) => {
  const { root } = useStyles();
  const { ask, bid } = props;
  if (!ask || !bid) return null;

  const spread = ask.price - bid.price;
  const diff = Math.abs(ask.price - bid.price) / ((ask.price + bid.price) / 2);
  return (
    <div className={root}>
      <span>Spread:</span>
      <span>{spreadFormat(spread)}</span>
      <span>({delta(diff)})</span>
    </div>
  );
};
