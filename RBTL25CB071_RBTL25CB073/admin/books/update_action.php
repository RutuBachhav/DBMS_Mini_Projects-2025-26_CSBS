<?php
include('../../config/db.php');

$conn->query("UPDATE books SET title='{$_POST['title']}' WHERE book_id={$_POST['id']}");
header("Location: ../../admin/books/manage.php");
?>