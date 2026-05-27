import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Number of projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show upcoming projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(
        NUMBER_OF_UPCOMING_PROJECTS
    );

    res.render('projects', {
        title: 'Upcoming Service Projects',
        projects
    });
};

// Show single project details page
const showProjectDetailsPage = async (req, res) => {
    // Get project ID from URL
    const projectId = req.params.id;

    // Retrieve project details from database
    const project = await getProjectDetails(projectId);

    // Render project details page
    res.render('project', {
        title: 'Project Details',
        project
    });
};

// Export controller functions
export {
    showProjectsPage,
    showProjectDetailsPage
};