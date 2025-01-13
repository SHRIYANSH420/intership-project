require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./api/users');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173", // Replace with your client-side URL
  }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});