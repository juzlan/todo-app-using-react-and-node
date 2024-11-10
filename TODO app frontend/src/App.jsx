import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [searchText, setSearchText] = useState('');

  // Fetch tasks from backend and local storage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    } else {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (taskText) {
      try {
        const response = await axios.post('http://localhost:5000/tasks', { text: taskText });
        setTasks([...tasks, response.data]);
        setTaskText('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTaskCompletion = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search tasks by names"
        />
      </div>
      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span className="task-text">{task.text}</span>
              <button onClick={() => toggleTaskCompletion(task.id)} className="toggle-button">
                {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </button>
              <button onClick={() => deleteTask(task.id)} className="delete-button">Delete</button>
            </li>
          ))
        ) : (
          <li className="no-task-message">No task found</li>
        )}
      </ul>
    </div>
  );
};

export default App;
