<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.grocery.db.DBConnection" %>
<%@ page import="com.grocery.models.User" %>
<%!
private String getEmoji(String name) {
    name = name.toLowerCase();
    // Fruits
    if (name.contains("apple"))       return "🍎";
    if (name.contains("banana"))      return "🍌";
    if (name.contains("mango"))       return "🥭";
    if (name.contains("orange"))      return "🍊";
    if (name.contains("grape"))       return "🍇";
    if (name.contains("watermelon"))  return "🍉";
    if (name.contains("strawberry"))  return "🍓";
    if (name.contains("pineapple"))   return "🍍";
    if (name.contains("lemon"))       return "🍋";
    if (name.contains("cherry"))      return "🍒";
    if (name.contains("peach"))       return "🍑";
    if (name.contains("pear"))        return "🍐";
    if (name.contains("coconut"))     return "🥥";
    if (name.contains("kiwi"))        return "🥝";
    if (name.contains("pomegranate")) return "🍎";
    if (name.contains("papaya"))      return "🥭";
    if (name.contains("guava"))       return "🍐";
    // Vegetables
    if (name.contains("tomato"))      return "🍅";
    if (name.contains("potato"))      return "🥔";
    if (name.contains("onion"))       return "🧅";
    if (name.contains("carrot"))      return "🥕";
    if (name.contains("broccoli"))    return "🥦";
    if (name.contains("spinach"))     return "🥬";
    if (name.contains("cabbage"))     return "🥬";
    if (name.contains("cauliflower")) return "🥦";
    if (name.contains("corn"))        return "🌽";
    if (name.contains("pepper"))      return "🫑";
    if (name.contains("chilli") || name.contains("chili")) return "🌶️";
    if (name.contains("garlic"))      return "🧄";
    if (name.contains("cucumber"))    return "🥒";
    if (name.contains("mushroom"))    return "🍄";
    if (name.contains("peas"))        return "🫛";
    if (name.contains("beans"))       return "🫘";
    if (name.contains("ginger"))      return "🫚";
    if (name.contains("ladyfinger") || name.contains("bhindi")) return "🥒";
    if (name.contains("radish"))      return "🌱";
    if (name.contains("beetroot"))    return "🟣";
    if (name.contains("pumpkin"))     return "🎃";
    // Dairy
    if (name.contains("milk"))        return "🥛";
    if (name.contains("paneer"))      return "🧀";
    if (name.contains("cheese"))      return "🧀";
    if (name.contains("butter"))      return "🧈";
    if (name.contains("curd") || name.contains("yogurt") || name.contains("dahi")) return "🥣";
    if (name.contains("cream"))       return "🍦";
    if (name.contains("egg"))         return "🥚";
    if (name.contains("ghee"))        return "🧈";
    // Grains & Pulses
    if (name.contains("rice"))        return "🍚";
    if (name.contains("wheat"))       return "🌾";
    if (name.contains("dal") || name.contains("daal") || name.contains("lentil")) return "🫘";
    if (name.contains("toor"))        return "🫘";
    if (name.contains("moong"))       return "🫘";
    if (name.contains("chana") || name.contains("chickpea")) return "🫘";
    if (name.contains("flour") || name.contains("atta") || name.contains("maida")) return "🌾";
    if (name.contains("oats"))        return "🥣";
    if (name.contains("bread"))       return "🍞";
    if (name.contains("roti") || name.contains("chapati")) return "🫓";
    if (name.contains("pasta") || name.contains("noodle") || name.contains("maggi")) return "🍝";
    if (name.contains("poha"))        return "🍚";
    if (name.contains("semolina") || name.contains("suji") || name.contains("rava")) return "🌾";
    // Beverages
    if (name.contains("juice"))       return "🧃";
    if (name.contains("water"))       return "💧";
    if (name.contains("tea"))         return "🍵";
    if (name.contains("coffee"))      return "☕";
    if (name.contains("cola") || name.contains("soda") || name.contains("soft drink")) return "🥤";
    if (name.contains("lassi"))       return "🥛";
    if (name.contains("energy drink") || name.contains("redbull")) return "🥤";
    if (name.contains("sharbat") || name.contains("sherbet")) return "🧃";
    // Snacks
    if (name.contains("chips") || name.contains("lays") || name.contains("kurkure")) return "🍟";
    if (name.contains("biscuit") || name.contains("cookie")) return "🍪";
    if (name.contains("namkeen") || name.contains("mixture")) return "🥨";
    if (name.contains("chocolate") || name.contains("choco")) return "🍫";
    if (name.contains("candy") || name.contains("toffee")) return "🍬";
    if (name.contains("popcorn"))     return "🍿";
    if (name.contains("cake"))        return "🎂";
    if (name.contains("wafer"))       return "🍪";
    if (name.contains("mathri"))      return "🥨";
    // Oils & Condiments
    if (name.contains("oil"))         return "🫙";
    if (name.contains("salt"))        return "🧂";
    if (name.contains("sugar"))       return "🍬";
    if (name.contains("honey"))       return "🍯";
    if (name.contains("jam"))         return "🍯";
    if (name.contains("pickle") || name.contains("achar")) return "🫙";
    if (name.contains("ketchup") || name.contains("sauce")) return "🥫";
    if (name.contains("vinegar"))     return "🫙";
    // Masala & Spices
    if (name.contains("masala"))      return "🌶️";
    if (name.contains("turmeric") || name.contains("haldi")) return "🟡";
    if (name.contains("cumin") || name.contains("jeera"))    return "🌿";
    if (name.contains("coriander") || name.contains("dhania")) return "🌿";
    if (name.contains("cardamom") || name.contains("elaichi")) return "🌿";
    if (name.contains("pepper corn") || name.contains("kali mirch")) return "⚫";
    if (name.contains("cinnamon") || name.contains("dalchini")) return "🌿";
    if (name.contains("clove") || name.contains("laung"))    return "🌿";
    if (name.contains("bay leaf") || name.contains("tejpatta")) return "🌿";
    // Meat & Seafood
    if (name.contains("chicken"))     return "🍗";
    if (name.contains("fish"))        return "🐟";
    if (name.contains("mutton") || name.contains("lamb") || name.contains("meat")) return "🥩";
    if (name.contains("prawn") || name.contains("shrimp")) return "🦐";
    if (name.contains("crab"))        return "🦀";
    // Cleaning & Household
    if (name.contains("soap"))        return "🧼";
    if (name.contains("shampoo"))     return "🧴";
    if (name.contains("detergent") || name.contains("washing")) return "🫧";
    if (name.contains("toothpaste") || name.contains("brush")) return "🪥";
    if (name.contains("tissue") || name.contains("napkin")) return "🧻";
    // Default fallback
    return "🛒";
}
%>
<%
    User loggedUser = (User) session.getAttribute("loggedUser");
    if (loggedUser == null) { response.sendRedirect("login.jsp"); return; }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home — FreshMart</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
<%@ include file="components/navbar.jsp" %>

<div class="page-wrapper">

    <!-- Stats Row -->
    <div class="stats-grid">
        <%
            int totalProducts=0, totalCategories=0, totalCustomers=0, lowStock=0;
            try (Connection c = DBConnection.getConnection()) {
                ResultSet r1 = c.createStatement().executeQuery("SELECT COUNT(*) FROM products");
                if(r1.next()) totalProducts = r1.getInt(1);
                ResultSet r2 = c.createStatement().executeQuery("SELECT COUNT(*) FROM categories");
                if(r2.next()) totalCategories = r2.getInt(1);
                ResultSet r3 = c.createStatement().executeQuery("SELECT COUNT(*) FROM customers");
                if(r3.next()) totalCustomers = r3.getInt(1);
                ResultSet r4 = c.createStatement().executeQuery("SELECT COUNT(*) FROM products WHERE stock_quantity <= 10");
                if(r4.next()) lowStock = r4.getInt(1);
            } catch(Exception e) { e.printStackTrace(); }
        %>
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-solid fa-box"></i></div>
            <div class="stat-info"><h3><%= totalProducts %></h3><p>Total Products</p></div>
        </div>
        <div class="stat-card orange">
            <div class="stat-icon"><i class="fa-solid fa-tags"></i></div>
            <div class="stat-info"><h3><%= totalCategories %></h3><p>Categories</p></div>
        </div>
        <div class="stat-card blue">
            <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
            <div class="stat-info"><h3><%= totalCustomers %></h3><p>Customers</p></div>
        </div>
        <div class="stat-card red">
            <div class="stat-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="stat-info"><h3><%= lowStock %></h3><p>Low Stock Items</p></div>
        </div>
    </div>

    <!-- Page Header -->
    <div class="page-header">
        <div>
            <h1><i class="fa-solid fa-store"></i> Grocery Items</h1>
            <p>Browse all available products by category</p>
        </div>
        <a href="products.jsp" class="btn btn-green">
            <i class="fa-solid fa-plus"></i> Add Product
        </a>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
        <button class="cat-tab active" onclick="filterCategory('all', this)">
            <i class="fa-solid fa-border-all"></i> All
        </button>
        <%
            try (Connection c = DBConnection.getConnection()) {
                ResultSet cats = c.createStatement().executeQuery(
                    "SELECT * FROM categories ORDER BY category_name");
                while (cats.next()) {
        %>
        <button class="cat-tab"
                onclick="filterCategory('<%= cats.getString("category_name").toLowerCase() %>', this)">
            <i class="fa-solid fa-leaf"></i> <%= cats.getString("category_name") %>
        </button>
        <% }} catch(Exception e){} %>
    </div>

    <!-- Search Bar -->
    <div style="margin-bottom:20px;">
        <div class="form-group" style="margin:0; max-width:360px;">
            <div class="input-wrap">
                <i class="fa-solid fa-magnifying-glass input-icon"></i>
                <input type="text" id="searchInput"
                       placeholder="Search products..."
                       oninput="searchProducts(this.value)">
            </div>
        </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid" id="productsGrid">
        <%
            try (Connection c = DBConnection.getConnection()) {
                ResultSet ps = c.createStatement().executeQuery(
                    "SELECT p.*, cat.category_name " +
                    "FROM products p " +
                    "JOIN categories cat ON p.category_id = cat.category_id " +
                    "ORDER BY p.product_name");
                while (ps.next()) {
                    int qty        = ps.getInt("stock_quantity");
                    String stockClass = qty == 0  ? "stock-out" :
                                       qty <= 10  ? "stock-low" : "stock-in";
                    String stockLabel = qty == 0  ? "Out of Stock" :
                                       qty <= 10  ? "Low Stock"    : "In Stock";
                    String emoji   = getEmoji(ps.getString("product_name"));
        %>
        <div class="product-card"
             data-category="<%= ps.getString("category_name").toLowerCase() %>"
             data-name="<%= ps.getString("product_name").toLowerCase() %>">

            <%-- Stock badge --%>
            <% if (qty > 0 && qty <= 10) { %>
                <span class="badge-new">Low</span>
            <% } else if (qty == 0) { %>
                <span class="badge-new" style="background:#c62828;">Out</span>
            <% } %>

            <div class="product-img"><%= emoji %></div>

            <div class="product-body">
                <div class="product-name"><%= ps.getString("product_name") %></div>
                <div class="product-category">
                    <i class="fa-solid fa-tag"></i> <%= ps.getString("category_name") %>
                </div>
                <div class="product-footer">
                    <span class="product-price">
                        ₹<%= String.format("%.2f", ps.getDouble("price")) %>
                    </span>
                    <span class="product-stock <%= stockClass %>">
                        <%= stockLabel %> (<%= qty %>)
                    </span>
                </div>
            </div>
        </div>
        <% }} catch(Exception e){ out.println("<p style='color:red;'>Error: " + e.getMessage() + "</p>"); } %>
    </div>

</div>

<%@ include file="components/footer.jsp" %>

<script>
function filterCategory(cat, btn) {
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display =
            (cat === 'all' || card.dataset.category === cat) ? 'block' : 'none';
    });
}

function searchProducts(val) {
    val = val.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = card.dataset.name.includes(val) ? 'block' : 'none';
    });
}
</script>
</body>
</html>