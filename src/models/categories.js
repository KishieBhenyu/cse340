import pool from './db.js';

async function getAllCategories() {
  const result = await pool.query(
    'SELECT * FROM public.categories ORDER BY category_name'
  );
  return result.rows;
}

export default { getAllCategories };