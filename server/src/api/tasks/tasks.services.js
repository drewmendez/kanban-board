import pool from "../../config/db.config.js";

export const getAllTasks = async () => {
  const [result] = await pool.query(
    `SELECT tasks.task_id, users.firstname, users.lastname, tasks.title, tasks.content, tasks.status_id
     FROM tasks 
     JOIN users ON tasks.user_id = users.user_id`
  );

  return result;
};

export const getTask = async (task_id) => {
  const [result] = await pool.query(
    `
    SELECT task_id, title, content, status
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

export const updateTask = async (task_id, title, content, status) => {
  await pool.query(
    `UPDATE tasks
     SET title = ?, content = ?, status = ?
     WHERE task_id = ? 
    `,
    [title, content, status, task_id]
  );
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
