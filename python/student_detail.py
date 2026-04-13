def get_inputs(n):
    if n <= 0:
        return {}
    
    key = input("Enter name ")
    value = input("Enter score ")
    
    
    return {key: value, **get_inputs(n - 1)}

n = int(input("How many entries? "))
result_dict = get_inputs(n)
print("Final Dictionary:", result_dict)
