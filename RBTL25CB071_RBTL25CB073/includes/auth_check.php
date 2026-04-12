<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if admin is logged in
if (!isset($_SESSION['admin']) || empty($_SESSION['admin'])) {
    // Redirect to login page
    header("Location: /library_management/auth/login.php");
    exit();
}

// Optional: Regenerate session ID for security
session_regenerate_id(true);

// Optional: Verify admin still exists in database (uncomment if needed)
/*
require_once '../config/db.php';
$stmt = $conn->prepare("SELECT id FROM admin WHERE username = ?");
$stmt->bind_param("s", $_SESSION['admin']);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    session_destroy();
    header("Location: /library_management/auth/login.php");
    exit();
}
$stmt->close();
*/
?>