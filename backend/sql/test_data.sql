USE peer_spark;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE project_likes;
TRUNCATE TABLE project_comments;
TRUNCATE TABLE project_tags;
TRUNCATE TABLE projects;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- USERS
INSERT INTO users (email, username, password, first_name, last_name, university)
VALUES
('alice@example.com', 'alice_dev', 'hashedpassword1', 'Alice', 'Johnson', 'MIT'),
('bob@example.com', 'bob_coder', 'hashedpassword2', 'Bob', 'Smith', 'Stanford'),
('charlie@example.com', 'charlie_code', 'hashedpassword3', 'Charlie', 'Brown', 'Harvard'),
('diana@example.com', 'diana_dev', 'hashedpassword4', 'Diana', 'Prince', 'Oxford'),
('eve@example.com', 'eve_ai', 'hashedpassword5', 'Eve', 'Adams', 'Caltech'),
('frank@example.com', 'frank_ml', 'hashedpassword6', 'Frank', 'Miller', 'Cambridge'),
('grace@example.com', 'grace_ds', 'hashedpassword7', 'Grace', 'Hopper', 'Princeton'),
('henry@example.com', 'henry_web', 'hashedpassword8', 'Henry', 'Ford', 'UChicago');

-- PROJECTS (25 total)
INSERT INTO projects (user_id, name, image_url, description, linkedin_url, github_url)
VALUES
(1, 'AI Chatbot', 'https://placehold.co/400x400', 'An AI-powered chatbot built using Node.js and OpenAI API.', 'https://linkedin.com/in/alice', 'https://github.com/alice/ai-chatbot'),
(1, 'Weather App', 'https://placehold.co/400x400', 'A weather forecasting app using OpenWeather API.', 'https://linkedin.com/in/alice', 'https://github.com/alice/weather-app'),
(2, 'E-Commerce Platform', 'https://placehold.co/400x400', 'Full-stack MERN e-commerce site.', 'https://linkedin.com/in/bob', 'https://github.com/bob/ecommerce'),
(3, 'Portfolio Website', 'https://placehold.co/400x400', 'A personal portfolio built with React and Tailwind.', 'https://linkedin.com/in/charlie', 'https://github.com/charlie/portfolio'),
(4, 'Blockchain Voting System', 'https://placehold.co/400x400', 'Secure blockchain-based voting system.', 'https://linkedin.com/in/diana', 'https://github.com/diana/blockchain-voting'),
(5, 'AI Stock Predictor', 'https://placehold.co/400x400', 'Predict stock trends with ML models.', 'https://linkedin.com/in/eve', 'https://github.com/eve/stock-predictor'),
(6, 'ML Image Classifier', 'https://placehold.co/400x400', 'Image classification using CNNs.', 'https://linkedin.com/in/frank', 'https://github.com/frank/image-classifier'),
(7, 'Data Science Dashboard', 'https://placehold.co/400x400', 'Interactive data visualization tool.', 'https://linkedin.com/in/grace', 'https://github.com/grace/dashboard'),
(8, 'Full-Stack Blog', 'https://placehold.co/400x400', 'Blogging platform built with Django and React.', 'https://linkedin.com/in/henry', 'https://github.com/henry/blog'),
(2, 'Chat Application', 'https://placehold.co/400x400', 'Real-time chat app with WebSockets.', 'https://linkedin.com/in/bob', 'https://github.com/bob/chat-app'),
(3, 'Task Manager', 'https://placehold.co/400x400', 'Task management app with notifications.', 'https://linkedin.com/in/charlie', 'https://github.com/charlie/task-manager'),
(4, 'Recipe Finder', 'https://placehold.co/400x400', 'Find recipes with available ingredients.', 'https://linkedin.com/in/diana', 'https://github.com/diana/recipe-finder'),
(5, 'AI Art Generator', 'https://placehold.co/400x400', 'Generates art using Stable Diffusion.', 'https://linkedin.com/in/eve', 'https://github.com/eve/ai-art'),
(6, 'Sports Stats API', 'https://placehold.co/400x400', 'REST API for live sports stats.', 'https://linkedin.com/in/frank', 'https://github.com/frank/sports-api'),
(7, 'Finance Tracker', 'https://placehold.co/400x400', 'Personal finance tracking app.', 'https://linkedin.com/in/grace', 'https://github.com/grace/finance-tracker'),
(8, 'Social Media Clone', 'https://placehold.co/400x400', 'Mini social media platform.', 'https://linkedin.com/in/henry', 'https://github.com/henry/social-clone'),
(1, 'Travel Planner', 'https://placehold.co/400x400', 'Trip planner with itinerary generation.', 'https://linkedin.com/in/alice', 'https://github.com/alice/travel-planner'),
(2, 'Music Streaming App', 'https://placehold.co/400x400', 'Spotify-like clone for music streaming.', 'https://linkedin.com/in/bob', 'https://github.com/bob/music-app'),
(3, 'Video Editor', 'https://placehold.co/400x400', 'Lightweight browser-based video editor.', 'https://linkedin.com/in/charlie', 'https://github.com/charlie/video-editor'),
(4, 'IoT Smart Home', 'https://placehold.co/400x400', 'IoT system for home automation.', 'https://linkedin.com/in/diana', 'https://github.com/diana/smart-home'),
(5, 'AI Resume Analyzer', 'https://placehold.co/400x400', 'AI tool to improve resumes.', 'https://linkedin.com/in/eve', 'https://github.com/eve/resume-analyzer'),
(6, 'Traffic Predictor', 'https://placehold.co/400x400', 'Traffic congestion prediction app.', 'https://linkedin.com/in/frank', 'https://github.com/frank/traffic-predictor'),
(7, 'Health Tracker', 'https://placehold.co/400x400', 'Track daily health metrics.', 'https://linkedin.com/in/grace', 'https://github.com/grace/health-tracker'),
(8, 'Language Learning App', 'https://placehold.co/400x400', 'Gamified app for language learning.', 'https://linkedin.com/in/henry', 'https://github.com/henry/language-app'),
(1, 'Quiz Platform', 'https://placehold.co/400x400', 'Interactive quiz and trivia app.', 'https://linkedin.com/in/alice', 'https://github.com/alice/quiz-platform');

-- TAGS
INSERT INTO project_tags (project_id, tag)
VALUES
(1, 'Node.js'), (1, 'AI'), (1, 'OpenAI'),
(2, 'JavaScript'), (2, 'API'),
(3, 'MongoDB'), (3, 'React'),
(4, 'HTML'), (4, 'CSS'),
(5, 'Blockchain'), (5, 'Solidity'),
(6, 'TensorFlow'), (6, 'Finance'),
(7, 'CNN'), (7, 'Python'),
(8, 'D3.js'), (8, 'Dashboard'),
(9, 'Django'), (9, 'React'),
(10, 'WebSockets'), (10, 'Node.js'),
(11, 'Notifications'), (11, 'Productivity'),
(12, 'Recipes'), (12, 'Search'),
(13, 'AI'), (13, 'Stable Diffusion'),
(14, 'API'), (14, 'Sports'),
(15, 'Finance'), (15, 'Tracker'),
(16, 'Social Media'), (16, 'Clone'),
(17, 'Travel'), (17, 'Planner'),
(18, 'Music'), (18, 'Streaming'),
(19, 'Video'), (19, 'Editor'),
(20, 'IoT'), (20, 'Automation'),
(21, 'AI'), (21, 'Resumes'),
(22, 'Traffic'), (22, 'Prediction'),
(23, 'Health'), (23, 'Fitness'),
(24, 'Education'), (24, 'Gamification'),
(25, 'Quiz'), (25, 'Trivia');

-- COMMENTS
INSERT INTO project_comments (project_id, user_id, comment)
VALUES
(1, 2, 'This is awesome!'),
(1, 3, 'Really impressive work.'),
(2, 4, 'I like the UI design.'),
(3, 1, 'Nice implementation of authentication!'),
(5, 2, 'Blockchain FTW!'),
(6, 3, 'Great ML project!'),
(7, 4, 'Love the dashboard UI.'),
(8, 5, 'This blog is clean and responsive.'),
(9, 6, 'The stack choice is excellent.'),
(10, 7, 'Works smoothly in real-time!'),
(11, 8, 'Very useful for teams.'),
(12, 1, 'Can’t wait to try this.'),
(13, 2, 'AI art is the future!'),
(14, 3, 'This API is well-documented.'),
(15, 4, 'Helps with personal finance.'),
(16, 5, 'Looks like a real social app.'),
(17, 6, 'Perfect for travel lovers.'),
(18, 7, 'Music player UI is nice.'),
(19, 8, 'Editing tools are intuitive.'),
(20, 1, 'Smart home made easy.'),
(21, 2, 'This would help job seekers.'),
(22, 3, 'Traffic data accuracy is good.'),
(23, 4, 'Health tracking looks solid.'),
(24, 5, 'Gamification is fun!'),
(25, 6, 'Quizzes are addictive.');

-- LIKES
INSERT INTO project_likes (project_id, user_id)
VALUES
(1, 2), (1, 3),
(2, 1), (2, 4),
(3, 4), (3, 5),
(4, 6), (4, 7),
(5, 1), (5, 3),
(6, 2), (6, 4),
(7, 3), (7, 6),
(8, 5), (8, 7),
(9, 1), (9, 2),
(10, 3), (10, 6),
(11, 4), (11, 7),
(12, 2), (12, 5),
(13, 6), (13, 8),
(14, 1), (14, 3),
(15, 5), (15, 6),
(16, 7), (16, 2),
(17, 1), (17, 8),
(18, 3), (18, 5),
(19, 4), (19, 2),
(20, 6), (20, 7),
(21, 8), (21, 1),
(22, 2), (22, 6),
(23, 3), (23, 5),
(24, 4), (24, 7),
(25, 1), (25, 2);
