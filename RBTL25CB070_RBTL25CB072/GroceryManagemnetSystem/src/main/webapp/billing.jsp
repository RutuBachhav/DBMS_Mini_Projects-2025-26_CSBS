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
    <title>Billing — FreshMart</title>
</head>
<body>
<%@ include file="components/navbar.jsp" %>

<div class="page-wrapper">
    <div class="page-header">
        <div>
            <h1><i class="fa-solid fa-receipt"></i> Billing</h1>
            <p>Create new bills and process payments</p>
        </div>
    </div>

    <!-- Bill Processing Banner -->
    <div class="bill-processing" id="billBanner" style="display:none;">
        <h3>🧾 Your bill is being generated now... ⏳</h3>
        <p>Please wait while we process your items and calculate the total.</p>
        <div style="margin-top:10px;">
            <div style="height:6px; background:#a5d6a7; border-radius:3px; overflow:hidden;">
                <div id="billProgress" style="height:100%; width:0%; background:#2e7d32; border-radius:3px; transition:width 1.5s ease;"></div>
            </div>
        </div>
    </div>

    <div class="billing-wrapper">

        <!-- LEFT: Add Items -->
        <div>
            <div class="card" style="margin-bottom:20px;">
                <h3 style="color:#2e7d32; margin-bottom:16px; font-size:1rem;">
                    <i class="fa-solid fa-user"></i> Customer Details
                </h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Select Customer</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-user input-icon"></i>
                            <select id="customerSelect">
                                <option value="">-- Walk-in Customer --</option>
                                <%
                                    try (Connection c = DBConnection.getConnection()) {
                                        ResultSet custs = c.createStatement().executeQuery("SELECT * FROM customers ORDER BY full_name");
                                        while (custs.next()) {
                                %>
                                <option value="<%= custs.getInt("customer_id") %>">
                                    <%= custs.getString("full_name") %> (<%= custs.getString("phone") %>)
                                </option>
                                <% }} catch(Exception e){} %>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Payment Method</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-credit-card input-icon"></i>
                            <select id="paymentMethod">
                                <option value="cash">💵 Cash</option>
                                <option value="card">💳 Card</option>
                                <option value="upi">📱 UPI</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3 style="color:#2e7d32; margin-bottom:16px; font-size:1rem;">
                    <i class="fa-solid fa-cart-plus"></i> Add Items to Bill
                </h3>
                <div class="form-row" style="margin-bottom:12px;">
                    <div class="form-group" style="margin:0;">
                        <label>Select Product</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-box input-icon"></i>
                            <select id="productSelect" onchange="updatePrice()">
                                <option value="">-- Select Product --</option>
                                <%
                                    try (Connection c = DBConnection.getConnection()) {
                                        ResultSet prods = c.createStatement().executeQuery(
                                            "SELECT * FROM products WHERE stock_quantity > 0 ORDER BY product_name");
                                        while (prods.next()) {
                                %>
                                <option value="<%= prods.getInt("product_id") %>"
                                        data-price="<%= prods.getDouble("price") %>"
                                        data-name="<%= prods.getString("product_name") %>"
                                        data-stock="<%= prods.getInt("stock_quantity") %>">
                                    <%= prods.getString("product_name") %> — ₹<%= prods.getDouble("price") %> (<%= prods.getInt("stock_quantity") %> left)
                                </option>
                                <% }} catch(Exception e){} %>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label>Quantity</label>
                        <div class="input-wrap">
                            <i class="fa-solid fa-hashtag input-icon"></i>
                            <input type="number" id="qtyInput" min="1" value="1" placeholder="Qty">
                        </div>
                    </div>
                </div>
                <button class="btn btn-green" onclick="addItem()">
                    <i class="fa-solid fa-plus"></i> Add to Bill
                </button>

                <!-- Bill Items Table -->
                <div class="bill-items" style="margin-top:20px;">
                    <table id="billTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="billBody">
                            <tr id="emptyRow">
                                <td colspan="5" style="text-align:center; color:#6c757d; padding:24px;">
                                    <i class="fa-solid fa-cart-shopping" style="font-size:2rem; opacity:0.3;"></i>
                                    <p style="margin-top:8px;">No items added yet</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- RIGHT: Bill Summary -->
        <div>
            <div class="card">
                <h3 style="color:#2e7d32; margin-bottom:16px; font-size:1rem;">
                    <i class="fa-solid fa-file-invoice-dollar"></i> Bill Summary
                </h3>
                <div class="bill-total-box">
                    <div class="bill-total-row"><span>Subtotal</span><span id="subtotalDisp">₹0.00</span></div>
                    <div class="bill-total-row">
                        <span>Discount (₹)</span>
                        <input type="number" id="discountInput" min="0" value="0"
                               style="width:80px; padding:4px 8px; border-radius:6px; border:1px solid #a5d6a7; text-align:right; font-family:'Poppins',sans-serif;"
                               oninput="recalc()">
                    </div>
                    <div class="bill-total-row"><span><strong>Total</strong></span><span id="totalDisp"><strong>₹0.00</strong></span></div>
                </div>
                <button class="btn btn-green btn-wide" style="margin-top:16px;" onclick="processBill()">
                    <i class="fa-solid fa-print"></i> Generate Bill
                </button>
                <button class="btn btn-outline btn-wide" style="margin-top:10px;" onclick="clearBill()">
                    <i class="fa-solid fa-trash"></i> Clear Bill
                </button>
            </div>

            <!-- Recent Sales -->
            <div class="card" style="margin-top:20px;">
                <h3 style="color:#2e7d32; margin-bottom:12px; font-size:0.95rem;">
                    <i class="fa-solid fa-clock-rotate-left"></i> Recent Bills
                </h3>
                <table>
                    <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                    <%
                        try (Connection c = DBConnection.getConnection()) {
                            ResultSet rs = c.createStatement().executeQuery(
                                "SELECT s.sale_id, COALESCE(cu.full_name,'Walk-in') as cname, s.final_amount, s.status " +
                                "FROM sales s LEFT JOIN customers cu ON s.customer_id=cu.customer_id " +
                                "ORDER BY s.sale_date DESC LIMIT 5");
                            while (rs.next()) {
                                String sc = "completed".equals(rs.getString("status")) ? "stock-in" :
                                            "pending".equals(rs.getString("status")) ? "stock-low" : "stock-out";
                    %>
                    <tr>
                        <td>#<%= rs.getInt("sale_id") %></td>
                        <td><%= rs.getString("cname") %></td>
                        <td>₹<%= String.format("%.2f", rs.getDouble("final_amount")) %></td>
                        <td><span class="product-stock <%= sc %>"><%= rs.getString("status") %></span></td>
                    </tr>
                    <% }} catch(Exception e){ out.println("<tr><td colspan='4'>No bills yet</td></tr>"); } %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<%@ include file="components/footer.jsp" %>

<script>
let billItems = [];
let subtotal = 0;

function updatePrice() {}

function addItem() {
    const sel = document.getElementById('productSelect');
    const opt = sel.options[sel.selectedIndex];
    if (!opt.value) { alert('Please select a product!'); return; }
    const qty = parseInt(document.getElementById('qtyInput').value);
    if (qty < 1) { alert('Quantity must be at least 1!'); return; }
    const price = parseFloat(opt.dataset.price);
    const stock = parseInt(opt.dataset.stock);
    if (qty > stock) { alert('Not enough stock! Available: ' + stock); return; }

    const existing = billItems.find(i => i.id === opt.value);
    if (existing) { existing.qty += qty; existing.sub = existing.price * existing.qty; }
    else { billItems.push({ id: opt.value, name: opt.dataset.name, price, qty, sub: price * qty }); }

    renderBill();
}

function renderBill() {
    const tbody = document.getElementById('billBody');
    if (billItems.length === 0) {
        tbody.innerHTML = '<tr id="emptyRow"><td colspan="5" style="text-align:center;color:#6c757d;padding:24px;"><i class="fa-solid fa-cart-shopping" style="font-size:2rem;opacity:0.3;"></i><p style="margin-top:8px;">No items added yet</p></td></tr>';
        subtotal = 0;
    } else {
        tbody.innerHTML = billItems.map((item, i) =>
            `<tr>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td><input type="number" min="1" value="${item.qty}" style="width:60px;padding:4px;border-radius:6px;border:1px solid #a5d6a7;text-align:center;" onchange="updateQty(${i}, this.value)"></td>
                <td>₹${item.sub.toFixed(2)}</td>
                <td><button class="btn btn-red btn-sm" onclick="removeItem(${i})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`
        ).join('');
        subtotal = billItems.reduce((s, i) => s + i.sub, 0);
    }
    recalc();
}

function updateQty(idx, val) {
    billItems[idx].qty = parseInt(val);
    billItems[idx].sub = billItems[idx].price * billItems[idx].qty;
    renderBill();
}

function removeItem(idx) { billItems.splice(idx, 1); renderBill(); }

function recalc() {
    const disc = parseFloat(document.getElementById('discountInput').value) || 0;
    const total = Math.max(0, subtotal - disc);
    document.getElementById('subtotalDisp').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('totalDisp').innerHTML = '<strong>₹' + total.toFixed(2) + '</strong>';
}

function processBill() {
    if (billItems.length === 0) { alert('Add items to the bill first!'); return; }
    const banner = document.getElementById('billBanner');
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth' });
    let w = 0;
    const interval = setInterval(() => {
        w += 10;
        document.getElementById('billProgress').style.width = w + '%';
        if (w >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                alert('✅ Bill Generated Successfully!\nTotal: ' + document.getElementById('totalDisp').innerText);
                clearBill();
                banner.style.display = 'none';
            }, 400);
        }
    }, 150);
}

function clearBill() {
    billItems = [];
    subtotal = 0;
    document.getElementById('discountInput').value = 0;
    renderBill();
}
</script>
</body>
</html>