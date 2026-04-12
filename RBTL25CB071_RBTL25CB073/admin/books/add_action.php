<?php
include('../../config/db.php');

$stmt = $conn->prepare("INSERT INTO books(title,author_name,category,edition,price,isbn) VALUES (?,?,?,?,?,?)");
$stmt->bind_param("ssssds",
$_POST['title'],
$_POST['author'],
$_POST['category'],
$_POST['edition'],
$_POST['price'],
$_POST['isbn']
);

$stmt->execute();
header("Location: ../../admin/books/manage.php");
?>