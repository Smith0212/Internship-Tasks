CREATE DATABASE employee_management_node_18_02;

USE employee_management_node_18_02;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(100),
  department VARCHAR(100),
  hire_date DATE,
  salary DECIMAL(10, 2),
  manager_id INT,
  password VARCHAR(255) NOT NULL,
  is_active tinyint(1) default 1,
	is_deleted tinyint(1) default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp default current_timestamp on update current_timestamp,
	deleted_at timestamp null
);

INSERT INTO employees (first_name, last_name, email, phone, position, department, hire_date, salary, manager_id, password)
VALUES ('Admin', 'User', 'smit@example.com', '1234567890', 'Administrator', 'Management', '2023-01-01', 100000.00, NULL, 'smit');

select * from employees;