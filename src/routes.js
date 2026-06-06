import express from 'express';

import { showHomePage } from './controllers/index.js';

import { requireLogin } from './middleware/auth.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    showDashboard,
    showUsersPage,
    requireRole
} from './controllers/users.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* HOME */
router.get('/', showHomePage);

/*AUTH*/
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

router.get('/logout', processLogout);

/*DASHBOARD*/
router.get('/dashboard', requireLogin, showDashboard);

/* USERS (ADMIN ONLY)*/
router.get('/users', requireLogin, requireRole('admin'), showUsersPage);

/*ORGANIZATIONS (ADMIN ONLY)*/
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get(
    '/new-organization',
    requireLogin,
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireLogin,
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireLogin,
    requireRole('admin'),
    organizationValidation,
    processEditOrganizationForm
);

/*PROJECTS (ADMIN ONLY)*/
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get(
    '/new-project',
    requireLogin,
    requireRole('admin'),
    showNewProjectForm
);

router.post(
    '/new-project',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    requireLogin,
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireLogin,
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

/*CATEGORIES (ADMIN ONLY) */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.get(
    '/new-category',
    requireLogin,
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    requireLogin,
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireLogin,
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

/*PROJECT CATEGORY ASSIGNMENT (ADMIN ONLY)*/
router.get(
    '/project/:projectId/assign-categories',
    requireLogin,
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    requireLogin,
    requireRole('admin'),
    processAssignCategoriesForm
);

/*ERROR TEST*/
router.get('/test-error', testErrorPage);

export default router;