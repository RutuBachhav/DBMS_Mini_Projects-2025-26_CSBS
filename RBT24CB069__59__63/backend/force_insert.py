import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.test

# Add a clearly identifiable test item
test_item = {
    "item_name": "Atlas Connection Test",
    "price": 1.0,
    "category": "Test",
    "available": True,
    "created_at": datetime.now(timezone.utc)
}

db.menus.insert_one(test_item)
print("Successfully inserted 'Atlas Connection Test' into the 'test' database!")
