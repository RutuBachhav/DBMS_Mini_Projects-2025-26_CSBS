# Sports Event Management System

def valid_name(message):
    while True:
        name = input(message).strip()

        # Reject empty input
        if name == "":
            print("Invalid input! Name cannot be empty.\n")
            continue

        # Check every character manually
        valid = True
        for ch in name:
            if ch < 'A' or (ch > 'Z' and ch < 'a') or ch > 'z':
                valid = False
                break

        if valid:
            return name
        else:
            print("Invalid input! Numbers or symbols not allowed.\n")


def valid_score():
    while True:
        try:
            score = float(input("Enter score: "))
            return score
        except:
            print("Invalid score! Enter numeric value only.\n")


def add_score(scores, participants):
    event = valid_name("Enter event name: ")
    student = valid_name("Enter student name: ")
    score = valid_score()

    if event not in scores:
        scores[event] = {}
        participants[event] = set()

    scores[event][student] = score
    participants[event].add(student)

    print("Score added successfully.\n")


def delete_student(scores, participants):
    event = valid_name("Enter event name: ")
    student = valid_name("Enter student name: ")

    if event in scores and student in scores[event]:
        del scores[event][student]
        participants[event].remove(student)
        print("Student deleted successfully.\n")
    else:
        print("Record not found.\n")


def filter_students(scores):
    event = valid_name("Enter event name: ")
    limit = valid_score()

    if event not in scores:
        print("Event not found.\n")
        return

    print("Students with score >= ", limit)
    for student in scores[event]:
        if scores[event][student] >= limit:
            print(student, ":", scores[event][student])
    print()


def set_operations(participants):
    event1 = valid_name("Enter first event: ")
    event2 = valid_name("Enter second event: ")

    if event1 not in participants or event2 not in participants:
        print("Event not found.\n")
        return

    print("Union:", participants[event1] | participants[event2])
    print("Intersection:", participants[event1] & participants[event2])
    print("Difference:", participants[event1] - participants[event2])
    print()


def aggregate_data(scores, participants):
    print("\n--- Aggregated Data ---")

    total = {}
    count = {}

    for event in scores:
        for student in scores[event]:
            if student not in total:
                total[student] = 0
                count[student] = 0
            total[student] += scores[event][student]
            count[student] += 1

    print("\nAverage Score per Student:")
    for student in total:
        print(student, ":", round(total[student] / count[student], 2))

    print("\nHighest & Lowest per Event:")
    for event in scores:
        values = scores[event].values()
        if values:
            print(event, "Highest:", max(values), "Lowest:", min(values))

    print("\nTotal Participants per Event:")
    for event in participants:
        print(event, ":", len(participants[event]))
    print()


def top_performers(scores):
    total = {}

    for event in scores:
        for student in scores[event]:
            if student not in total:
                total[student] = 0
            total[student] += scores[event][student]

    if not total:
        print("No data available.\n")
        return

    highest = max(total.values())
    print("Top Performer(s):")
    for student in total:
        if total[student] == highest:
            print(student, "with total score", highest)
    print()


def main():
    scores = {}
    participants = {}

    while True:
        print("""
--- Sports Event Management ---
1. Add / Update Score
2. Delete Student
3. Filter Students
4. Event Set Operations
5. View Aggregated Data
6. Top Performers
7. Exit
""")

        choice = input("Enter choice: ")

        if choice == "1":
            add_score(scores, participants)
        elif choice == "2":
            delete_student(scores, participants)
        elif choice == "3":
            filter_students(scores)
        elif choice == "4":
            set_operations(participants)
        elif choice == "5":
            aggregate_data(scores, participants)
        elif choice == "6":
            top_performers(scores)
        elif choice == "7":
            print("Program exited.")
            break
        else:
            print("Invalid choice!\n")


main()
