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

async function getCategoryDetails(categoryId) {
    const result = await db.query(
        `SELECT *
         FROM categories
         WHERE category_id = $1`,
        [categoryId]
    );

    return result.rows[0];
}

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    if (!categoryIds) {
        return;
    }

    const categoryArray = Array.isArray(categoryIds)
        ? categoryIds
        : [categoryIds];

    for (const categoryId of categoryArray) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    return result.rows[0].category_id;
};


const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create New Category'
    });
};


const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    const { categoryName } = req.body;

    try {
        await createCategory(categoryName);

        req.flash('success', 'Category created successfully');
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to create category');
        res.redirect('/new-category');
    }
};


const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};


const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { categoryName } = req.body;

    try {
        await updateCategory(categoryId, categoryName);

        req.flash('success', 'Category updated successfully');
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update category');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Export all functions
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    getCategoryDetails,
    assignCategoryToProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};