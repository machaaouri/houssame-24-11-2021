import { Side } from "../types";

const SELL_BACKGROUND = "#411B29";
const BUY_BACKGROUND = "#1A2D27";
const RIGHT = "to right";
const LEFT = "to left";

const gradient: {
  [key in "sell" | "buy"]: { direction: string; color: string };
} = {
  sell: { direction: RIGHT, color: SELL_BACKGROUND },
  buy: { direction: LEFT, color: BUY_BACKGROUND },
};

export const linearGradient = (props: {
  side: Side;
  depth: number;
  isMobile: boolean;
}) => {
  const direction = props.isMobile ? RIGHT : gradient[props.side].direction;
  return `linear-gradient(${direction}, 
        ${gradient[props.side].color} ${props.depth}%, transparent ${
    props.depth
  }%)`;
};
