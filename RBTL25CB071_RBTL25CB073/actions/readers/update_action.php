<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['user_id'] ?? 0);
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');

    if (empty($first_name) || empty($email) || $id <= 0) {
        die("Invalid data.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }

    $stmt = $conn->prepare("UPDATE readers SET first_name=?, last_name=?, email=?, phone=?, address=? WHERE user_id=?");
    $stmt->bind_param("sssssi", $first_name, $last_name, $email, $phone, $address, $id);

    if ($stmt->execute()) {
        header("Location: ../../admin/readers/manage.php?updated=1");
    } else {
        die("Error updating reader: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/readers/manage.php");
}
?>
