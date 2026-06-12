CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Verify the data was inserted
SELECT * FROM roles;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM roles;
SELECT * FROM users;

UPDATE users
SET role_id = (
    SELECT role_id 
    FROM roles 
    WHERE role_name = 'admin'
)
WHERE email = 'admin@example.com';

SELECT 
    users.user_id,
    users.name,
    users.email,
    roles.role_name
FROM users
JOIN roles ON users.role_id = roles.role_id;

SELECT * FROM roles;

SELECT user_id, name, email FROM users;

SELECT * FROM roles;

INSERT INTO users (name, email, password_hash, role_id)
VALUES (
    'Admin',
    'admin@example.com',
    '<TEMP_HASH>',
    (SELECT role_id FROM roles WHERE role_name = 'admin')
);

SELECT user_id, name, email, role_id
FROM users
WHERE email = 'admin@example.com';

SELECT email, password_hash
FROM users
WHERE email = 'admin@example.com';

SELECT user_id, name, email, role_id
FROM users;

SELECT user_id, email, password_hash
FROM users;

DELETE FROM users
WHERE email = 'admin@example.com';

DELETE FROM users
WHERE email = 'kishie@gmail.com';

DELETE FROM users
WHERE email = 'natasha@gmail.com';

UPDATE users
SET role_id = (
    SELECT role_id
    FROM roles
    WHERE role_name = 'admin'
)
WHERE email = 'admin@example.com';

SELECT user_id, name, email, role_id
FROM users
WHERE email = 'admin@example.com';

UPDATE users
SET role_id = (
    SELECT role_id
    FROM roles
    WHERE role_name = 'admin'
)
WHERE email = 'admin@example.com';

SELECT * FROM USERS;

DROP TABLE IF EXISTS project_volunteers;

CREATE TABLE project_volunteers (
    volunteer_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    volunteer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_volunteer UNIQUE (user_id, project_id)
);

ALTER TABLE project_volunteers
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(user_id)
ON DELETE CASCADE;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

SELECT column_name
FROM information_schema.columns
WHERE table_name = 'projects';

ALTER TABLE project_volunteers
ADD CONSTRAINT fk_project
FOREIGN KEY (project_id)
REFERENCES projects(project_id)
ON DELETE CASCADE;

