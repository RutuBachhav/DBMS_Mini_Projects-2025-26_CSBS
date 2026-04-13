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

$r = $conn->query("SELECT * FROM readers WHERE user_id=$id")->fetch_assoc();
if (!$r) {
    header("Location: manage.php");
    exit();
}
?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-user-edit"></i> Edit Reader</h2>

<form action="../../actions/readers/update_action.php" method="POST">
<input type="hidden" name="user_id" value="<?php echo $r['user_id']; ?>">

<div class="form-group">
<label for="first_name">First Name: <span style="color: #ef4444;">*</span></label>
<input type="text" id="first_name" name="first_name" value="<?php echo htmlspecialchars($r['first_name']); ?>" required style="width: 100%;">
</div>

<div class="form-group">
<label for="last_name">Last Name:</label>
<input type="text" id="last_name" name="last_name" value="<?php echo htmlspecialchars($r['last_name'] ?? ''); ?>" style="width: 100%;">
</div>

<div class="form-group">
<label for="email">Email: <span style="color: #ef4444;">*</span></label>
<input type="email" id="email" name="email" value="<?php echo htmlspecialchars($r['email']); ?>" required style="width: 100%;">
</div>

<div class="form-group">
<label for="phone">Phone:</label>
<input type="text" id="phone" name="phone" value="<?php echo htmlspecialchars($r['phone'] ?? ''); ?>" style="width: 100%;">
</div>

<div class="form-group">
<label for="address">Address:</label>
<textarea id="address" name="address" style="width: 100%;"><?php echo htmlspecialchars($r['address'] ?? ''); ?></textarea>
</div>

<button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Reader</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>