const express = require('express')
const app = express()
const users = require('./MOCK_DATA.json')
const PORT = 3000

// routes
app.get('/users', (req, res) => {
  return res.json(users)
})

// query string send html response
app.get('/api/users', (req, res) => {
  const html = `
    <h1 style="text-align: center;">Users</h1>
    <ul>
      ${users.map(user => {
        return `<li><span style="font-weight: bold; color: red">${user.id}</span> ${user.first_name} ${user.last_name}</li>`
      })}
    </ul>
  `
  res.send(html)
})

app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const user = users.find(user => user.id == id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  return res.json(user)
})

app.post('/users', (req, res) => {
  return res.json({ message: 'User created' })
})
app.patch('/users/:id', (req, res) => {
  return res.json({ message: 'User updated' })
})
app.delete('/users/:id', (req, res) => {
  return res.json({ message: 'User deleted' })
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
