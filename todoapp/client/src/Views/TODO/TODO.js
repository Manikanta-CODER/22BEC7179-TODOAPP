import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO() {
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [todoData, setTodoData] = useState(dummy);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const apiData = await getTodo();
        setTodoData(apiData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodo();
  }, []);

  const getTodo = async () => {
    const options = {
      method: 'GET',
      url: 'http://localhost:8000/api/todo',
      headers: {
        accept: 'application/json',
      },
    };
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const addTodo = async () => {
    const options = {
      method: 'POST',
      url: 'http://localhost:8000/api/todo',
      headers: {
        accept: 'application/json',
      },
      data: {
        title: newTodo,
        description: newDescription,
      },
    };
    try {
      const response = await axios.request(options);
      setTodoData(prevData => [...prevData, response.data.newTodo]);
      setNewTodo('');
      setNewDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    const options = {
      method: 'DELETE',
      url: `http://localhost:8000/api/todo/${id}`,
      headers: {
        accept: 'application/json',
      },
    };
    try {
      await axios.request(options);
      setTodoData(prevData => prevData.filter(todo => todo._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTodo = async (id) => {
    const todoToUpdate = todoData.find(todo => todo._id === id);
    const options = {
      method: 'PATCH',
      url: `http://localhost:8000/api/todo/${id}`,
      headers: {
        accept: 'application/json',
      },
      data: {
        done: !todoToUpdate.done,
      },
    };
    try {
      const response = await axios.request(options);
      setTodoData(prevData =>
        prevData.map(todo => (todo._id === id ? response.data.updatedTodo : todo))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const saveEditTodo = async (id) => {
    const options = {
      method: 'PATCH',
      url: `http://localhost:8000/api/todo/${id}`,
      headers: {
        accept: 'application/json',
      },
      data: {
        title: editTitle,
        description: editDescription,
      },
    };
    try {
      const response = await axios.request(options);
      setTodoData(prevData =>
        prevData.map(todo => (todo._id === id ? response.data.updatedTodo : todo))
      );
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={Styles.ancestorContainer}>
      <div className={Styles.headerContainer}>
        <h1>Tasks</h1>
        <span>
          <input
            className={Styles.todoInput}
            type='text'
            name='New Todo'
            value={newTodo}
            placeholder='Title'
            onChange={event => setNewTodo(event.target.value)}
          />
          <input
            className={Styles.todoInput}
            type='text'
            name='New Description'
            value={newDescription}
            placeholder='Description'
            onChange={event => setNewDescription(event.target.value)}
          />
          <button
            id='addButton'
            name='add'
            className={Styles.addButton}
            onClick={addTodo}
          >
            + New Todo
          </button>
        </span>
      </div>
      <div id='todoContainer' className={Styles.todoContainer}>
        {loading ? (
          <p style={{ color: 'white' }}>Loading...</p>
        ) : todoData.length > 0 ? (
          todoData.map((entry) => (
            <div key={entry._id} className={Styles.todo}>
              {editing === entry._id ? (
                <>
                  <input
                    type='text'
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    type='text'
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => saveEditTodo(entry._id)}>Save</button>
                </>
              ) : (
                <>
                  <span className={Styles.infoContainer}>
                    <input
                      type='checkbox'
                      checked={entry.done}
                      onChange={() => updateTodo(entry._id)}
                    />
                    {entry.title}
                    <p>{entry.description}</p>
                  </span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setEditing(entry._id);
                      setEditTitle(entry.title);
                      setEditDescription(entry.description);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteTodo(entry._id)}
                  >
                    Delete
                  </span>
                </>
              )}
            </div>
          ))
        ) : (
          <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
        )}
      </div>
    </div>
  );
}
