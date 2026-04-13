import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

print("Listing all databases:")
for db_name in client.list_database_names():
    db = client[db_name]
    cols = db.list_collection_names()
    print(f"Db: {db_name} | Collections: {cols}")
    if db_name == "canteen_db" or db_name == "test":
        for col_name in cols:
            count = db[col_name].count_documents({})
            print(f"  - {col_name}: {count} docs")
