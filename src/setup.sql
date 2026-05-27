-- ========================================
-- RESET DATABASE (SAFE REBUILD)
-- ========================================
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organization;

-- ========================================
-- ORGANIZATION TABLE
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- PROJECTS TABLE
-- ========================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    date DATE DEFAULT CURRENT_DATE,

    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- CATEGORIES TABLE
-- ========================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- PROJECT_CATEGORIES TABLE (JOIN TABLE)
-- ========================================
CREATE TABLE project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- SAMPLE DATA: ORGANIZATIONS
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'Infrastructure nonprofit improving communities', 'info@brightfuture.org', 'brightfuture.png'),
('GreenHarvest Growers', 'Urban farming and sustainability group', 'contact@greenharvest.org', 'greenharvest.png'),
('UnityServe Volunteers', 'Volunteer coordination organization', 'hello@unityserve.org', 'unityserve.png');

-- ========================================
-- SAMPLE DATA: PROJECTS
-- ========================================
INSERT INTO projects (organization_id, title, description, location, date)
VALUES
(1, 'Community Garden', 'Building a shared garden space', 'Harare', CURRENT_DATE + 5),
(2, 'School Supply Drive', 'Collecting supplies for schools', 'Bulawayo', CURRENT_DATE + 10),
(3, 'Neighborhood Cleanup', 'Cleaning public parks', 'Mutare', CURRENT_DATE + 2),
(1, 'Tree Planting Campaign', 'Planting trees in urban areas', 'Harare', CURRENT_DATE + 7);

-- ========================================
-- SAMPLE DATA: CATEGORIES
-- ========================================
INSERT INTO categories (category_name)
VALUES
('Environment'),
('Education'),
('Community'),
('Health');

-- ========================================
-- SAMPLE DATA: PROJECT_CATEGORIES
-- ========================================
INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 1),
(4, 1);

-- ========================================
-- TEST QUERIES
-- ========================================
SELECT * FROM organization;
SELECT * FROM projects;
SELECT * FROM categories;
SELECT * FROM project_categories;

-- JOIN TEST (PROJECTS + ORGANIZATION)
SELECT
    p.project_id,
    p.title,
    p.description,
    p.location,
    p.date,
    o.name AS organization_name
FROM projects p
JOIN organization o
    ON p.organization_id = o.organization_id;

-- JOIN TEST (PROJECTS + CATEGORIES)
SELECT
    p.title,
    c.category_name
FROM projects p
JOIN project_categories pc
    ON p.project_id = pc.project_id
JOIN categories c
    ON pc.category_id = c.category_id
ORDER BY p.title;