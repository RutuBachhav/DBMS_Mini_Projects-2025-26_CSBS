<?php include('../../includes/auth_check.php'); ?>
<?php include('../../includes/header.php'); ?>
<?php include('../../includes/sidebar.php'); ?>
<?php
require_once '../../config/db.php';
$publishers = $conn->query("SELECT publisher_id, name FROM publishers ORDER BY name");
?>

<div class="content">
<?php if (isset($_GET['success']) && $_GET['success'] === '1'): ?>
    <div style="margin-bottom: 20px; padding: 16px 18px; border-radius: 14px; background: #d1fae5; color: #064e3b; border: 1px solid #a7f3d0;">
        Book added successfully.
    </div>
<?php elseif (isset($_GET['error']) && $_GET['error'] === 'duplicate'): ?>
    <div style="margin-bottom: 20px; padding: 16px 18px; border-radius: 14px; background: #fee2e2; color: #7f1d1d; border: 1px solid #fecaca;">
        ISBN already exists. Please use a different ISBN.
    </div>
<?php endif; ?>
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-book-plus"></i> Add Book</h2>

<form action="../../actions/books/add_action.php" method="POST">
<div class="form-group">
<label for="title">Title: <span style="color: #ef4444;">*</span></label>
<input type="text" id="title" name="title" required style="width: 100%;">
</div>

<div class="form-group">
<label for="author">Author:</label>
<input type="text" id="author" name="author_name" style="width: 100%;">
</div>

<div class="form-group">
<label for="category">Category:</label>
<input type="text" id="category" name="category" style="width: 100%;">
</div>

<div class="form-group">
<label for="edition">Edition:</label>
<input type="text" id="edition" name="edition" style="width: 100%;">
</div>

<div class="form-group">
<label for="price">Price:</label>
<input type="number" id="price" name="price" step="0.01" style="width: 100%;">
</div>

<div class="form-group">
<label for="isbn">ISBN:</label>
<input type="text" id="isbn" name="isbn" style="width: 100%;">
</div>

<div class="form-group">
<label for="publisher_id">Publisher:</label>
<select id="publisher_id" name="publisher_id" style="width: 100%;">
<option value="">-- Select Publisher --</option>
<?php while($pub = $publishers->fetch_assoc()): ?>
<option value="<?php echo $pub['publisher_id']; ?>"><?php echo htmlspecialchars($pub['name']); ?></option>
<?php endwhile; ?>
</select>
</div>

<button type="submit" class="btn-primary"><i class="fas fa-plus"></i> Add Book</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>