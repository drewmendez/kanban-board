import pool from "../../config/db.config.js";

export const getStatuses = async () => {
  const [rows] = await pool.query(`SELECT * FROM statuses`);
  return rows;
};
