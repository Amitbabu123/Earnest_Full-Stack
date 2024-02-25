import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { InputGroup, Form, Alert } from 'react-bootstrap';
import { BASE_URL } from './url'; // Importing BASE_URL constant

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}tasks`); // Using BASE_URL here
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description) {
      setError("Please enter both title and description");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}tasks`, newTask); // Using BASE_URL here
      const newTaskId = response.data.id;
      setTasks([...tasks, { id: newTaskId, ...newTask, completed: false }]);
      setNewTask({ title: "", description: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await axios.put(`${BASE_URL}tasks/${id}`, { // Using BASE_URL here
        completed: !completed,
      });
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !completed };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}tasks/${id}`); // Using BASE_URL here
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container-fluid" style={{ paddingBottom: '20px', marginBottom: "5px", backgroundColor: '#659DBD' }}>
      <div className="row">
        <div className="col">
          <div className="col text-center">
            <h1>Task Manager</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }}
          >
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Title
              </InputGroup.Text>
              <Form.Control
                type="text"
                aria-label="Title"
                aria-describedby="inputGroup-sizing-default"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="description-label">
                Description
              </InputGroup.Text>
              <Form.Control
                type="text"
                aria-label="Description"
                aria-describedby="description-label"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </InputGroup>
            {error && <Alert variant="danger">{error}</Alert>}
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col">
          <div
            className="task-list-container"
            style={{ marginBottom: "50px", backgroundColor: '#507794', padding: '10px', borderRadius: '5px' }} // Adjusted background color, added padding and borderRadius
          >
            <ul
              className="list-group"
              style={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: '#8D8741', marginBottom: '5px', borderRadius: '3px' }} // Adjusted background color and added marginBottom and borderRadius
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        handleToggleComplete(task.id, task.completed)
                      }
                    />
                    <span
                      className={
                        task.completed
                          ? "text-decoration-line-through ms-2"
                          : "ms-2"
                      }
                    >
                      {task.title} - {task.description}
                    </span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="fixed-bottom text-center" style={{ paddingBottom: '20px', backgroundColor: '#659DBD' }}>
        Created by Amit Kumar
      </footer>
    </div>
  );
}

export default App;
