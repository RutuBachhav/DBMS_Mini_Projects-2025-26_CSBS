<?php
include('../../config/db.php');
include('../../includes/auth_check.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');

$res = $conn->query("SELECT * FROM readers");
?>

<div class="content">
<div class="card">
<h2><i class="fas fa-users"></i> Readers Management</h2>

<table>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<?php while($r = $res->fetch_assoc()) { ?>
<tr>
<td><?php echo $r['user_id']; ?></td>
<td><?php echo htmlspecialchars($r['first_name'] . ' ' . $r['last_name']); ?></td>
<td><?php echo htmlspecialchars($r['email']); ?></td>
<td><?php echo htmlspecialchars($r['phone']); ?></td>
<td><span style="padding: 4px 12px; border-radius: 4px; background: #d1fae5; color: #065f46; font-size: 12px; font-weight: 600;">Active</span></td>
<td>
<div class="action-buttons">
<a href="edit.php?id=<?php echo $r['user_id']; ?>" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
<a href="delete.php?id=<?php echo $r['user_id']; ?>" class="btn-delete" onclick="return confirm('Are you sure you want to delete this reader?');"><i class="fas fa-trash"></i> Delete</a>
</div>
</td>
</tr>
<?php } ?>
</tbody>
</table>

</div>
</div>

<?php include('../../includes/footer.php'); ?>