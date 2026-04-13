import requests
try:
    res = requests.post('http://localhost:5000/seed')
    print("Seeded:", res.json())
except Exception as e:
    print("Error:", e)
