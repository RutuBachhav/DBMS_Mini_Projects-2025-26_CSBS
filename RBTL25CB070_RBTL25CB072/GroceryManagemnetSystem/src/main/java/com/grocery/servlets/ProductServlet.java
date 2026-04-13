package com.grocery.servlets;

import com.grocery.db.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/ProductServlet")
public class ProductServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String action = req.getParameter("action");

        if ("add".equals(action)) {
            String name  = req.getParameter("product_name").trim();
            int    catId = Integer.parseInt(req.getParameter("category_id"));
            double price = Double.parseDouble(req.getParameter("price"));
            int    stock = Integer.parseInt(req.getParameter("stock_quantity"));
            String unit  = req.getParameter("unit");
            String desc  = req.getParameter("description");

            String sql = "INSERT INTO products(category_id,product_name,description,price,stock_quantity,unit) VALUES(?,?,?,?,?,?)";
            try (Connection c = DBConnection.getConnection();
                 PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setInt(1, catId);
                ps.setString(2, name);
                ps.setString(3, desc);
                ps.setDouble(4, price);
                ps.setInt(5, stock);
                ps.setString(6, unit);
                ps.executeUpdate();
                req.setAttribute("success", "Product '" + name + "' added successfully!");
            } catch (SQLException e) {
                req.setAttribute("error", "Error: " + e.getMessage());
            }

        } else if ("delete".equals(action)) {
            int productId = Integer.parseInt(req.getParameter("product_id"));
            String sql = "DELETE FROM products WHERE product_id = ?";
            try (Connection c = DBConnection.getConnection();
                 PreparedStatement ps = c.prepareStatement(sql)) {
                ps.setInt(1, productId);
                ps.executeUpdate();
                req.setAttribute("success", "Product deleted successfully!");
            } catch (SQLException e) {
                req.setAttribute("error", "Error: " + e.getMessage());
            }
        }

        req.getRequestDispatcher("products.jsp").forward(req, res);
    }
}