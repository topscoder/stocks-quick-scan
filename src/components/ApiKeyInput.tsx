import React, { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "alphaVantageApiKey";

interface ApiKeyInputProps {
  onApiKeySaved?: () => void; 
  // optional callback if you want to re-fetch data after the user saves the key
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySaved }) => {
  const [apiKey, setApiKey] = useState("");

  // Load the existing key from localStorage (if any)
  useEffect(() => {
    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, apiKey.trim());
    if (onApiKeySaved) {
      onApiKeySaved();
    }
  };

  return (
    <div className="mb-4 p-4 border rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Alpha Vantage API Key</h2>
      <p className="text-sm mb-2">
        Enter your Alpha Vantage API key to enable stock data fetching. 
        <a 
          href="https://www.alphavantage.co/support/#api-key" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 ml-1 underline"
        >
          (Get one here)
        </a>
      </p>
      <div className="flex items-center">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API key"
          className="border border-gray-300 rounded px-3 py-2 mr-2 w-full md:w-auto"
          style={{ minWidth: "250px" }}
        />
        <button
          onClick={handleSaveKey}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
