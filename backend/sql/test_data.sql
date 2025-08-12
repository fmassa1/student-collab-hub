USE peer_spark;

DELETE FROM project_tags;
DELETE FROM projects;
DELETE FROM project_comments;

INSERT INTO projects (name, image_url, description, linkedin_url, github_url) VALUES
('AI Chatbot', 'https://picsum.photos/200?1', 'A chatbot that helps students', 'https://www.linkedin.com/in/fredric-massa', 'https://github.com/fmassa1'),
('Portfolio Website', 'https://picsum.photos/200?2', 'Personal portfolio website with animations', 'https://www.linkedin.com/in/johndoe', 'https://github.com/johndoe'),
('Weather App', 'https://picsum.photos/200?3', 'Weather forecast using OpenWeather API', NULL, 'https://github.com/user/weather-app'),
('E-commerce Store', 'https://picsum.photos/200?4', 'Full-stack online store with cart and checkout', NULL, 'https://github.com/user/store'),
('Task Manager', 'https://picsum.photos/200?5', 'Organize tasks with drag-and-drop', NULL, 'https://github.com/user/task-manager'),
('Chat Application', 'https://picsum.photos/200?6', 'Real-time chat using WebSockets', NULL, 'https://github.com/user/chat-app'),
('Recipe Finder', 'https://picsum.photos/200?7', 'Find recipes by ingredients', NULL, 'https://github.com/user/recipe-finder'),
('Fitness Tracker', 'https://picsum.photos/200?8', 'Track workouts and progress', NULL, 'https://github.com/user/fitness-tracker'),
('Finance Dashboard', 'https://picsum.photos/200?9', 'Visualize expenses and income', NULL, 'https://github.com/user/finance-dashboard'),
('Blog Platform', 'https://picsum.photos/200?10', 'Multi-user blog with comments', NULL, 'https://github.com/user/blog-platform'),
('Music Player', 'https://picsum.photos/200?11', 'Web-based music player', NULL, 'https://github.com/user/music-player'),
('Language Learning App', 'https://picsum.photos/200?12', 'Gamified language learning', NULL, 'https://github.com/user/language-app'),
('News Aggregator', 'https://picsum.photos/200?13', 'Aggregates news from multiple sources', NULL, 'https://github.com/user/news-aggregator'),
('Stock Tracker', 'https://picsum.photos/200?14', 'Tracks stock market prices', NULL, 'https://github.com/user/stock-tracker'),
('Photo Gallery', 'https://picsum.photos/200?15', 'Responsive online photo gallery', NULL, 'https://github.com/user/photo-gallery'),
('Video Streaming App', 'https://picsum.photos/200?16', 'Stream and share videos', NULL, 'https://github.com/user/video-streaming'),
('Event Planner', 'https://picsum.photos/200?17', 'Plan and manage events', NULL, 'https://github.com/user/event-planner'),
('Travel Planner', 'https://picsum.photos/200?18', 'Plan trips with itinerary management', NULL, 'https://github.com/user/travel-planner'),
('Online Quiz', 'https://picsum.photos/200?19', 'Create and take online quizzes', NULL, 'https://github.com/user/quiz-app'),
('Game Leaderboard', 'https://picsum.photos/200?20', 'Leaderboard for multiplayer games', NULL, 'https://github.com/user/game-leaderboard');

-- Insert some example tags for each project
INSERT INTO project_tags (project_id, tag) VALUES
(1, 'Python'), (1, 'Flask'), (1, 'HTML'), (1, 'CSS'),
(2, 'HTML'), (2, 'CSS'), (2, 'JavaScript'),
(3, 'JavaScript'), (3, 'API'), (3, 'Node.js'),
(4, 'React'), (4, 'Node.js'), (4, 'MongoDB'),
(5, 'React'), (5, 'Drag-and-Drop'), (5, 'Node.js'),
(6, 'WebSockets'), (6, 'Node.js'), (6, 'Express'),
(7, 'API'), (7, 'JavaScript'),
(8, 'React'), (8, 'Fitness'), (8, 'API'),
(9, 'D3.js'), (9, 'JavaScript'),
(10, 'Node.js'), (10, 'Express'), (10, 'MongoDB'),
(11, 'JavaScript'), (11, 'Audio'),
(12, 'Gamification'), (12, 'React'), (12, 'Node.js'),
(13, 'API'), (13, 'Node.js'),
(14, 'Finance'), (14, 'API'), (14, 'JavaScript'),
(15, 'CSS'), (15, 'Responsive Design'),
(16, 'Video'), (16, 'Streaming'), (16, 'Node.js'),
(17, 'Event Management'), (17, 'React'),
(18, 'Travel'), (18, 'Planning'), (18, 'API'),
(19, 'JavaScript'), (19, 'Quiz'), (19, 'Frontend'),
(20, 'Gaming'), (20, 'Leaderboard'), (20, 'Node.js');
