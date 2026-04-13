<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: managebook.php");
    exit();
}

$stmt = $conn->prepare("UPDATE issued_books SET return_date = CURDATE() WHERE id = ? AND return_date IS NULL");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    header("Location: managebook.php?returned=1");
} else {
    die("Error returning book: " . $conn->error);
}
$stmt->close();
?>