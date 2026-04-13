<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.grocery.db.DBConnection, com.grocery.models.User" %>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect("login.jsp"); return; }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <title>Inventory — FreshMart</title>
</head>
<body>
<%@ include file="components/navbar.jsp" %>

<div class="page-wrapper">
    <div class="page-header">
        <div>
            <h1><i class="fa-solid fa-boxes-stacked"></i> Inventory</h1>
            <p>Check stock availability of all products</p>
        </div>
        <a href="products.jsp" class="btn btn-green"><i class="fa-solid fa-plus"></i> Add Product</a>
    </div>

    <!-- Filter -->
    <div style="display:flex; gap:12px; margin-bottom:20px; align-items:center;">
        <div class="form-group" style="margin:0; flex:1; max-width:320px;">
            <div class="input-wrap">
                <i class="fa-solid fa-magnifying-glass input-icon"></i>
                <input type="text" id="invSearch" placeholder="Search product..." oninput="filterInv(this.value)">
            </div>
        </div>
        <select id="stockFilter" onchange="filterStock(this.value)" style="padding:10px 14px; border-radius:10px; border:1.5px solid #a5d6a7; background:#e8f5e9; font-family:'Poppins',sans-serif; font-size:0.88rem; color:#1b1b1b; outline:none;">
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
        </select>
    </div>

    <div class="table-card">
        <div class="table-header">
            <h3><i class="fa-solid fa-list"></i> Stock Availability</h3>
            <span style="font-size:0.82rem; color:#6c757d;">Live inventory status</span>
        </div>
        <table id="invTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Unit</th>
                    <th>Stock Qty</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            <%
                int sno = 1;
                try (Connection c = DBConnection.getConnection()) {
                    ResultSet rs = c.createStatement().executeQuery(
                        "SELECT p.*, cat.category_name FROM products p JOIN categories cat ON p.category_id=cat.category_id ORDER BY cat.category_name, p.product_name");
                    while (rs.next()) {
                        int qty = rs.getInt("stock_quantity");
                        String statusClass = qty == 0 ? "stock-out" : qty <= 10 ? "stock-low" : "stock-in";
                        String statusLabel = qty == 0 ? "Out of Stock" : qty <= 10 ? "Low Stock" : "In Stock";
                        String stockType   = qty == 0 ? "out" : qty <= 10 ? "low" : "in";
            %>
            <tr data-stock="<%= stockType %>" data-name="<%= rs.getString("product_name").toLowerCase() %>">
                <td><%= sno++ %></td>
                <td><strong><%= rs.getString("product_name") %></strong></td>
                <td><%= rs.getString("category_name") %></td>
                <td>₹<%= String.format("%.2f", rs.getDouble("price")) %></td>
                <td><%= rs.getString("unit") %></td>
                <td><strong><%= qty %></strong></td>
                <td><span class="product-stock <%= statusClass %>"><%= statusLabel %></span></td>
            </tr>
            <% }} catch(Exception e){ out.println("<tr><td colspan='7'>Error: "+e.getMessage()+"</td></tr>"); } %>
            </tbody>
        </table>
    </div>
</div>

<%@ include file="components/footer.jsp" %>

<script>
function filterInv(val) {
    val = val.toLowerCase();
    document.querySelectorAll('#invTable tbody tr').forEach(r => {
        r.style.display = r.dataset.name.includes(val) ? '' : 'none';
    });
}
function filterStock(val) {
    document.querySelectorAll('#invTable tbody tr').forEach(r => {
        r.style.display = (val === 'all' || r.dataset.stock === val) ? '' : 'none';
    });
}
</script>
</body>
</html>