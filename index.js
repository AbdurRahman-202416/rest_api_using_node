const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const users = require('./MOCK_DATA.json');
const PORT = 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// ✅ GET all users
app.get('/users', (req, res) => {
  return res.json(users);
});

// ✅ GET a single user by ID
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(user);
});

// ✅ POST: Create a new user
app.post('/users', (req, res) => {
  const { first_name, last_name, email, gender, job_title } = req.body;
  
  if (!first_name || !last_name || !email || !gender || !job_title) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1000;
  const newUser = { id: newId, first_name, last_name, email, gender, job_title };
  
  users.push(newUser);
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(201).json({ status: 'success', user: newUser });
  });
});

// ✅ PUT: Update a user (Full Update)
app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { first_name, last_name, email, gender, job_title } = req.body;
  
  if (!first_name || !last_name || !email || !gender || !job_title) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  users[index] = { id, first_name, last_name, email, gender, job_title };
  
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json({ status: 'success', user: users[index] });
  });
});

// ✅ PATCH: Edit user (Partial Update)
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json({ status: 'success', user: updatedUser });
  });
});

// ✅ DELETE: Remove a user
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users.splice(index, 1)[0];
  
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.json({ status: 'success', user: deletedUser });
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✅`);
});
