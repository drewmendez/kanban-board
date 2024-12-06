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
  // Create task and calculate order for tasks in the target status
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
    // If status is not changed, only update the title and content
    await pool.query(
      `
        UPDATE tasks
        SET title = ?, content = ?
        WHERE task_id = ?
      `,
      [title, content, task_id]
    );
  } else {
    // Update status and recalculate the order for tasks in the original status
    await pool.query(
      `
        WITH max_order AS (
        SELECT IFNULL(MAX(order_id), 0) + 1 AS next_order_id
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

export const updateTaskStatusAndReorder = async (
  task_id,
  status_id,
  order_id,
  old_status_id
) => {
  if (status_id === old_status_id) {
    await pool.query(
      `
        WITH old_order AS (
	        SELECT order_id AS old_order_id
          FROM tasks
          WHERE task_id = ?
        )
        UPDATE tasks
        SET order_id = order_id - 1
        WHERE order_id > (SELECT old_order_id FROM old_order) AND status_id = ?;

        UPDATE tasks
        SET order_id = order_id + 1
        WHERE order_id >= ? AND task_id != ? AND status_id = ?;

        UPDATE tasks
        SET order_id = ?
        WHERE task_id = ? AND status_id = ?;     
      `,
      [
        task_id,
        status_id,
        order_id,
        task_id,
        status_id,
        order_id,
        task_id,
        status_id,
      ]
    );
  } else {
    await pool.query(
      `
        UPDATE tasks
        SET order_id = order_id + 1
        WHERE order_id >= ? AND status_id = ?;

        UPDATE tasks
        SET status_id = ?, order_id = ?
        WHERE task_id = ?;
  
        SET @row_number = 0;
  
        UPDATE tasks
        SET order_id = @row_number := @row_number + 1
        WHERE status_id = ?
        ORDER BY order_id;
      `,
      [order_id, status_id, status_id, order_id, task_id, old_status_id]
    );
  }
};

export const deleteTask = async (task_id, status_id) => {
  await pool.query(
    `
      DELETE FROM tasks
      WHERE task_id = ?;

      SET @row_number = 0;

      UPDATE tasks
      SET order_id = @row_number := @row_number + 1
      WHERE status_id = ?
      ORDER BY order_id;
    `,
    [task_id, status_id]
  );
};
