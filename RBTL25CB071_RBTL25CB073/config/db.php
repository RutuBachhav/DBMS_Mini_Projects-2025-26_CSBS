<?php
$host = "127.0.0.1";
$port = 3307;
$user = "root";
$pass = "";
$db = "library_db";

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>