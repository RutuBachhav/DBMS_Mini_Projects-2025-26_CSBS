<?php
include('../../config/db.php');
include('../../includes/auth_check.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');

$res = $conn->query("SELECT * FROM books");
?>

<div class="content">
<div class="card">
<h2><i class="fas fa-book"></i> Books Management</h2>

<table>
<thead>
<tr>
<th>ID</th>
<th>Title</th>
<th>Author</th>
<th>Category</th>
<th>ISBN</th>
<th>Price</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<?php while($row = $res->fetch_assoc()) { ?>
<tr>
<td><?php echo $row['book_id']; ?></td>
<td><?php echo htmlspecialchars($row['title']); ?></td>
<td><?php echo htmlspecialchars($row['author_name'] ?? '-'); ?></td>
<td><?php echo htmlspecialchars($row['category'] ?? '-'); ?></td>
<td><?php echo htmlspecialchars($row['isbn'] ?? '-'); ?></td>
<td>₹<?php echo number_format($row['price'], 2); ?></td>
<td>
<div class="action-buttons">
<a href="edit.php?id=<?php echo $row['book_id']; ?>" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
<a href="delete.php?id=<?php echo $row['book_id']; ?>" class="btn-delete" onclick="return confirm('Are you sure you want to delete this book?');"><i class="fas fa-trash"></i> Delete</a>
</div>
</td>
</tr>
<?php } ?>
</tbody>
</table>

</div>
</div>

<?php include('../../includes/footer.php'); ?>