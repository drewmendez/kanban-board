CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  email VARCHAR(255),
  password text
);

CREATE TABLE statuses (
  status_id INT PRIMARY KEY AUTO_INCREMENT,
  status_title VARCHAR(20)
);

CREATE TABLE tasks (
  task_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255),
  content VARCHAR(255),
  order_id INT,
  status_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (status_id) REFERENCES statuses(status_id)
);