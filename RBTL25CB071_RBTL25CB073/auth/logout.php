<?php
session_start();
$_SESSION = []; // Clear all session variables
session_destroy();
header("Location: /library_management/auth/login.php");
exit();
?>