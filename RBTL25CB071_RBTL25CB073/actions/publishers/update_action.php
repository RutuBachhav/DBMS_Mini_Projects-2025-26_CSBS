<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id'] ?? 0);
    $name = trim($_POST['name'] ?? '');
    $year = intval($_POST['year_of_publication'] ?? 0);

    if (empty($name) || $id <= 0) {
        die("Invalid data.");
    }

    $stmt = $conn->prepare("UPDATE publishers SET name=?, year_of_publication=? WHERE publisher_id=?");
    $stmt->bind_param("sii", $name, $year ?: null, $id);

    if ($stmt->execute()) {
        header("Location: ../../admin/publishers/manage.php?updated=1");
    } else {
        die("Error updating publisher: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/publishers/manage.php");
}
?>
