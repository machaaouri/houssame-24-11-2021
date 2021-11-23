import { useEffect, useState } from "react";

// Get the name of the hidden property and the change event for visibility
const getPageProps = () => {
  if ((document as { [key: string]: any })["msHidden"])
    return {
      hidden: "msHidden",
      visibilityChange: "msvisibilitychange",
    };
  else if ((document as { [key: string]: any })["webkitHidden"])
    return {
      hidden: "webkitHidden",
      visibilityChange: "webkitvisibilitychange",
    };
  else
    return {
      hidden: "hidden",
      visibilityChange: "visibilitychange",
    };
};

export function usePageVisibility() {
  const { hidden, visibilityChange } = getPageProps();
  const [isVisible, setIsVisible] = useState(
    !(document as { [key: string]: any })[hidden]
  );
  const onVisibilityChange = () =>
    setIsVisible(!(document as { [key: string]: any })[hidden]);

  useEffect(() => {
    document.addEventListener(visibilityChange, onVisibilityChange, false);
    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange);
    };
  });

  return isVisible;
}
