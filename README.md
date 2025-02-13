# Stock Analysis Web Application

A **React + TypeScript** application that retrieves **real-time** and **fundamental** data from [Alpha Vantage](https://www.alphavantage.co/), using a **client-side approach** where each user must provide their **own API key**. The app provides:

1. **Symbol Search** (cached in local storage)  
2. **Five-Year Financial Data** (Income Statement, Balance Sheet, Cash Flow)  
3. **Valuation Metrics** (Dividend, P/E, Shares Issued, etc.)  
4. **Analysis Scores** including a dynamically computed **Quick Scan Score**  
5. **Interactive Charts** via [Recharts](https://recharts.org/)

> **IMPORTANT**: Since Alpha Vantage has strict rate limits on its free tier, we cache multiple data points in local storage to avoid repeatedly calling the API. This helps stay under daily usage limits.


## Features

1. **API Key Input**:  
   - Instead of hardcoding an API key, you (or any user) can enter their **Alpha Vantage API key** into the app.  
   - The key is stored in **local storage**, so subsequent sessions remember it.

2. **Search**:  
   - Type a symbol keyword and press **Enter** to invoke the Alpha Vantage `SYMBOL_SEARCH` endpoint.  
   - The search results are **cached** in local storage so repeated queries don’t re-fetch.

3. **Data Fetching**:  
   - Once you select a symbol, the app calls up to **5 endpoints** (Overview, Global Quote, Income Statement, Balance Sheet, Cash Flow).  
   - We parse the **past 5 annual** statements to show revenue, net income, profit margin, debt ratio, and more.

4. **Quick Scan Score** (0–100%)  
   - **NEW**: Dynamically computed based on year-over-year improvements in key fundamentals. See details below.

5. **Caching**:  
   - The full data for each symbol is cached in local storage for **24 hours** (one day). If you re-check the same symbol within that period, no new API calls are made.  
   - Search queries are also cached, so typing the same query again won’t re-fire `SYMBOL_SEARCH`.

6. **Charts**:  
   - Plots up to 5 years of Revenue vs Net Income, Assets vs Liabilities, Profit Margin, Debt Ratio, FCF/Sales Ratio, etc.  
   - Each line has a unique color, and the years are sorted left-to-right in ascending order.


## Installation & Setup

1. **Clone the Repository** (or download the files):
   ```bash
   git clone https://github.com/<your-username>/stocks-quick-scan.git
   cd stocks-quick-scan
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Dev Server:**
   ```bash
   npm start
   ```

| Note: Because we now rely on a user-provided API key, there's no `.env` config needed. Just run the project, then enter your key in the UI.


## Usage

1. **Enter Your Alpha Vantage Key:**

   * On the home page, there’s an “API Key” box. Paste your Alpha Vantage key there and click Save Key.
   * If you don’t have one, sign up for free.

2. **Search for a Symbol:**

   * In the “Search or enter a stock symbol...” field, type something like “AAPL” or “AMZN” and press Enter.
   * The dropdown will appear with suggested matches. (This result is cached in local storage.)

3. **Select a Stock:**

   * Click on the desired symbol from the dropdown. The app fetches up to 5 endpoints from Alpha Vantage to gather data.
   * The data is then cached in local storage for 24 hours, so re-opening the same symbol soon won’t use new calls.

4. **View Data:**

   * Top: Ticker, Company Name, Current Price (auto-refresh every 60 seconds or manual “Refresh” button).
   * Left Column:
      * Tables for Income Statement, Balance Sheet, Cash Flow, Valuation.
      * Analysis Scores including Quick Scan Score.
   * Right Column:
      * Charts plotting 5-year trends (sorted ascending by year).


## Quick Scan Score Calculation

We compute a single 0–100% Quick Scan Score to show how the company’s fundamentals are trending:

* Positive Metrics (higher is better):
   1. Total Revenue
   1. Net Income
   1. Profit Margin
   1. Free Cash Flow

* Negative Metrics (lower is better):
   1. Total Liabilities
   1. Debt Ratio (Liabilities / Assets)

### How It Works

   1. We sort up to 5 years of data from oldest to newest.
   1. For each metric, we compare Year N to Year (N-1):
      * Positive Metric: If YearN > Year(N-1), that’s an improvement → +1 point.
      * Negative Metric: If YearN < Year(N-1), that’s an improvement → +1 point.
   1. We sum all points and divide by the total possible intervals to get a ratio. Multiply by 100 for a percentage.
   
| Example: If a company improves in 12 out of 16 total metric intervals, the Quick Scan Score = 12/16 × 100 = 75 %

A higher Quick Scan Score implies more consistent fundamental improvements across the selected metrics.


## Caching Mechanisms

   1. Symbol Search
      * Once you press Enter with a particular query, the SYMBOL_SEARCH result is saved in local storage.
      * Searching the same keyword again does not hit Alpha Vantage, even after a page refresh.
   1. Stock Data
      * When you pick a symbol, we do up to 5 API calls (Overview, Global Quote, Income Statement, Balance Sheet, Cash Flow).
      * The returned data is cached in local storage for 24 hours. If you re-check the same symbol within that time, no new calls are made.

With these caching layers, you can significantly reduce hitting Alpha Vantage’s daily or monthly rate limits.


## Future Enhancements

   1. Multiple Stock Comparison: Chart or table multiple symbols side-by-side.
   1. Export: Allow exporting the displayed data to PDF/Excel.
   1. Custom Date Ranges: Let users pick the exact start/end years or quarters.
   1. More Metrics: Incorporate ROE, EPS growth, or additional fundamental/technical indicators.
   1. Server-Side Proxy: If you’d prefer not to require each user’s key, you could add a tiny backend that stores your key securely.