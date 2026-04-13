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

$r = $conn->query("SELECT * FROM publishers WHERE publisher_id=$id")->fetch_assoc();
if (!$r) {
    header("Location: manage.php");
    exit();
}
?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-building"></i> Edit Publisher</h2>

<form action="../../actions/publishers/update_action.php" method="POST">
<input type="hidden" name="id" value="<?php echo $r['publisher_id']; ?>">

<div class="form-group">
<label for="name">Name: <span style="color: #ef4444;">*</span></label>
<input type="text" id="name" name="name" value="<?php echo htmlspecialchars($r['name']); ?>" required style="width: 100%;">
</div>

<div class="form-group">
<label for="year">Year of Publication:</label>
<input type="number" id="year" name="year_of_publication" value="<?php echo $r['year_of_publication']; ?>" min="1000" max="2100" style="width: 100%;">
</div>

<button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Publisher</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>
