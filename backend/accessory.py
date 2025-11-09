class Accessory:
    def __init__(self, name, price, front_img=None, back_img=None):
        self.name = name
        self.price = price
        self.front = front_img
        self.back = back_img

hat1 = Accessory("Cowboy", 67.00, "/assets/customizables/hat/hat_1.png")
print(hat1.name)
hat2 = Accessory("Witch", 67.00, "/assets/customizables/hat/hat_2.png")
print(hat2.name)
hair1 = Accessory("Hair A", 67.00, "/assets/customizables/hair_top/hat_1.png")
print(hat1.name)
hat2 = Accessory("Witch", 67.00, "/assets/customizables/hat/hat_2.png")
print(hat2.name)