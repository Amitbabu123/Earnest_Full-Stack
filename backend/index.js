const express = require('express');
const db = require('./db'); 
const bodyParser = require('body-parser');
const cors = require('cors'); 
const PORT = process.env.PORT || 8000;
const app = express();


app.use(bodyParser.json());
app.use(cors()); 

// 1. Retrieve all tasks
app.get("/tasks", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tasks2');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Add a new task
app.post("/tasks", async (req, res) => {
    const { title, description, completed } = req.body;
    try {
        const result = await db.query('INSERT INTO tasks2 (title, description, completed) VALUES ($1, $2, $3) RETURNING *', [title, description, completed]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Update a task's status
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const result = await db.query('UPDATE tasks2 SET completed = $1 WHERE id = $2 RETURNING *', [completed, id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM tasks2 WHERE id = $1 RETURNING *', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
