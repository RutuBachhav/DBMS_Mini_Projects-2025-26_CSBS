<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $year = intval($_POST['year_of_publication'] ?? 0);

    if (empty($name)) {
        die("Name is required.");
    }

    $publisher_year = $year > 0 ? $year : null;
    $stmt = $conn->prepare("INSERT INTO publishers (name, year_of_publication) VALUES (?, ?)");
    $stmt->bind_param("si", $name, $publisher_year);

    if ($stmt->execute()) {
        header("Location: ../../admin/publishers/manage.php?success=1");
    } else {
        die("Error adding publisher: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/publishers/add.php");
}
?>
