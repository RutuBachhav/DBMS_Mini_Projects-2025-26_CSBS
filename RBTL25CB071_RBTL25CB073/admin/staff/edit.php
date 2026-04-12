<?php
include('../../config/db.php');
include('../../includes/auth_check.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: manage.php");
    exit();
}

$r = $conn->query("SELECT * FROM staff WHERE staff_id=$id")->fetch_assoc();
if (!$r) {
    header("Location: manage.php");
    exit();
}
?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-user-edit"></i> Edit Staff</h2>

<form action="../../actions/staff/update_action.php" method="POST">
<input type="hidden" name="staff_id" value="<?php echo $r['staff_id']; ?>">

<div class="form-group">
<label for="name">Name: <span style="color: #ef4444;">*</span></label>
<input type="text" id="name" name="name" value="<?php echo htmlspecialchars($r['name']); ?>" required style="width: 100%;">
</div>

<div class="form-group">
<label for="age">Age: <span style="color: #ef4444;">*</span></label>
<input type="number" id="age" name="age" value="<?php echo $r['age']; ?>" min="18" max="100" required style="width: 100%;">
</div>

<button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Staff</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>
