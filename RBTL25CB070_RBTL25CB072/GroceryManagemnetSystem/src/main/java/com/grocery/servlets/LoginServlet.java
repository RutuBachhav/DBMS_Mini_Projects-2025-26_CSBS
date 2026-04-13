package com.grocery.servlets;

import com.grocery.db.DBConnection;
import com.grocery.models.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String username = req.getParameter("username").trim();
        String password = req.getParameter("password").trim();

        String sql = "SELECT * FROM users WHERE username = ? AND password_hash = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, username);
            ps.setString(2, password);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                User user = new User(
                    rs.getInt("user_id"),
                    rs.getString("username"),
                    rs.getString("email"),
                    rs.getString("role")
                );

                HttpSession session = req.getSession();
                session.setAttribute("loggedUser", user);
                session.setAttribute("role", user.getRole());

                res.sendRedirect("index.jsp");

            } else {
                req.setAttribute("error", "Invalid username or password!");
                req.getRequestDispatcher("login.jsp").forward(req, res);
            }

        } catch (SQLException e) {
            e.printStackTrace();
            req.setAttribute("error", "Database error: " + e.getMessage());
            req.getRequestDispatcher("login.jsp").forward(req, res);
        }
    }
}