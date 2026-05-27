import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    res.render('categories', {
        title: 'Service Categories',
        categories
    });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    res.render('category', {
        title: 'Category Details',
        category,
        projects
    });
};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};