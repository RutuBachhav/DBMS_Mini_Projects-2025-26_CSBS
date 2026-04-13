<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        die("Invalid ID.");
    }

    $stmt = $conn->prepare("UPDATE issued_books SET return_date = CURDATE() WHERE id = ? AND return_date IS NULL");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        header("Location: ../../admin/issued/managebook.php?returned=1");
    } else {
        die("Error returning book: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/issued/managebook.php");
}
?>
