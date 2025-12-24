-- Seed Badges
INSERT INTO badges (name, description, condition_type, condition_value, xp_reward) VALUES
('First Blood', 'Complete your first task.', 'TotalTasks', 1, 100),
('Apprentice', 'Complete 10 tasks.', 'TotalTasks', 10, 250),
('Centurion', 'Complete 100 tasks.', 'TotalTasks', 100, 1000),
('Consistency is Key', 'Maintain a 3-day streak.', 'Streak', 3, 300),
('Unstoppable', 'Maintain a 7-day streak.', 'Streak', 7, 700),
('God Mode', 'Maintain a 30-day streak.', 'Streak', 30, 3000),
('Ritual Master', 'Create 5 recurring task templates.', 'RRule', 5, 500);
