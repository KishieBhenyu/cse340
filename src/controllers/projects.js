import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    getProjectsByOrganizationId
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

import { getCategoriesByProjectId } from '../models/categories.js';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Number of projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show upcoming projects page
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });

    } catch (err) {
        console.error("Error loading projects page:", err);
        res.status(500).send("Something went wrong");
    }
};

// Show single project details page
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const categories = await getCategoriesByProjectId(projectId);

        res.render('project', {
            title: 'Project Details',
            project,
            categories
        });

    } catch (err) {
        console.error('Error loading project details:', err);
        res.status(500).send('Something went wrong');
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Flash each validation error
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);

    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Get existing project data
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Get all organizations for dropdown
        const organizations = await getAllOrganizations();

        res.render('update-project', {
            title: 'Edit Service Project',
            project,
            organizations
        });

    } catch (error) {
        console.error('Error loading edit project form:', error);
        res.status(500).send('Something went wrong');
    }
};

const processEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        // Update project in DB
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully.');

        res.redirect(`/project/${projectId}`);

    } catch (error) {
        console.error('Error updating project:', error);

        req.flash('error', 'Failed to update project.');

        res.redirect(`/edit-project/${req.params.id}`);
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation

};
