USE peer_spark;

-- ====================
-- USERS
-- ====================
INSERT INTO users (email, username, password, first_name, last_name, bio, university, linkedin_url, github_url, profile_picture_url, resume_url, likes_received, date_created, last_logged_in)
VALUES
('alice@example.com', 'alice', 'hashed_pw1', 'Alice', 'Johnson', 'ML enthusiast.', 'UIC', 'https://linkedin.com/in/alice', 'https://github.com/alice', '/images/alice.png', '/resumes/alice.pdf', 12, NOW(), NOW()),
('bob@example.com', 'bob', 'hashed_pw2', 'Bob', 'Smith', 'Backend dev.', 'MIT', 'https://linkedin.com/in/bob', 'https://github.com/bob', '/images/bob.png', '/resumes/bob.pdf', 8, NOW(), NOW()),
('carol@example.com', 'carol', 'hashed_pw3', 'Carol', 'Lee', 'Frontend wizard.', 'Stanford', 'https://linkedin.com/in/carol', 'https://github.com/carol', '/images/carol.png', '/resumes/carol.pdf', 15, NOW(), NOW()),
('dave@example.com', 'dave', 'hashed_pw4', 'Dave', 'Brown', 'Systems hacker.', 'UIC', 'https://linkedin.com/in/dave', 'https://github.com/dave', '/images/dave.png', '/resumes/dave.pdf', 5, NOW(), NOW()),
('eve@example.com', 'eve', 'hashed_pw5', 'Eve', 'Davis', 'Cybersecurity focused.', 'Harvard', 'https://linkedin.com/in/eve', 'https://github.com/eve', '/images/eve.png', '/resumes/eve.pdf', 20, NOW(), NOW()),
('frank@example.com', 'frank', 'hashed_pw6', 'Frank', 'Miller', 'Data science nerd.', 'UIC', 'https://linkedin.com/in/frank', 'https://github.com/frank', '/images/frank.png', '/resumes/frank.pdf', 2, NOW(), NOW()),
('grace@example.com', 'grace', 'hashed_pw7', 'Grace', 'Kim', 'AI researcher.', 'Princeton', 'https://linkedin.com/in/grace', 'https://github.com/grace', '/images/grace.png', '/resumes/grace.pdf', 14, NOW(), NOW()),
('henry@example.com', 'henry', 'hashed_pw8', 'Henry', 'Lopez', 'Mobile dev.', 'UIC', 'https://linkedin.com/in/henry', 'https://github.com/henry', '/images/henry.png', '/resumes/henry.pdf', 7, NOW(), NOW()),
('ivy@example.com', 'ivy', 'hashed_pw9', 'Ivy', 'Garcia', 'Game dev.', 'CMU', 'https://linkedin.com/in/ivy', 'https://github.com/ivy', '/images/ivy.png', '/resumes/ivy.pdf', 6, NOW(), NOW()),
('jack@example.com', 'jack', 'hashed_pw10', 'Jack', 'Wilson', 'Full stack dev.', 'UIC', 'https://linkedin.com/in/jack', 'https://github.com/jack', '/images/jack.png', '/resumes/jack.pdf', 10, NOW(), NOW());

-- ====================
-- PROJECTS
-- ====================
INSERT INTO projects (user_id, name, description, github_url, date_posted)
VALUES
(1, 'AI Chatbot', 'Conversational bot using NLP.', 'https://github.com/p1', NOW()),
(2, 'Task Manager', 'Productivity app with reminders.', 'https://github.com/p2', NOW()),
(3, 'Portfolio Website', 'Personal portfolio with React.', 'https://github.com/p3', NOW()),
(4, 'Game Engine', '2D engine from scratch.', 'https://github.com/p4', NOW()),
(5, 'Network Scanner', 'Tool for scanning open ports.', 'https://github.com/p5', NOW()),
(6, 'Weather App', 'Mobile app for live weather.', 'https://github.com/p6', NOW()),
(7, 'Data Dashboard', 'Interactive analytics dashboard.', 'https://github.com/p7', NOW()),
(8, 'AR Project', 'AR visualization demo.', 'https://github.com/p8', NOW()),
(9, 'Game Prototype', 'Indie game prototype.', 'https://github.com/p9', NOW()),
(10, 'E-Commerce Site', 'Shop with payments.', 'https://github.com/p10', NOW()),
(1, 'Crypto Tracker', 'App to track crypto prices.', 'https://github.com/p11', NOW()),
(2, 'Note Sharing', 'App for students to share notes.', 'https://github.com/p12', NOW()),
(3, 'Fitness Tracker', 'Tracks workouts and diet.', 'https://github.com/p13', NOW()),
(4, 'Compiler Project', 'Custom toy compiler.', 'https://github.com/p14', NOW()),
(5, 'Vision Project', 'Computer vision demo.', 'https://github.com/p15', NOW());

-- ====================
-- PROJECT TAGS
-- ====================
INSERT INTO project_tags (project_id, tag)
VALUES
(1, 'AI'), (1, 'NLP'),
(2, 'Productivity'),
(3, 'WebDev'), (3, 'React'),
(4, 'GameDev'), (4, 'C++'),
(5, 'Cybersecurity'),
(6, 'Mobile'), (6, 'Flutter'),
(7, 'DataViz'),
(8, 'AR'), (8, 'VisionOS'),
(9, 'GameDev'),
(10, 'E-Commerce'), (10, 'FullStack'),
(11, 'Crypto'), (11, 'Finance'),
(12, 'Education'),
(13, 'Health'), (13, 'Fitness'),
(14, 'Compilers'), (14, 'C'),
(15, 'ComputerVision');

-- ====================
-- PROJECT COMMENTS
-- ====================
INSERT INTO project_comments (project_id, user_id, comment, date_posted)
VALUES
(1, 2, 'Really cool chatbot!', NOW()),
(1, 3, 'Could you open-source it?', NOW()),
(2, 1, 'Nice clean UI!', NOW()),
(3, 5, 'I like your design.', NOW()),
(4, 6, 'Engine from scratch? Impressive.', NOW()),
(5, 7, 'Security tools are always useful.', NOW()),
(6, 8, 'Does it support iOS too?', NOW()),
(7, 9, 'Dashboard looks slick.', NOW()),
(8, 10, 'VisionOS project! 🔥', NOW()),
(9, 4, 'Game idea is fun!', NOW());

-- ====================
-- COMMENT LIKES
-- ====================
INSERT INTO project_comment_likes (comment_id, user_id)
VALUES
(1, 3), (1, 4),
(2, 5),
(3, 2),
(4, 7),
(5, 8), (5, 9);

-- ====================
-- PROJECT LIKES
-- ====================
INSERT INTO project_likes (project_id, user_id)
VALUES
(1, 5), (1, 6), (1, 7),
(2, 3), (2, 4),
(3, 1), (3, 9),
(4, 2), (4, 10),
(5, 8),
(6, 1), (6, 9),
(7, 2),
(8, 3), (8, 5),
(9, 4),
(10, 6), (10, 7);

-- ====================
-- PROJECT VIEWS
-- ====================
INSERT INTO project_views (project_id, user_id)
VALUES
(1, 2), (1, 3), (1, 5),
(2, 1), (2, 4),
(3, 6), (3, 7),
(4, 8), (4, 9),
(5, 10);

-- ====================
-- NOTIFICATIONS
-- ====================
INSERT INTO notifications (project_id, user_id, from_user_id, type, comment_id, metadata, seen, deleted, date_created)
VALUES
(1, 1, 2, 'COMMENT', 1, '{"msg":"Bob commented"}', 0, 0, NOW()),
(1, 1, 3, 'COMMENT', 2, '{"msg":"Carol commented"}', 0, 0, NOW()),
(2, 2, 1, 'LIKE', NULL, '{"msg":"Alice liked your project"}', 0, 0, NOW()),
(3, 3, 5, 'COMMENT', 4, '{"msg":"Eve commented"}', 0, 0, NOW()),
(4, 4, 6, 'LIKE', NULL, '{"msg":"Frank liked your project"}', 0, 0, NOW());
