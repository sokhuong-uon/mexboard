import { useState, useCallback, useEffect } from "react";

export const PAGE_LIMIT_OPTIONS = [10, 15, 20, 50, 100] as const;

const DEFAULTS = {
  history_limit: 10,
} as const;

export const useSettings = () => {
  const [historyLimit, setHistoryLimitState] = useState<number>(
    DEFAULTS.history_limit,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setHistoryLimit = useCallback(async (limit: number) => {
    setHistoryLimitState(limit);
  }, []);

  return {
    historyLimit,
    setHistoryLimit,
    isLoaded,
  };
};
