
# MEAN, MEDIAN AND MODE OF A LIST OF NUMBERS

n=int(input("enter the number of terms "))
number =[]
for i in range(1,n+1):
    num=int(input())
    number.append(num)
print("numbers are: ", number)
a= sum(number)
mean=a/n
print("mean is: ",round(mean))
#  MEDIAN
number.sort()
print("numbers after sorting are: ", number)
if n % 2 != 0:
    median = (number[n//2] + number[n//2]) / 2
    print("median is", median)
else:
    median = number[n//2]
    print("median is: ", median)

# MODE
max_count = 0
modes = []

for num in number:
    count_num = number.count(num)
    if count_num > max_count:
        max_count = count_num
        modes = [num]
    elif count_num == max_count and num not in modes:
        modes.append(num)

if max_count == 1:
    print("Mode: No mode (all numbers occur only once)")
else:
    print("Mode(s):", modes)

