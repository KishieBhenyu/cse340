import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
    getProjectsByOrganizationId,
    addVolunteer as addVolunteerModel,
    removeVolunteer as removeVolunteerModel,
    isVolunteer as isVolunteerModel
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';
import { getCategoriesByProjectId } from '../models/categories.js';

/* =========================
   VALIDATION
========================= */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601(),

    body('organizationId')
        .notEmpty()
        .isInt()
];

/* =========================
   PROJECT LIST PAGE
========================= */
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(5);

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
};

/* =========================
   PROJECT DETAILS PAGE
========================= */
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found');
        }

        const categories = await getCategoriesByProjectId(projectId);

        
        const user = req.session.user || null;

        let isVolunteer = false;

        if (user) {
            isVolunteer = await isVolunteerModel(user.user_id, projectId);
        }

        console.log("DEBUG USER:", user); // TEMP DEBUG

        res.render('project', {
    title: project.title,   
    project,
    categories,
    user,
    isVolunteer
});

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

/* 
   CREATE PROJECT
 */
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('new-project', {
        title: 'Add New Service Project',
        organizations
    });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(e => req.flash('error', e.msg));
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    const newProjectId = await createProject(
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project created successfully');
    res.redirect(`/project/${newProjectId}`);
};

/*
   EDIT PROJECT
*/
const showEditProjectForm = async (req, res) => {
    const project = await getProjectDetails(req.params.id);
    const organizations = await getAllOrganizations();

    res.render('update-project', {
        title: 'Edit Project',
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const { title, description, location, date, organizationId } = req.body;

    await updateProject(
        req.params.id,
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Project updated successfully');
    res.redirect(`/project/${req.params.id}`);
};

/*
   VOLUNTEER ACTIONS
*/
const addVolunteer = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    await addVolunteerModel(userId, projectId);

    req.flash('success', 'You are now volunteering for this project');
    res.redirect(`/project/${projectId}`);
};

const removeVolunteer = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;

    await removeVolunteerModel(userId, projectId);

    req.flash('success', 'You removed yourself from this project');
    res.redirect(`/project/${projectId}`);
};

/*
   EXPORTS
*/
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    addVolunteer,
    removeVolunteer,
    projectValidation
};