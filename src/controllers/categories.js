import { body, validationResult } from 'express-validator';

import {
  getAllCategories,
  getCategoryById,
  updateCategoryAssignments,
  createCategory,
  updateCategory,
  getCategoriesByProjectId,
  getProjectsByCategoryId
} from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';


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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
};

const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be 3–100 characters')
];

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

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create New Category'
    });
};



export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};