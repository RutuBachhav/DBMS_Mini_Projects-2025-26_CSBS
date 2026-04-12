<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = intval($_POST['user_id'] ?? 0);
    $book_id = intval($_POST['book_id'] ?? 0);
    $due_date = trim($_POST['due_date'] ?? '');

    if ($user_id <= 0 || $book_id <= 0 || empty($due_date)) {
        die("All fields are required.");
    }

    // Check if book is already issued
    $check = $conn->prepare("SELECT id FROM issued_books WHERE book_id = ? AND return_date IS NULL");
    $check->bind_param("i", $book_id);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        die("Book is already issued.");
    }
    $check->close();

    $stmt = $conn->prepare("INSERT INTO issued_books (user_id, book_id, due_date) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $user_id, $book_id, $due_date);

    if ($stmt->execute()) {
        header("Location: ../../admin/issued/managebook.php?success=1");
    } else {
        die("Error issuing book: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/issued/issuebook.php");
}
?>
