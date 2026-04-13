<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $title = trim($_POST['title'] ?? '');
    $author = trim($_POST['author_name'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $edition = trim($_POST['edition'] ?? '');
    $price = floatval($_POST['price'] ?? 0);
    $isbn = trim($_POST['isbn'] ?? '');
    $publisher_id = intval($_POST['publisher_id'] ?? 0);

    if (empty($title) || $id <= 0) {
        die("Invalid data.");
    }

    $stmt = $conn->prepare("UPDATE books SET title=?, author_name=?, category=?, edition=?, price=?, isbn=?, publisher_id=? WHERE book_id=?");
    $stmt->bind_param("ssssdsii", $title, $author, $category, $edition, $price, $isbn, $publisher_id ?: null, $id);

    if ($stmt->execute()) {
        header("Location: ../../admin/books/manage.php?updated=1");
    } else {
        die("Error updating book: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/books/manage.php");
}
?>
