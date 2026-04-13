import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGO_URI")
client = MongoClient(uri)

print("Actual Cluster Hostname we are hitting:")
print(client.primary if client.primary else "Not yet connected")
print("\nListing ALL collections in the 'test' database:")
db = client.test
print(db.list_collection_names())

print("\nListing ALL databases again (with counts for 'test'):")
for db_name in client.list_database_names():
    db = client[db_name]
    print(f"Db: {db_name}")
    if db_name == "test":
        for col in db.list_collection_names():
            print(f"  - {col}: {db[col].count_documents({})} docs")
