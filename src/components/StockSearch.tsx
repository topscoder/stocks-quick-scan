import React, { useState, KeyboardEvent, useEffect } from "react";
import { searchSymbol } from "../api/alphaVantage";

interface StockSearchProps {
  onSelectSymbol: (symbol: string) => void;
}

type SearchResult = { symbol: string; name: string };
type SearchCache = Record<string, SearchResult[]>;

const LOCAL_STORAGE_KEY = "searchSymbolCache_v1";

const StockSearch: React.FC<StockSearchProps> = ({ onSelectSymbol }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // In-memory version of the cache
  const [cache, setCache] = useState<SearchCache>({});

  // 1) On mount, load any existing cache from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SearchCache;
        setCache(parsed);
      }
    } catch (err) {
      console.error("Failed to parse localStorage search cache:", err);
    }
  }, []);

  // 2) Keep localStorage in sync with the in-memory cache
  const saveToLocalStorage = (updatedCache: SearchCache) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCache));
    } catch (err) {
      console.error("Failed to save search cache:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Only search on ENTER
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!query.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      // Check if we have a cached result
      if (cache[query]) {
        setResults(cache[query]);
        setShowDropdown(true);
      } else {
        try {
          const data = await searchSymbol(query);
          // Update both in-memory cache and localStorage
          const updatedCache = { ...cache, [query]: data };
          setCache(updatedCache);
          saveToLocalStorage(updatedCache);

          setResults(data);
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed:", err);
          setResults([]);
          setShowDropdown(false);
        }
      }
    }
  };

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    setShowDropdown(false);
    onSelectSymbol(symbol);
  };

  return (
    <div className="relative w-full md:w-1/2 mb-4">
      <input
        type="text"
        placeholder="Search or enter a stock symbol..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-48 overflow-y-auto z-10">
          {results.map((item) => (
            <li
              key={item.symbol}
              onClick={() => handleSelect(item.symbol)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.symbol} - {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockSearch;
