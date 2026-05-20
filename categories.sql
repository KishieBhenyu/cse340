CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

SELECT * FROM categories;

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL
);

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

SELECT * FROM project_categories;

INSERT INTO projects (project_id, project_name)
VALUES
(1, 'Project A'),
(2, 'Project B'),
(3, 'Project C');



SELECT * FROM categories;

INSERT INTO categories (category_name)
VALUES
('Category 1'),
('Category 2'),
('Category 3');

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 3);

SELECT * FROM projects;
SELECT * FROM categories;
