from accessory import Accessory
from stock import Stock

class Portfolio_Stock:
    def __init__(self, shares, stock_data: Stock, buyPrice):
        self.shares = shares
        self.stock_data = stock_data 
        self.buyPrice = buyPrice
    
    def to_dict(self):
        return {
            "shares": self.shares,
            "stock_data": {
                "symbol": self.stock_data.symbol,
                "name": self.stock_data.name,
                "buyPrice": self.buyPrice
            },
        }

class User:
    def __init__(self, balance=500):
        self.balance = balance
        self.positions = []  # positions of stocks and number of shares
        self.inventory = []

    def buy_product(self, product_id, products_list):
        """
        Buy a product from the shop and add it to user's inventory.
        
        Args:
            product_id: The ID of the product to buy
            products_list: The list of available products
            
        Returns:
            dict: Status message with success/failure and details
        """
        # Find the product in the products list
        product = None
        product_index = None
        
        for i, item in enumerate(products_list):
            if item["id"] == product_id:
                product = item
                product_index = i
                break
        
        # Check if product exists
        if product is None:
            return {
                "success": False,
                "message": "Product not found!"
            }
        
        # Check if user has enough balance
        if self.balance < product["price"]:
            return {
                "success": False,
                "message": f"Not enough money! You need ${product['price']} but only have ${self.balance}"
            }
        
        # Deduct price from balance
        self.balance -= product["price"]
        
        # Remove product from shop
        products_list.pop(product_index)
        
        # Add product to user's inventory
        self.inventory.append(product)
        
        return {
            "success": True,
            "message": f"Successfully purchased {product['emoji']} {product['name']}!",
            "product": product,
            "new_balance": self.balance
        }

    def buy_stock(self, stock: Stock, shares):
        total_cost = stock.price * shares

        if self.balance < total_cost:
            return False
        for position in self.positions:
            if position.stock_data.symbol == stock.symbol:
                position.shares += shares
                self.balance -= total_cost
                return True
        new_position = Portfolio_Stock(shares=shares, stock_data=stock, buyPrice=stock.price)
        self.positions.append(new_position)
        self.balance -= total_cost
        return True
                
    def sell_stock(self, stock: Stock, shares):
        # Find the position
        for i, position in enumerate(self.positions):
            if position.stock_data.symbol == stock.symbol:
                if shares <= position.shares:
                    # Profit calculation using buy price stored in buyPrice
                    profit = (stock.price - position.buyPrice) * shares
                    #Profit is never used ^^^ only there for internal tracking
                    self.balance += stock.price * shares  # Update balance
                    position.shares -= shares
                    # Remove position if all shares sold
                    if position.shares == 0:
                        self.positions.pop(i)
                    return True  # Return profit if you want
                else:
                    return False  # Not enough shares
        return False  # Stock not in positions

    def to_dict(self):
        return {
            "balance": self.balance,
            "positions": [p.to_dict() for p in self.positions],
            "inventory": self.inventory  # ✅ Just use the list directly
        }