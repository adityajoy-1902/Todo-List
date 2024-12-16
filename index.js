
// Import dependencies
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

// Middleware
app.use(bodyParser.json());

// Initialize SQLite in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database initialized in memory.');
        db.run(`CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending'
        )`);
    }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Generate token endpoint
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Create a new task
app.post('/tasks', authenticateToken, (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    db.run(
        `INSERT INTO tasks (title, description) VALUES (?, ?)`,
        [title, description || null],
        function (err) {
            if (err) return res.status(500).json({ message: 'Failed to create task' });
            res.status(201).json({ id: this.lastID });
        }
    );
});

// Fetch all tasks
app.get('/tasks', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM tasks`, [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch tasks' });
        res.json(rows);
    });
});

// Fetch a task by ID
app.get('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch task' });
        if (!row) return res.status(404).json({ message: 'Task not found' });
        res.json(row);
    });
});

// Update a task's status
app.put('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ message: 'Failed to update task' });
        if (this.changes === 0) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete a task by ID
app.delete('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ message: 'Failed to delete task' });
        if (this.changes === 0) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
