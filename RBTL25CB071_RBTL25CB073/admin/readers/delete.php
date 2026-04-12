<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: manage.php");
    exit();
}

$stmt = $conn->prepare("DELETE FROM readers WHERE user_id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    header("Location: manage.php?deleted=1");
} else {
    die("Error deleting reader: " . $conn->error);
}
$stmt->close();
?>