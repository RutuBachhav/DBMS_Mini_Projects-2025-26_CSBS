package com.grocery.models;

public class User {

    private int    userId;
    private String username;
    private String email;
    private String role;

    public User() {}

    public User(int userId, String username, String email, String role) {
        this.userId   = userId;
        this.username = username;
        this.email    = email;
        this.role     = role;
    }

    public int    getUserId()   { return userId; }
    public String getUsername() { return username; }
    public String getEmail()    { return email; }
    public String getRole()     { return role; }

    public void setUserId(int userId)    { this.userId   = userId; }
    public void setUsername(String u)    { this.username = u; }
    public void setEmail(String e)       { this.email    = e; }
    public void setRole(String r)        { this.role     = r; }
}