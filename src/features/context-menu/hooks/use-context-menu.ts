import { useEffect } from "react";

export function useContextMenu() {
  useEffect(() => {
    const contextMenuHandler = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      event.preventDefault();
    };

    window.addEventListener("contextmenu", contextMenuHandler);

    return () => window.removeEventListener("contextmenu", contextMenuHandler);
  }, []);
}
