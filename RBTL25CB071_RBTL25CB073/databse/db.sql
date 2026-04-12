-- ==============================
-- CREATE DATABASE
-- ==============================
DROP DATABASE IF EXISTS library_db;
CREATE DATABASE IF NOT EXISTS library_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;
USE library_db;

-- ==============================
-- ADMIN TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default admin (username: admin, password: admin123)
INSERT INTO admin (username, password)
VALUES ('admin', '$2y$10$wH6QzZ8XxZ9zv8w5zK3J4u9zXvYp6mKZb7jJ7u8l8w9vXyYz12345');

-- ==============================
-- PUBLISHERS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS publishers (
    publisher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    year_of_publication YEAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================
-- BOOKS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    edition VARCHAR(20),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    isbn VARCHAR(20) UNIQUE,
    publisher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_books_publisher
        FOREIGN KEY (publisher_id)
        REFERENCES publishers(publisher_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==============================
-- READERS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS readers (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================
-- STAFF TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'staff',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================
-- ISSUED BOOKS TABLE
-- ==============================
CREATE TABLE IF NOT EXISTS issued_books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE DEFAULT NULL,
    status ENUM('issued', 'returned') NOT NULL DEFAULT 'issued',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_issued_user
        FOREIGN KEY (user_id)
        REFERENCES readers(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_issued_book
        FOREIGN KEY (book_id)
        REFERENCES books(book_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==============================
-- SAMPLE DATA (OPTIONAL BUT USEFUL)
-- ==============================

INSERT INTO publishers (name, year_of_publication) VALUES
('Penguin', 2000),
('Oxford', 1995);

INSERT INTO books (title, author_name, category, edition, price, isbn, publisher_id) VALUES
('DBMS Basics', 'Navathe', 'Education', '3rd', 500.00, 'ISBN001', 1),
('Operating Systems', 'Galvin', 'Education', '5th', 650.00, 'ISBN002', 2);

INSERT INTO readers (first_name, last_name, email, phone, address) VALUES
('Rahul', 'Sharma', 'rahul@mail.com', '9999999999', 'Pune, Maharashtra'),
('Anita', 'Patil', 'anita@mail.com', '8888888888', 'Mumbai, Maharashtra');

INSERT INTO staff (name, age, email, role) VALUES
('Admin Staff', 35, 'adminstaff@example.com', 'administrator');

-- ==============================
-- END
-- ==============================