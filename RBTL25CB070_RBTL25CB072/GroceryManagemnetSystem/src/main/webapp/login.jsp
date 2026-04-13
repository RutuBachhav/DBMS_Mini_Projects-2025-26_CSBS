<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Grocery Management System</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>

<!-- Navbar -->
<nav class="gms-navbar">
    <a href="login.jsp" class="brand">
        <i class="fa-solid fa-basket-shopping"></i>
        Fresh<span>Mart</span>
    </a>
    <div class="nav-links">
        <a href="login.jsp" class="active nav-pill">Login</a>
        <a href="register.jsp">Register</a>
    </div>
</nav>

<!-- Login Card -->
<div class="auth-wrapper">
    <div class="auth-card">

        <div class="auth-icon">🛒</div>
        <h2>Welcome Back!</h2>
        <p class="auth-sub">Sign in to manage your grocery store</p>

        <!-- Error / Success Messages -->
        <% if (request.getAttribute("error") != null) { %>
            <div class="alert-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <%= request.getAttribute("error") %>
            </div>
        <% } %>
        <% if (request.getAttribute("success") != null) { %>
            <div class="alert-success">
                <i class="fa-solid fa-circle-check"></i>
                <%= request.getAttribute("success") %>
            </div>
        <% } %>

        <!-- Login Form -->
        <form action="LoginServlet" method="post">

            <div class="form-group">
                <label for="username">Username</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-user input-icon"></i>
                    <input type="text" id="username" name="username"
                           placeholder="Enter your username" required autofocus>
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-lock input-icon"></i>
                    <input type="password" id="password" name="password"
                           placeholder="Enter your password" required>
                </div>
            </div>

            <button type="submit"  class="btn btn-green btn-wide">
                <i class="fa-solid fa-right-to-bracket"></i> &nbsp;Sign In
            </button>
        </form>

        <div class="divider">or</div>

        <div class="auth-footer">
            Don't have an account? <a href="register.jsp">Register here</a>
        </div>

    </div>
</div>

</body>
</html>