<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register — Grocery Management System</title>
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
        <a href="login.jsp">Login</a>
        <a href="register.jsp" class="active nav-pill">Register</a>
    </div>
</nav>

<!-- Register Card -->
<div class="auth-wrapper">
    <div class="auth-card" style="max-width:520px;">

        <div class="auth-icon">🌿</div>
        <h2>Create Account</h2>
        <p class="auth-sub">Register to access the grocery management system</p>

        <!-- Error / Success -->
        <% if (request.getAttribute("error") != null) { %>
            <div class="alert-error">
                <i class="fa-solid fa-circle-exclamation"></i>
                <%= request.getAttribute("error") %>
            </div>
        <% } %>

        <!-- Register Form -->
        <form action="RegisterServlet" method="post">

            <div class="form-group">
                <label for="username">Username</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-user input-icon"></i>
                    <input type="text" id="username" name="username"
                           placeholder="Choose a username" required autofocus>
                </div>
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-envelope input-icon"></i>
                    <input type="email" id="email" name="email"
                           placeholder="Enter your email" required>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-lock input-icon"></i>
                        <input type="password" id="password" name="password"
                               placeholder="Create password" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="confirm">Confirm Password</label>
                    <div class="input-wrap">
                        <i class="fa-solid fa-lock input-icon"></i>
                        <input type="password" id="confirm" name="confirm"
                               placeholder="Repeat password" required>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="role">Role</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-shield input-icon"></i>
                    <select id="role" name="role" required>
                        <option value="" disabled selected>Select role</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
            </div>

            <button type="submit" class="btn btn-green btn-wide">
                <i class="fa-solid fa-user-plus"></i> &nbsp;Create Account
            </button>
        </form>

        <div class="divider">or</div>

        <div class="auth-footer">
            Already have an account? <a href="login.jsp">Sign in here</a>
        </div>

    </div>
</div>

</body>
</html>