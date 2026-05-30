import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/* ========================
   HOME
======================== */
router.get('/', showHomePage);

/* ========================
   ORGANIZATIONS
======================== */
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

/* ========================
   PROJECTS
======================== */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

/* ========================
   CATEGORIES
======================== */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/* ========================
   TEST ERROR
======================== */
router.get('/test-error', testErrorPage);

export default router;