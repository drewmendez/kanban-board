import pool from "../../config/db.config.js";

export const getUserEmail = async (email) => {
  const [result] = await pool.query("SELECT email FROM users WHERE email = ?", [
    email,
  ]);

  return result;
};

export const getUserByEmail = async (email) => {
  const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  return result[0];
};

export const createUser = async (firsname, lastname, email, password) => {
  await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUE (?,?,?,?)",
    [firsname, lastname, email, password]
  );
};

export const getCurrentUser = async (user_id) => {
  const [result] = await pool.query(
    `
    SELECT firstname, lastname
    FROM users
    WHERE user_id = ?
    `[user_id]
  );

  return result[0];
};
