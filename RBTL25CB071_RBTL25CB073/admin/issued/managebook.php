<?php
include('../../config/db.php');
include('../../includes/auth_check.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');

$res = $conn->query("
SELECT issued_books.*, readers.first_name, readers.last_name, books.title
FROM issued_books
JOIN readers ON readers.user_id = issued_books.user_id
JOIN books ON books.book_id = issued_books.book_id
ORDER BY issued_books.issue_date DESC
");
?>

<div class="content">
<div class="card">
<h2><i class="fas fa-book-open"></i> Issued Books Management</h2>

<table>
<thead>
<tr>
<th>ID</th>
<th>Reader</th>
<th>Book</th>
<th>Issue Date</th>
<th>Due Date</th>
<th>Return Date</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<?php while($row = $res->fetch_assoc()) { ?>
<tr>
<td><?php echo $row['id']; ?></td>
<td><?php echo htmlspecialchars($row['first_name'] . ' ' . $row['last_name']); ?></td>
<td><?php echo htmlspecialchars($row['title']); ?></td>
<td><?php echo $row['issue_date']; ?></td>
<td><?php echo $row['due_date']; ?></td>
<td><?php echo ($row['return_date'] ?? '-'); ?></td>
<td>
<?php if(!$row['return_date']): ?>
<span style="padding: 4px 12px; border-radius: 4px; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600;">Issued</span>
<?php else: ?>
<span style="padding: 4px 12px; border-radius: 4px; background: #d1fae5; color: #065f46; font-size: 12px; font-weight: 600;">Returned</span>
<?php endif; ?>
</td>
<td>
<?php if(!$row['return_date']): ?>
<div class="action-buttons">
<form action="../../actions/issued/return_action.php" method="POST" style="display:inline;">
<input type="hidden" name="id" value="<?php echo $row['id']; ?>">
<button type="submit" class="btn-success" onclick="return confirm('Mark this book as returned?');" style="width: auto; padding: 8px 16px; font-size: 13px;"><i class="fas fa-undo"></i> Return</button>
</form>
</div>
<?php else: ?>
<span style="color: #999;">—</span>
<?php endif; ?>
</td>
</tr>
<?php } ?>
</tbody>
</table>

</div>
</div>

<?php include('../../includes/footer.php'); ?>