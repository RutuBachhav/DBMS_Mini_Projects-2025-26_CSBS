<?php
include('../../config/db.php');
include('../../includes/auth_check.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');

$res = $conn->query("SELECT * FROM staff");
?>

<div class="content">
<div class="card">
<h2><i class="fas fa-user-tie"></i> Staff Management</h2>

<table>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>Age</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<?php while($s = $res->fetch_assoc()) { ?>
<tr>
<td><?php echo $s['staff_id']; ?></td>
<td><?php echo htmlspecialchars($s['name']); ?></td>
<td><?php echo $s['age']; ?></td>
<td>
<div class="action-buttons">
<a href="edit.php?id=<?php echo $s['staff_id']; ?>" class="btn-edit"><i class="fas fa-edit"></i> Edit</a>
<a href="delete.php?id=<?php echo $s['staff_id']; ?>" class="btn-delete" onclick="return confirm('Are you sure you want to delete this staff member?');"><i class="fas fa-trash"></i> Delete</a>
</div>
</td>
</tr>
<?php } ?>
</tbody>
</table>

</div>
</div>

<?php include('../../includes/footer.php'); ?>