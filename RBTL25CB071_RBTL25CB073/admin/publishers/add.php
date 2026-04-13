<?php include('../../includes/auth_check.php'); ?>
<?php include('../../includes/header.php'); ?>
<?php include('../../includes/sidebar.php'); ?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-building"></i> Add Publisher</h2>

<form action="../../actions/publishers/add_action.php" method="POST">
<div class="form-group">
<label for="name">Name: <span style="color: #ef4444;">*</span></label>
<input type="text" id="name" name="name" required style="width: 100%;">
</div>

<div class="form-group">
<label for="year">Year of Publication:</label>
<input type="number" id="year" name="year_of_publication" min="1000" max="2100" style="width: 100%;">
</div>

<button type="submit" class="btn-primary"><i class="fas fa-building"></i> Add Publisher</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>