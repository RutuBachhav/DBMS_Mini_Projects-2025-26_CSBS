<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate inputs
    $title = trim($_POST['title'] ?? '');
    $author = trim($_POST['author'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $edition = trim($_POST['edition'] ?? '');
    $price = floatval($_POST['price'] ?? 0);
    $isbn = trim($_POST['isbn'] ?? '');
    $publisher_id = intval($_POST['publisher_id'] ?? 0);

    // Basic validation
    if (empty($title)) {
        die("Title is required.");
    }

    // Prepare and execute insert
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $stmt = $conn->prepare("INSERT INTO books (title, author_name, category, edition, price, isbn, publisher_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $publisher_id_param = $publisher_id > 0 ? $publisher_id : null;
    $stmt->bind_param("ssssdsi", $title, $author, $category, $edition, $price, $isbn, $publisher_id_param);

    try {
        $stmt->execute();
        header("Location: ../../admin/books/add.php?success=1");
        exit;
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            header("Location: ../../admin/books/add.php?error=duplicate");
            exit;
        }

        header("Location: ../../admin/books/add.php?error=general");
        exit;
    }
    $stmt->close();
} else {
    header("Location: ../../admin/books/add.php");
    exit;
}
?>
