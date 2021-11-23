import React, { ReactNode } from "react";
import { makeStyles, Switch } from "@material-ui/core";
import { useFeed } from "../../contexts/feed.context";

type TopBarProps = {
  title: string;
  children?: ReactNode;
};

const useStyles = makeStyles({
  root: {
    maxHeight: "50px",
    display: "flex",
    padding: "5px 15px",
    borderBottom: "1.5px solid #434651",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#d1d4dc;",
  },
  h2: { margin: 0, color: "#d1d4dc" },
  switchContainer: {
    color: "#e2444d",
    "& > .connected": { color: "#6ec877" },
  },
  switch_track: {
    backgroundColor: "#f50057",
  },
  switch_base: {
    color: "#e2444d",
    "&.Mui-disabled": {
      color: "#e886a9",
    },
    "&.Mui-checked": {
      color: "#6ec877",
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#4CAF50",
    },
  },
});

export const TopBar = (props: TopBarProps) => {
  const { product, status, connect, disconnect } = useFeed();
  const { root, h2, switchContainer, switch_base, switch_track } = useStyles();
  return (
    <div className={root}>
      <h2 className={h2}>{props.title}</h2>
      {props.children}
      <div className={switchContainer}>
        <Switch
          classes={{
            track: switch_track,
            switchBase: switch_base,
          }}
          checked={status === "connected"}
          onChange={() => {
            // Allow user to re-connect
            if (status === "disconnected") connect();
            else disconnect();
          }}
        />
        <span className={status}>{product.id}</span>
      </div>
    </div>
  );
};
