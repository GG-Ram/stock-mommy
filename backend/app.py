from flask import Flask, jsonify, request
from flask_cors import CORS
from stock import Stock
from user import User
from shopdata import products


app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})

STOCKS = {
    "AAPL": "Apple Inc.",
    "MSFT": "Microsoft Corp.",
    "GOOG": "Alphabet Inc.",
    "TSLA": "Tesla Inc.",
}
new_user = User(balance=5000)

@app.route("/api/stocks")
def get_stocks():
    result = []
    for symbol, name in STOCKS.items():
        try:
            stock = Stock(symbol, name)
            data = stock.last_n_minutes_data(100) #Change # of stocks here
            if data:  # Only append if data is valid
                result.append(data)
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            # Optionally return placeholder data
            result.append({
                "symbol": symbol,
                "name": name,
                "price": 0,
                "change": 0,
                "changePercent": 0,
                "graph": [0, 0, 0, 0, 0],
                "error": True
            })
    return jsonify(result)

@app.route("/api/userData")
def get_user_data():
 # CHANGE BALANCE HERE
    return jsonify(new_user.to_dict())

@app.route('/api/buy', methods=['POST'])
def buy_stock():
    try:
        # Get data from request body
        data = request.get_json()
        symbol = data.get('symbol')
        shares = data.get('shares')
        
        # Validate input
        if not symbol or not shares:
            return jsonify({"error": "Missing symbol or shares"}), 400
        
        if shares <= 0:
            return jsonify({"error": "Shares must be positive"}), 400
        
        # Get stock info
        stock = Stock(symbol, STOCKS.get(symbol, symbol))
        stock_data = stock.last_n_minutes_data(100)
        
        if not stock_data:
            return jsonify({"error": "Could not fetch stock data"}), 500
        
        # Set price on stock object
        stock.price = stock_data['price']
        
        # Buy the stock
        success = new_user.buy_stock(stock, shares)
        
        if success:
            return jsonify({
                "success": True,
                "message": f"Bought {shares} shares of {symbol}",
                "user": new_user.to_dict()
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Insufficient funds"
            }), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/api/sell', methods=['POST'] )
def sell_stock():
    try:  # ← Python uses colon, not curly brace
        # Get data from request body
        data = request.get_json()
        symbol = data.get('symbol')
        shares = data.get('shares')
        
        # Validate input
        if not symbol or not shares:
            return jsonify({"error": "Missing symbol or shares"}), 400
        
        if shares <= 0:
            return jsonify({"error": "Shares must be positive"}), 400
        
        # Get stock info
        stock = Stock(symbol, STOCKS.get(symbol, symbol))
        stock_data = stock.last_n_minutes_data(100)
        
        if not stock_data:
            return jsonify({"error": "Could not fetch stock data"}), 500
        
        # Set price on stock object
        stock.price = stock_data['price']
        
        # Sell the stock
        success = new_user.sell_stock(stock, shares)
        
        if success:
            return jsonify({
                "success": True,
                "message": f"Sold {shares} shares of {symbol}",
                "user": new_user.to_dict()
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Insufficient shares or stock not owned"
            }), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/getAccessories')
def fetchAccessories():
    return products

@app.route('/api/buyAccessory', methods=['POST'])
def buy_accessory():
    try:
        data = request.get_json()
        product_id = data.get('id')
        
        global products  # Allow modification of global products list
        
        # Call the buy_product method
        result = new_user.buy_product(product_id, products)
        
        return jsonify(result), 200 if result['success'] else 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'An error occurred'
        }), 500





if __name__ == "__main__":
    app.run(debug=True)
