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

$r = $conn->query("SELECT * FROM books WHERE book_id=$id")->fetch_assoc();
if (!$r) {
    header("Location: manage.php");
    exit();
}

$publishers = $conn->query("SELECT publisher_id, name FROM publishers ORDER BY name");
?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-book"></i> Edit Book</h2>

<form action="../../actions/books/update_action.php" method="POST">
<input type="hidden" name="id" value="<?php echo $r['book_id']; ?>">

<div class="form-group">
<label for="title">Title: <span style="color: #ef4444;">*</span></label>
<input type="text" id="title" name="title" value="<?php echo htmlspecialchars($r['title']); ?>" required>
</div>

<div class="form-group">
<label for="author">Author:</label>
<input type="text" id="author" name="author_name" value="<?php echo htmlspecialchars($r['author_name'] ?? ''); ?>">
</div>

<div class="form-group">
<label for="category">Category:</label>
<input type="text" id="category" name="category" value="<?php echo htmlspecialchars($r['category'] ?? ''); ?>">
</div>

<div class="form-group">
<label for="edition">Edition:</label>
<input type="text" id="edition" name="edition" value="<?php echo htmlspecialchars($r['edition'] ?? ''); ?>">
</div>

<div class="form-group">
<label for="price">Price:</label>
<input type="number" id="price" name="price" value="<?php echo $r['price']; ?>" step="0.01">
</div>

<div class="form-group">
<label for="isbn">ISBN:</label>
<input type="text" id="isbn" name="isbn" value="<?php echo htmlspecialchars($r['isbn'] ?? ''); ?>">
</div>

<div class="form-group">
<label for="publisher_id">Publisher:</label>
<select id="publisher_id" name="publisher_id">
<option value="">Select Publisher</option>
<?php while($pub = $publishers->fetch_assoc()): ?>
<option value="<?php echo $pub['publisher_id']; ?>" <?php echo ($pub['publisher_id'] == $r['publisher_id']) ? 'selected' : ''; ?>><?php echo htmlspecialchars($pub['name']); ?></option>
<?php endwhile; ?>
</select>
</div>

<button type="submit" class="btn-primary"><i class="fas fa-save"></i> Update Book</button>
</form>

</div>
</div>

<?php include('../../includes/footer.php'); ?>