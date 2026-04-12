<?php
require_once '../../config/db.php';
require_once '../../includes/auth_check.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $age = 18;

    if (empty($name) || empty($email) || empty($password)) {
        die("Name, email, and password are required.");
    }

    $stmt = $conn->prepare("INSERT INTO staff (name, age, email) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $name, $age, $email);

    if ($stmt->execute()) {
        header("Location: ../../admin/staff/manage.php?success=1");
    } else {
        die("Error adding staff: " . $conn->error);
    }
    $stmt->close();
} else {
    header("Location: ../../admin/staff/add.php");
}
?>
