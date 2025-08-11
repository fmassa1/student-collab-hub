CREATE DATABASE IF NOT EXISTS peer_spark;
USE peer_spark;

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500)
);

CREATE TABLE project_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);