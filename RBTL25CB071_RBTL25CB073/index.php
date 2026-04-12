<?php
session_start();
if (isset($_SESSION['admin'])) {
    header("Location: /library_management/admin/dashboard.php");
} else {
    header("Location: /library_management/auth/login.php");
}
exit();
?>
