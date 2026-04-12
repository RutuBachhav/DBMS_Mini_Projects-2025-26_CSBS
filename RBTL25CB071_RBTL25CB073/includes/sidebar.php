<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>

<div class="sidebar">
    <h2><i class="fas fa-book"></i> Library</h2>

    <a href="/library_management/admin/dashboard.php" title="Dashboard"><i class="fas fa-chart-line"></i> <span>Dashboard</span></a>

    <h3>Books</h3>
    <a href="/library_management/admin/books/add.php" title="Add Book"><i class="fas fa-plus-circle"></i> <span>Add Book</span></a>
    <a href="/library_management/admin/books/manage.php" title="Manage Books"><i class="fas fa-list"></i> <span>Manage Books</span></a>

    <h3>Readers</h3>
    <a href="/library_management/admin/readers/add.php" title="Add Reader"><i class="fas fa-user-plus"></i> <span>Add Reader</span></a>
    <a href="/library_management/admin/readers/manage.php" title="Manage Readers"><i class="fas fa-users"></i> <span>Manage Readers</span></a>

    <h3>Publisher</h3>
    <a href="/library_management/admin/publishers/add.php" title="Add Publisher"><i class="fas fa-building"></i> <span>Add Publisher</span></a>
    <a href="/library_management/admin/publishers/manage.php" title="Manage Publisher"><i class="fas fa-sitemap"></i> <span>Manage Publisher</span></a>

    <h3>Staff</h3>
    <a href="/library_management/admin/staff/add.php" title="Add Staff"><i class="fas fa-user-shield"></i> <span>Add Staff</span></a>
    <a href="/library_management/admin/staff/manage.php" title="Manage Staff"><i class="fas fa-user-tie"></i> <span>Manage Staff</span></a>

    <h3>Issue</h3>
    <a href="/library_management/admin/issued/issuebook.php" title="Issue Book"><i class="fas fa-arrow-right-to-bracket"></i> <span>Issue Book</span></a>
    <a href="/library_management/admin/issued/managebook.php" title="Issued Books"><i class="fas fa-book-open"></i> <span>Issued Books</span></a>

    <a href="/library_management/auth/logout.php" style="margin-top: 40px; border-top: 1px solid #334155; padding-top: 20px;" title="Logout"><i class="fas fa-sign-out-alt"></i> <span>Logout</span></a>
</div>