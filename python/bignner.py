# name = "Abhishek"
# age = 20
# height = 5.8

# print(name)
# print(age)
# print(height)

# name = input("Enter your name: ")
# print("Hello", name)

# age = int(input("Enter age: "))
# print(age)

# # Simple calculator
# a = 10
# b = 5

# print("Addition:", a + b)
# print("Subtraction:", a - b)
# print("Multiplication:", a * b)
# print("Division:", a / b)
# print("Modulus:", a % b)


# # Function to validate name input
# num = int(input("Enter a number: "))

# if num % 2 == 0:
#     print("Even Number")
# else:
#     print("Odd Number")

# # Function to validate marks input
# marks = int(input("Enter marks: "))

# if marks >= 90:
#     print("Grade A")
# elif marks >= 70:
#     print("Grade B")
# elif marks >= 50:
#     print("Grade C")
# else:
#     print("Fail")



# for i in range(5):
#     print(i)


# # Function 
# def greet():
#     print("Hello Abhishek")

# greet()


# # Function to check if a number is prime
# num = int(input("Enter number: "))
# flag = 0

# for i in range(2, num):
#     if num % i == 0:
#         flag = 1
#         break

# if flag == 0:
#     print("Prime Number")
# else:
#     print("Not Prime")


# #list of numbers
# numbers = [10, 20, 30, 40]

# total = 0

# for i in numbers:
#     total += i

# print("Sum:", total)


# Function to check if a number is palindrome
# num = int(input("Enter number: "))
# temp = num
# rev = 0

# while num > 0:
#     digit = num % 10
#     rev = rev * 10 + digit
#     num = num // 10

# if temp == rev:
#     print("Palindrome")
# else:
#     print("Not Palindrome")


# Fibonacci series
n = int(input("Enter number of terms: "))

a = 0
b = 1

for i in range(n):
    print(a)
    c = a + b
    a = b
    b = c
