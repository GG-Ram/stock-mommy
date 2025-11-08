from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)  # <- This allows all origins

# Example 5 stocks
STOCKS = {
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft Corp.",
    "GOOG": "Alphabet Inc.",
    "TSLA": "Tesla Inc.",
    "AMZN": "Amazon.com Inc."
}

@app.route("/api/stocks")
def last_5_minutes():
    result = []

    for symbol, name in STOCKS.items():
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d", interval="1m")
        
        
        last_5 = data.iloc[-5:]
        closes = last_5["Close"].tolist()
        
        price = closes[-1]
        change = closes[-1] - closes[0]
        change_percent = (change / closes[0]) * 100
        
        result.append({
            "symbol": symbol,
            "name": name,
            "price": round(price, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "graph": [round(c, 2) for c in closes]
        })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
