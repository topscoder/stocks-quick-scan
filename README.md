# Stock Analysis Web Application

A **React + TypeScript** application for analyzing stock data from Alpha Vantage (and optionally Yahoo Finance as a fallback). This app demonstrates:

1. **Stock Ticker Search** with fuzzy matching.
2. **Company Overview** (current price, name, symbol).
3. **Financial Data**:
   - Income Statement (2020-2024)
   - Balance Sheet
   - Cash Flow
   - Valuation Metrics
4. **Analysis Scores** (quick scan score, return potential, etc.)
5. **Dynamic Charts** (using Recharts) for revenue, net income, profit margin, debt ratio, FCF ratios, etc.
6. **Auto-refresh** of the current price every 60 seconds.
7. **Performance** considerations (basic caching in a React hook, minimal loading states).

## Requirements

- [Node.js](https://nodejs.org/) (version 14 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation & Setup

1. **Clone the repository** (or copy the code to a local folder).

   ```bash
   git clone https://github.com/your-username/stock-analysis-webapp.git
   cd stock-analysis-webapp