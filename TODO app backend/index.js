const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let tasks = []; // In-memory task storage

// Fetch all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ message: 'Invalid task text' });
  }
  const task = { id: Date.now(), text: text.trim(), completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Toggle task completion
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed; // Toggling completed status
    res.json(task); // Returning the updated task
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== taskId);
  if (tasks.length < initialLength) {
    res.json({ message: 'Task deleted' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
