package com.grocery.servlets;

import com.grocery.db.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String username = req.getParameter("username").trim();
        String email    = req.getParameter("email").trim();
        String password = req.getParameter("password").trim();
        String confirm  = req.getParameter("confirm").trim();
        String role     = req.getParameter("role");

        // Password match check
        if (!password.equals(confirm)) {
            req.setAttribute("error", "Passwords do not match!");
            req.getRequestDispatcher("register.jsp").forward(req, res);
            return;
        }

        String checkSql  = "SELECT user_id FROM users WHERE username=? OR email=?";
        String insertSql = "INSERT INTO users(username,password_hash,email,role) VALUES(?,?,?,?)";

        try (Connection conn = DBConnection.getConnection()) {

            PreparedStatement check = conn.prepareStatement(checkSql);
            check.setString(1, username);
            check.setString(2, email);
            ResultSet rs = check.executeQuery();

            if (rs.next()) {
                req.setAttribute("error", "Username or Email already exists!");
                req.getRequestDispatcher("register.jsp").forward(req, res);
                return;
            }

            PreparedStatement ps = conn.prepareStatement(insertSql);
            ps.setString(1, username);
            ps.setString(2, password);
            ps.setString(3, email);
            ps.setString(4, role);
            ps.executeUpdate();

            req.setAttribute("success", "Account created! Please login.");
            req.getRequestDispatcher("login.jsp").forward(req, res);

        } catch (SQLException e) {
            e.printStackTrace();
            req.setAttribute("error", "Database error: " + e.getMessage());
            req.getRequestDispatcher("register.jsp").forward(req, res);
        }
    }
}