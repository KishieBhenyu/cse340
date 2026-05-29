// Import model functions
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';

// Show all organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();

    res.render('organizations', {
        title: 'Organizations',
        organizations
    });
};

// Show organization details
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render('organization', {
        title: 'Organization Details',
        organizationDetails,
        projects
    });
};

// Show new organization form
const showNewOrganizationForm = async (req, res) => {
    res.render('new-organization', {
        title: 'Add New Organization'
    });
};

const processNewOrganizationForm = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        console.log('Created organization ID:', organizationId);

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error('CREATE ERROR:', error);
        res.status(500).send(error.message);
    }
};

// Export controller functions
export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};