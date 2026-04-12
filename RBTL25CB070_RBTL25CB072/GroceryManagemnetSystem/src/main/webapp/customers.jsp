<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.grocery.db.DBConnection, com.grocery.models.User" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect("login.jsp"); return; }
    String msg   = (String) request.getAttribute("success");
    String error = (String) request.getAttribute("error");
%>
<!DOCTYPE html>
<html lang="en">
<head>
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<meta charset="UTF-8"><title>Customers — FreshMart</title></head>
<body>
<%@ include file="components/navbar.jsp" %>
<div class="page-wrapper">
    <div class="page-header">
        <div>
            <h1><i class="fa-solid fa-users"></i> Customers</h1>
            <p>Manage customer records</p>
        </div>
    </div>

    <% if (msg   != null) { %><div class="alert-success"><i class="fa-solid fa-circle-check"></i> <%= msg %></div><% } %>
    <% if (error != null) { %><div class="alert-error"><i class="fa-solid fa-circle-exclamation"></i> <%= error %></div><% } %>

    <div style="display:grid; grid-template-columns:340px 1fr; gap:24px;">

        <!-- Add Customer Form -->
        <div class="card">
            <h3 style="color:#2e7d32; margin-bottom:16px; font-size:1rem;"><i class="fa-solid fa-user-plus"></i> Add Customer</h3>
            <form action="CustomerServlet" method="post">
                <input type="hidden" name="action" value="add">
                <div class="form-group">
                    <label>Full Name</label>
                    <div class="input-wrap"><i class="fa-solid fa-user input-icon"></i>
                    <input type="text" name="full_name" placeholder="Customer name" required></div>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <div class="input-wrap"><i class="fa-solid fa-phone input-icon"></i>
                    <input type="text" name="phone" placeholder="10-digit phone" required></div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <div class="input-wrap"><i class="fa-solid fa-envelope input-icon"></i>
                    <input type="email" name="email" placeholder="Email (optional)"></div>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <div class="input-wrap"><i class="fa-solid fa-location-dot input-icon"></i>
                    <input type="text" name="address" placeholder="Address"></div>
                </div>
                <button type="submit" class="btn btn-green btn-wide"><i class="fa-solid fa-plus"></i> Add Customer</button>
            </form>
        </div>

        <!-- Customers Table -->
        <div class="table-card">
            <div class="table-header">
                <h3><i class="fa-solid fa-list"></i> All Customers</h3>
                <div class="form-group" style="margin:0; width:220px;">
                    <div class="input-wrap"><i class="fa-solid fa-magnifying-glass input-icon"></i>
                    <input type="text" placeholder="Search..." oninput="searchCust(this.value)" id="custSearch"></div>
                </div>
            </div>
            <table id="custTable">
                <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Action</th></tr></thead>
                <tbody>
                <%
                    int sno = 1;
                    try (Connection c = DBConnection.getConnection()) {
                        ResultSet rs = c.createStatement().executeQuery("SELECT * FROM customers ORDER BY full_name");
                        while (rs.next()) {
                %>
                <tr data-name="<%= rs.getString("full_name").toLowerCase() %>">
                    <td><%= sno++ %></td>
                    <td><strong><%= rs.getString("full_name") %></strong></td>
                    <td><%= rs.getString("phone") %></td>
                    <td><%= rs.getString("email") != null ? rs.getString("email") : "—" %></td>
                    <td><%= rs.getString("address") != null ? rs.getString("address") : "—" %></td>
                    <td>
                        <form action="CustomerServlet" method="post" style="display:inline;" onsubmit="return confirm('Delete this customer?')">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="customer_id" value="<%= rs.getInt("customer_id") %>">
                            <button type="submit" class="btn btn-red btn-sm"><i class="fa-solid fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <% }} catch(Exception e){ out.println("<tr><td colspan='6'>Error: "+e.getMessage()+"</td></tr>"); } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<%@ include file="components/footer.jsp" %>
<script>
function searchCust(val) {
    val = val.toLowerCase();
    document.querySelectorAll('#custTable tbody tr').forEach(r => {
        r.style.display = r.dataset.name.includes(val) ? '' : 'none';
    });
}
</script>
</body>
</html>