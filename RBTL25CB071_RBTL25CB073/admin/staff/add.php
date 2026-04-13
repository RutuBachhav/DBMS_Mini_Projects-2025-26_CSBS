<?php
include('../../includes/auth_check.php');
include('../../config/db.php');
include('../../includes/header.php');
include('../../includes/sidebar.php');
?>

<div class="content">

<div class="card">
<h2>Add Staff</h2>

<form action="../../actions/staff/add_action.php" method="POST">

    <label>Name</label>
    <input type="text" name="name" required>

    <label>Email</label>
    <input type="email" name="email" required>

    <label>Password</label>
    <input type="password" name="password" required>

    <button type="submit" class="btn">Add Staff</button>
</form>

<br>
<a href="/library_management/admin/dashboard.php" class="btn">← Dashboard</a>

</div>

</div>

<?php include('../../includes/footer.php'); ?>