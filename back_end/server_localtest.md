## Creating a local DB and then testing out front end functions 

1. Create a mySQL database using either mySQL workbench or command line

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS ticket_management;
USE ticket_management;

-- Create users table for team members
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cards (tickets) table
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority INT NOT NULL DEFAULT 1,
    status ENUM('todo', 'in-progress', 'done') NOT NULL DEFAULT 'todo',
    author_id INT NOT NULL,  -- Changed to reference user id
    designee_id INT,        -- Changed to reference user id, nullable for unassigned
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (designee_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert some initial team members
INSERT INTO users (name, email) VALUES
    ('Donald Trump', 'donald@example.com'),
    ('Kamala Harris', 'kamala@example.com'),
    ('Unassigned', NULL);

-- Insert some sample tickets
INSERT INTO cards (title, description, priority, status, author_id, designee_id) VALUES
    ('Fix login bug', 'Users cannot login with special characters', 2, 'todo', 1, 2),
    ('Update UI', 'Redesign dashboard layout', 1, 'in-progress', 2, 1),
    ('Database optimization', 'Improve query performance', 3, 'done', 1, NULL);

-- Useful queries for your API endpoints:

-- Get all tickets with user names (for fetchTickets)
SELECT
    c.id,
    c.title,
    c.description,
    c.priority,
    c.status,
    u1.name AS author,
    u2.name AS designee
FROM cards c
LEFT JOIN users u1 ON c.author_id = u1.id
LEFT JOIN users u2 ON c.designee_id = u2.id;

-- Get all users (for fetchTeamMembers)
SELECT name FROM users;

-- Create a new ticket (example)
INSERT INTO cards (title, description, priority, status, author_id, designee_id)
VALUES ('New Task', 'Task description', 1, 'todo', 1, 2);

-- Update ticket status (for handleDragEnd)
UPDATE cards SET status = 'in-progress' WHERE id = 1;

-- Additional helpful indexes
CREATE INDEX idx_status ON cards(status);
CREATE INDEX idx_designee_id ON cards(designee_id);
CREATE INDEX idx_author_id ON cards(author_id);

```

2. Next open `server_localtest.js` on local file and alter lines 10 - 13 to match your username, password, port of your mySQL instance

3. Startup your mySQL instance and ensure that it is running on the local port (Default is 3306)

4. Open two seperate terminals, one to spin up the server on the backend, one to spin up the front end

#### Server Side Spin Up
`cd TrelloBoard/back_end && node server_localtest.js`
You should see the output *Server running on port xxxx* if it was successful

#### Front End Spin Up
'cd TrelloBoard/front_end && npm start' 
You should see the following output:
> You can now view front_end in the browser.

>Local: http://localhost:3000
>On Your Network: http://192.168.0.235:3000

>Note that the development build is not optimized.
>To create a production build, use npm run build.

>webpack compiled successfully

>Once your browser (Chrome) launches the app, in the url append the URL to be http://localhost:3000/overview , this >will bypass the login page for now.
