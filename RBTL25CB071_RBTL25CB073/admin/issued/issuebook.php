<?php include('../../includes/auth_check.php'); ?>
<?php include('../../includes/header.php'); ?>
<?php include('../../includes/sidebar.php'); ?>
<?php
require_once '../../config/db.php';
$users = $conn->query("SELECT user_id, CONCAT(first_name, ' ', last_name) AS name FROM readers ORDER BY name");
$books = $conn->query("SELECT book_id, title FROM books WHERE book_id NOT IN (SELECT book_id FROM issued_books WHERE return_date IS NULL) ORDER BY title");
?>

<div class="content">
<div class="form-wrapper">
<div class="card">
<h2><i class="fas fa-arrow-right-to-bracket"></i> Issue Book</h2>

<form action="../../actions/issued/issue_action.php" method="POST">
<div class="form-group">
<label for="user_id">Reader: <span style="color: #ef4444;">*</span></label>
<select id="user_id" name="user_id" required style="width: 100%;">
<option value="">-- Select Reader --</option>
<?php while($u = $users->fetch_assoc()): ?>
<option value="<?php echo $u['user_id']; ?>"><?php echo htmlspecialchars($u['name']); ?></option>
<?php endwhile; ?>
</select>
</div>

<div class="form-group">
<label for="book_id">Book: <span style="color: #ef4444;">*</span></label>
<select id="book_id" name="book_id" required style="width: 100%;">
<option value="">-- Select Book --</option>
<?php while($b = $books->fetch_assoc()): ?>
<option value="<?php echo $b['book_id']; ?>"><?php echo htmlspecialchars($b['title']); ?></option>
<?php endwhile; ?>
</select>
</div>

<div class="form-group">
<label for="due_date">Due Date: <span style="color: #ef4444;">*</span></label>
<input type="date" id="due_date" name="due_date" required style="width: 100%;">
</div>

<button type="submit" class="btn-primary"><i class="fas fa-arrow-right-to-bracket"></i> Issue Book</button>
</form>

</div>
</div>
</div>

<?php include('../../includes/footer.php'); ?>