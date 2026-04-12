<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.grocery.models.User" %>

<%
    User navUser = (User) session.getAttribute("loggedUser");

    if (navUser == null) {
        response.sendRedirect(request.getContextPath() + "/login.jsp");
        return;
    }

    String currentPage = request.getRequestURI();
%>

<link rel="stylesheet" href="<%= request.getContextPath() %>/css/style.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<nav class="gms-navbar">
    <a href="<%= request.getContextPath() %>/index.jsp" class="brand">
        <i class="fa-solid fa-basket-shopping"></i>
        Fresh<span>Mart</span>
    </a>

    <div class="nav-links">
        <a href="<%= request.getContextPath() %>/index.jsp"
           class="<%= currentPage.contains("index") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-house"></i> Home
        </a>

        <a href="<%= request.getContextPath() %>/inventory.jsp"
           class="<%= currentPage.contains("inventory") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-boxes-stacked"></i> Inventory
        </a>

        <a href="<%= request.getContextPath() %>/billing.jsp"
           class="<%= currentPage.contains("billing") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-receipt"></i> Billing
        </a>

        <a href="<%= request.getContextPath() %>/customers.jsp"
           class="<%= currentPage.contains("customers") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-users"></i> Customers
        </a>

        <a href="<%= request.getContextPath() %>/products.jsp"
           class="<%= currentPage.contains("products") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-store"></i> Products
        </a>

        <% if ("admin".equals(navUser.getRole())) { %>
        <a href="<%= request.getContextPath() %>/dashboard.jsp"
           class="<%= currentPage.contains("dashboard") ? "nav-pill active" : "" %>">
            <i class="fa-solid fa-chart-line"></i> Dashboard
        </a>
        <% } %>

        <div class="nav-user">
            <i class="fa-solid fa-circle-user"></i>
            <%= navUser.getUsername() %>

            <a href="<%= request.getContextPath() %>/LogoutServlet" class="btn-logout">
                <i class="fa-solid fa-right-from-bracket"></i>
            </a>
        </div>
    </div>
</nav>