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
<meta charset="UTF-8"><title>Products — FreshMart</title></head>
<body>
<%@ include file="components/navbar.jsp" %>
<div class="page-wrapper">
    <div class="page-header">
        <div><h1><i class="fa-solid fa-store"></i> Products</h1><p>Add, edit and delete products</p></div>
    </div>

    <% if (msg   != null) { %><div class="alert-success"><i class="fa-solid fa-circle-check"></i> <%= msg %></div><% } %>
    <% if (error != null) { %><div class="alert-error"><i class="fa-solid fa-circle-exclamation"></i> <%= error %></div><% } %>

    <div style="display:grid; grid-template-columns:380px 1fr; gap:24px;">

        <!-- Add Product Form -->
        <div class="card">
            <h3 style="color:#2e7d32; margin-bottom:16px; font-size:1rem;"><i class="fa-solid fa-plus"></i> Add New Product</h3>
            <form action="ProductServlet" method="post">
                <input type="hidden" name="action" value="add">
                <div class="form-group">
                    <label>Product Name</label>
                    <div class="input-wrap"><i class="fa-solid fa-box input-icon"></i>
                    <input type="text" name="product_name" placeholder="Product name" required></div>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <div class="input-wrap"><i class="fa-solid fa-tags input-icon"></i>
                    <select name="category_id" required>
                        <option value="">-- Select Category --</option>
                        <%
                            try (Connection c = DBConnection.getConnection()) {
                                ResultSet cats = c.createStatement().executeQuery("SELECT * FROM categories ORDER BY category_name");
                                while (cats.next()) {
                        %>
                        <option value="<%= cats.getInt("category_id") %>"><%= cats.getString("category_name") %></option>
                        <% }} catch(Exception e){} %>
                    </select></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <div class="input-wrap"><i class="fa-solid fa-indian-rupee-sign input-icon"></i>
                        <input type="number" name="price" step="0.01" min="0" placeholder="0.00" required></div>
                    </div>
                    <div class="form-group">
                        <label>Stock Quantity</label>
                        <div class="input-wrap"><i class="fa-solid fa-hashtag input-icon"></i>
                        <input type="number" name="stock_quantity" min="0" placeholder="0" required></div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Unit</label>
                    <div class="input-wrap"><i class="fa-solid fa-weight-hanging input-icon"></i>
                    <select name="unit">
                        <option value="kg">kg</option>
                        <option value="litre">litre</option>
                        <option value="dozen">dozen</option>
                        <option value="pack">pack</option>
                        <option value="bundle">bundle</option>
                        <option value="piece">piece</option>
                        <option value="200g">200g</option>
                    </select></div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <div class="input-wrap"><i class="fa-solid fa-align-left input-icon"></i>
                    <input type="text" name="description" placeholder="Short description"></div>
                </div>
                <button type="submit" class="btn btn-green btn-wide"><i class="fa-solid fa-plus"></i> Add Product</button>
            </form>
        </div>

        <!-- Products Table -->
        <div class="table-card">
            <div class="table-header">
                <h3><i class="fa-solid fa-list"></i> All Products</h3>
                <div class="form-group" style="margin:0; width:220px;">
                    <div class="input-wrap"><i class="fa-solid fa-magnifying-glass input-icon"></i>
                    <input type="text" placeholder="Search..." oninput="searchProd(this.value)" id="prodSearch"></div>
                </div>
            </div>
            <table id="prodTable">
                <thead><tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Unit</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                <%
                    int sno = 1;
                    try (Connection c = DBConnection.getConnection()) {
                        ResultSet rs = c.createStatement().executeQuery(
                            "SELECT p.*, cat.category_name FROM products p JOIN categories cat ON p.category_id=cat.category_id ORDER BY p.product_name");
                        while (rs.next()) {
                            int qty = rs.getInt("stock_quantity");
                            String sc = qty == 0 ? "stock-out" : qty <= 10 ? "stock-low" : "stock-in";
                            String sl = qty == 0 ? "Out of Stock" : qty <= 10 ? "Low Stock" : "In Stock";
                %>
                <tr data-name="<%= rs.getString("product_name").toLowerCase() %>">
                    <td><%= sno++ %></td>
                    <td><strong><%= rs.getString("product_name") %></strong></td>
                    <td><%= rs.getString("category_name") %></td>
                    <td>₹<%= String.format("%.2f", rs.getDouble("price")) %></td>
                    <td><%= qty %></td>
                    <td><%= rs.getString("unit") %></td>
                    <td><span class="product-stock <%= sc %>"><%= sl %></span></td>
                    <td style="display:flex; gap:6px;">
                        <form action="ProductServlet" method="post" onsubmit="return confirm('Delete this product?')" style="display:inline;">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="product_id" value="<%= rs.getInt("product_id") %>">
                            <button type="submit" class="btn btn-red btn-sm"><i class="fa-solid fa-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <% }} catch(Exception e){ out.println("<tr><td colspan='8'>Error: "+e.getMessage()+"</td></tr>"); } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<%@ include file="components/footer.jsp" %>
<script>
function searchProd(val) {
    val = val.toLowerCase();
    document.querySelectorAll('#prodTable tbody tr').forEach(r => {
        r.style.display = r.dataset.name.includes(val) ? '' : 'none';
    });
}
</script>
</body>
</html>