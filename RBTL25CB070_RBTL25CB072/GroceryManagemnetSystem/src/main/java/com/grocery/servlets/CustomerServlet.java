package com.grocery.servlets;

import com.grocery.db.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/CustomerServlet")
public class CustomerServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String action = req.getParameter("action");

        if ("add".equals(action)) {
            String name    = req.getParameter("full_name").trim();
            String phone   = req.getParameter("phone").trim();
            String email   = req.getParameter("email").trim();
            String address = req.getParameter("address").trim();

            String sql = "INSERT INTO customers(full_name,phone,email,address) VALUES(?,?,?,?)";
            try (Connection c = DBConnection.getConnection();
                 PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setString(1, name);
                ps.setString(2, phone);
                ps.setString(3, email.isEmpty() ? null : email);
                ps.setString(4, address.isEmpty() ? null : address);
                ps.executeUpdate();
                req.setAttribute("success", "Customer '" + name + "' added!");
            } catch (SQLException e) {
                req.setAttribute("error", "Error: " + e.getMessage());
            }

        } else if ("delete".equals(action)) {
            int customerId = Integer.parseInt(req.getParameter("customer_id"));
            try (Connection c = DBConnection.getConnection();
                 PreparedStatement ps = c.prepareStatement("DELETE FROM customers WHERE customer_id=?")) {
                ps.setInt(1, customerId);
                ps.executeUpdate();
                req.setAttribute("success", "Customer deleted!");
            } catch (SQLException e) {
                req.setAttribute("error", "Error: " + e.getMessage());
            }
        }

        req.getRequestDispatcher("customers.jsp").forward(req, res);
    }
}