import db from './db.js';

/* 
   UPCOMING PROJECTS
*/
const getUpcomingProjects = async (limit) => {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const result = await db.query(sql, [limit]);
    return result.rows;
};

/* 
   PROJECTS BY ORGANIZATION
*/
const getProjectsByOrganizationId = async (organizationId) => {
    const sql = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM projects
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const result = await db.query(sql, [organizationId]);
    return result.rows;
};

/* 
   SINGLE PROJECT DETAILS
 */
const getProjectDetails = async (projectId) => {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM projects p
        JOIN organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(sql, [projectId]);

    return result.rows[0] || null;
};

/* 
   CREATE PROJECT
 */
const createProject = async (title, description, location, date, organizationId) => {
    const sql = `
        INSERT INTO projects (
            title,
            description,
            location,
            date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(sql, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    return result.rows[0]?.project_id || null;
};

/*
   UPDATE PROJECT
*/
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const sql = `
        UPDATE projects
        SET
            title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(sql, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    return result.rows[0]?.project_id || null;
};


/* 
   VOLUNTEER ACTIONS
 */

const getVolunteerProjects = async (userId) => {
    const sql = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location
        FROM projects p
        INNER JOIN project_volunteers pv
            ON p.project_id = pv.project_id
        WHERE pv.user_id = $1
        ORDER BY p.date;
    `;

    const result = await db.query(sql, [userId]);
    return result.rows;
};

/* JOIN PROJECT */
const addVolunteer = async (userId, projectId) => {
    const sql = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *;
    `;

    const result = await db.query(sql, [userId, projectId]);

    return result.rows[0] || null;
};

/* LEAVE PROJECT */
const removeVolunteer = async (userId, projectId) => {
    const sql = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    await db.query(sql, [userId, projectId]);
};

/* CHECK VOLUNTEER STATUS */
const isVolunteer = async (userId, projectId) => {
    const sql = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1
        AND project_id = $2;
    `;

    const result = await db.query(sql, [userId, projectId]);
    return result.rows.length > 0;
};

/* 
   EXPORTS
*/
export {
  getUpcomingProjects,
    getProjectsByOrganizationId,
    getProjectDetails,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getVolunteerProjects
};