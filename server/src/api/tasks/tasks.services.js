import pool from "../../config/db.config.js";

export const getAllTasks = async () => {
  const [result] = await pool.query(
    `SELECT tasks.task_id, users.firstname, users.lastname, tasks.title, tasks.content, tasks.order_id, tasks.status_id
     FROM tasks 
     JOIN users ON tasks.user_id = users.user_id
     ORDER BY status_id, order_id`
  );

  return result;
};

export const getTask = async (task_id) => {
  const [result] = await pool.query(
    `
    SELECT task_id, title, content, status_id
    FROM tasks
    WHERE task_id = ?
    `,
    [task_id]
  );

  return result[0];
};

export const getTasksByStatus = async (status_id) => {
  const [result] = await pool.query(
    `SELECT tasks.task_id, users.firstname, users.lastname, tasks.title, tasks.content, tasks.status_id 
     FROM tasks 
     JOIN users ON tasks.user_id = users.user_id 
     WHERE tasks.status_id = ?`,
    [status_id]
  );

  return result;
};

export const createTask = async (user_id, title, content, status_id) => {
  const query = `
    INSERT INTO tasks (user_id, title, content, order_id, status_id)
    SELECT 
	    ?,
      ?,
      ?,
      IFNULL(MAX(order_id), 0) + 1,
      ?
    FROM tasks
    WHERE status_id = ?
  `;

  await pool.query(query, [user_id, title, content, status_id, status_id]);
};

export const updateTask = async (
  task_id,
  title,
  content,
  status_id,
  old_status_id
) => {
  if (status_id === old_status_id) {
    await pool.query(
      `
        UPDATE tasks
        SET title = ?, content = ?
        WHERE task_id = ?
      `,
      [title, content, task_id]
    );
  } else {
    await pool.query(
      `
        WITH max_order AS (
        SELECT MAX(order_id) + 1 AS next_order_id
        FROM tasks
        WHERE status_id = ?
        )
        UPDATE tasks
        SET title = ?, content = ?, status_id = ?, order_id = (SELECT next_order_id FROM max_order)
        WHERE task_id = ?;
        SET @row_number = 0;
        UPDATE tasks
        SET order_id = @row_number := @row_number + 1
        WHERE status_id = ?
        ORDER BY order_id; 
      `,
      [status_id, title, content, status_id, task_id, old_status_id]
    );
  }
};

export const updateTaskStatus = async (task_id, status) => {
  await pool.query(
    `
    UPDATE tasks
    SET status = ?
    WHERE task_id = ?
    `,
    [status, task_id]
  );
};

export const deleteTask = async (task_id) => {
  await pool.query(
    `
    DELETE FROM tasks
    WHERE task_id = ?
    `,
    [task_id]
  );
};
