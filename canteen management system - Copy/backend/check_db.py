import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)
db = client.canteen_db

print("Current database:", db.name)
print("\nAdmin collection count:", db.admin.count_documents({}))
print("Menu items count:", db.menu.count_documents({}))
print("Orders count:", db.orders.count_documents({}))

print("\nListing Menu items:")
for item in db.menu.find():
    print(f" - {item.get('item_name')} ({item.get('category')}) - ${item.get('price')}")
