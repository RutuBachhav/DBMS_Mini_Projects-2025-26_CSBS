<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['staff_id'] ?? 0);
    $name = trim($_POST['name'] ?? '');
    $age = intval($_POST['age'] ?? 0);

    if (empty($name) || $age <= 0 || $id <= 0) {
        die("Invalid data.");
    }

    $stmt = $conn->prepare("UPDATE staff SET name=?, age=? WHERE staff_id=?");
    $stmt->bind_param("sii", $name, $age, $id);

    if ($stmt->execute()) {
        header("Location: ../../admin/staff/manage.php?updated=1");
    } else {
        die("Error updating staff: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/staff/manage.php");
}
?>
