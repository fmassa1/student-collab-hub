USE peer_spark;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE project_likes;
TRUNCATE TABLE project_comments;
TRUNCATE TABLE project_tags;
TRUNCATE TABLE projects;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (email, username, password, first_name, last_name, university)
VALUES
('alice@example.com', 'alice_dev', 'hashedpassword1', 'Alice', 'Johnson', 'MIT'),
('bob@example.com', 'bob_coder', 'hashedpassword2', 'Bob', 'Smith', 'Stanford'),
('charlie@example.com', 'charlie_code', 'hashedpassword3', 'Charlie', 'Brown', 'Harvard'),
('diana@example.com', 'diana_dev', 'hashedpassword4', 'Diana', 'Prince', 'Oxford');

INSERT INTO projects (user_id, name, image_url, description, linkedin_url, github_url)
VALUES
(1, 'AI Chatbot', 'https://example.com/images/chatbot.png', 'An AI-powered chatbot built using Node.js and OpenAI API.', 'https://linkedin.com/in/alice', 'https://github.com/alice/ai-chatbot'),
(1, 'Weather App', 'https://example.com/images/weather.png', 'A weather forecasting app using OpenWeather API.', 'https://linkedin.com/in/alice', 'https://github.com/alice/weather-app'),
(2, 'E-Commerce Platform', 'https://example.com/images/shop.png', 'Full-stack MERN e-commerce site.', 'https://linkedin.com/in/bob', 'https://github.com/bob/ecommerce'),
(3, 'Portfolio Website', 'https://example.com/images/portfolio.png', 'A personal portfolio built with React and Tailwind.', 'https://linkedin.com/in/charlie', 'https://github.com/charlie/portfolio'),
(4, 'Blockchain Voting System', 'https://example.com/images/blockchain.png', 'Secure blockchain-based voting system.', 'https://linkedin.com/in/diana', 'https://github.com/diana/blockchain-voting');

INSERT INTO project_tags (project_id, tag)
VALUES
(1, 'Node.js'),
(1, 'AI'),
(1, 'OpenAI'),
(2, 'JavaScript'),
(2, 'API'),
(3, 'MongoDB'),
(3, 'React'),
(4, 'HTML'),
(4, 'CSS'),
(5, 'Blockchain'),
(5, 'Solidity');

INSERT INTO project_comments (project_id, user_id, comment)
VALUES
(1, 2, 'This is awesome!'),
(1, 3, 'Really impressive work.'),
(2, 4, 'I like the UI design.'),
(3, 1, 'Nice implementation of authentication!'),
(5, 2, 'Blockchain FTW!');

INSERT INTO project_likes (project_id, user_id)
VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 4),
(5, 1),
(5, 3);
