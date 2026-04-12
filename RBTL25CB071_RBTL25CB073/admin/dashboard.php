<?php
include('../includes/auth_check.php');
include('../config/db.php');
include('../includes/header.php');
include('../includes/sidebar.php');
?>

<div class="content">

    <h1>Welcome, <?php echo htmlspecialchars($_SESSION['admin']); ?> 👋</h1>

    <?php
    $books = $conn->query("SELECT COUNT(*) as total FROM books")->fetch_assoc()['total'];
    $readers = $conn->query("SELECT COUNT(*) as total FROM readers")->fetch_assoc()['total'];
    $publishers = $conn->query("SELECT COUNT(*) as total FROM publishers")->fetch_assoc()['total'];
    $issued = $conn->query("SELECT COUNT(*) as total FROM issued_books WHERE return_date IS NULL")->fetch_assoc()['total'];
    ?>

    <div class="stats-grid">
        <div class="stat-card">
            <h3>📚 Books</h3>
            <div class="stat-number"><?php echo $books; ?></div>
        </div>

        <div class="stat-card">
            <h3>👥 Readers</h3>
            <div class="stat-number"><?php echo $readers; ?></div>
        </div>

        <div class="stat-card">
            <h3>🏢 Publishers</h3>
            <div class="stat-number"><?php echo $publishers; ?></div>
        </div>

        <div class="stat-card">
            <h3>📖 Issued</h3>
            <div class="stat-number"><?php echo $issued; ?></div>
        </div>
    </div>

    <div class="card">
        <h2>Quick Actions</h2>

        <a href="books/add.php" class="btn">Add Book</a>
        <a href="readers/add.php" class="btn">Add Reader</a>
        <a href="publishers/add.php" class="btn">Add Publisher</a>
        <a href="issued/issuebook.php" class="btn">Issue Book</a>
    </div>

</div>

<?php include('../includes/footer.php'); ?>