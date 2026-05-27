import db from './db.js';

/**
 * Get all categories
 */
async function getAllCategories() {
    const result = await db.query(
        'SELECT * FROM categories ORDER BY category_name'
    );
    return result.rows;
}

/**
 * 1. Get a single category by ID
 */
async function getCategoryById(categoryId) {
    const result = await db.query(
        `SELECT *
         FROM categories
         WHERE category_id = $1`,
        [categoryId]
    );

    return result.rows[0];
}

/**
 * 2. Get all categories for a given project
 */
async function getCategoriesByProjectId(projectId) {
    const result = await db.query(
        `SELECT c.category_id, c.category_name
         FROM categories c
         JOIN project_categories pc
            ON c.category_id = pc.category_id
         WHERE pc.project_id = $1
         ORDER BY c.category_name`,
        [projectId]
    );

    return result.rows;
}

/**
 * 3. Get all projects for a given category
 */
async function getProjectsByCategoryId(categoryId) {
    const result = await db.query(
        `SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id
         FROM projects p
         JOIN project_categories pc
            ON p.project_id = pc.project_id
         WHERE pc.category_id = $1
         ORDER BY p.date`,
        [categoryId]
    );

    return result.rows;
}

/**
 * Export all functions
 */
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};