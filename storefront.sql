DROP DATABASE IF EXISTS storefront;

CREATE DATABASE storefront;

USE storefront;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NULL,
department_name VARCHAR(45) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("A Promised Land", "Books", 19.99, 0), ("Untamed", "Books", 17.99, 10), ("Daring Greatly", "Books", 12.99, 10), ("The Gifts of Imperfection", "Books", 13.99, 10), ("Brave, Not Perfect", "Books", 14.99, 10), ("More Than Enough", "Books", 10.99, 10), ("Permission To Feel", "Books", 19.99, 10), ("Together", "Books", 9.99, 10), ("On Writing Well", "Books", 14.99, 10), ("Becoming", "Books", 19.99, 10);
