import { useEffect, useState } from "react";
import { StockData } from "../interfaces/stockInterfaces";
import { fetchFullStockData } from "../api/alphaVantage";

// We'll use these keys to store data and timestamps in localStorage
const LOCAL_STORAGE_DATA_KEY_PREFIX = "symbolData:";
const LOCAL_STORAGE_TIMESTAMP_KEY_PREFIX = "symbolDataTimestamp:";

// 1 day in milliseconds
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function useFetchStockData(symbol: string) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    const localDataKey = LOCAL_STORAGE_DATA_KEY_PREFIX + symbol;
    const localTimestampKey = LOCAL_STORAGE_TIMESTAMP_KEY_PREFIX + symbol;

    (async () => {
      try {
        // 1) Check if we have data in localStorage
        const cachedDataString = localStorage.getItem(localDataKey);
        const cachedTimestampString = localStorage.getItem(localTimestampKey);
        let cachedData: StockData | null = null;
        let cachedTimestamp = 0;

        if (cachedDataString && cachedTimestampString) {
          try {
            cachedData = JSON.parse(cachedDataString) as StockData;
            cachedTimestamp = parseInt(cachedTimestampString, 10);
          } catch (err) {
            console.warn("Failed to parse localStorage data", err);
          }
        }

        // 2) Check if data is still valid (< 24 hours old)
        const now = Date.now();
        const isValidCache = cachedData && cachedTimestamp && now - cachedTimestamp < ONE_DAY_MS;

        if (isValidCache) {
          // Serve from cache, no new API calls
          if (isMounted) {
            setStockData(cachedData || null);
          }
        } else {
          // Fetch fresh data from Alpha Vantage
          const data = await fetchFullStockData(symbol);
          if (!data) {
            throw new Error("No data returned (possible rate limit or invalid symbol).");
          }

          // Save fresh data and timestamp to localStorage
          localStorage.setItem(localDataKey, JSON.stringify(data));
          localStorage.setItem(localTimestampKey, now.toString());

          if (isMounted) {
            setStockData(data);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { stockData, loading, error };
}
