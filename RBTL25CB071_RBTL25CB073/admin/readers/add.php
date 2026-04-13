<?php include('../../includes/auth_check.php'); ?>
<?php include('../../includes/header.php'); ?>
<?php include('../../includes/sidebar.php'); ?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-user-plus"></i> Add Reader</h2>

<form action="../../actions/readers/add_action.php" method="POST">
<div class="form-group">
<label for="first_name">First Name: <span style="color: #ef4444;">*</span></label>
<input type="text" id="first_name" name="first_name" required style="width: 100%;">
</div>

<div class="form-group">
<label for="last_name">Last Name:</label>
<input type="text" id="last_name" name="last_name" style="width: 100%;">
</div>

<div class="form-group">
<label for="email">Email: <span style="color: #ef4444;">*</span></label>
<input type="email" id="email" name="email" required style="width: 100%;">
</div>

<div class="form-group">
<label for="phone">Phone:</label>
<input type="text" id="phone" name="phone" style="width: 100%;">
</div>

<div class="form-group">
<label for="address">Address:</label>
<textarea id="address" name="address" style="width: 100%;"></textarea>
</div>

<button type="submit" class="btn-primary"><i class="fas fa-user-plus"></i> Add Reader</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>