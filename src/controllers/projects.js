import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

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
        // Get project ID from URL
        const projectId = req.params.id;

        // Retrieve project details from database
        const project = await getProjectDetails(projectId);

        // Handle missing project (prevents EJS crash)
        if (!project) {
            return res.status(404).send("Project not found");
        }

        // Render project details page safely
        res.render('project', {
            title: 'Project Details',
            project,
            categories: [] // safe fallback so EJS doesn't break
        });

    } catch (err) {
        console.error("Error loading project details:", err);
        res.status(500).send("Something went wrong");
    }
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};