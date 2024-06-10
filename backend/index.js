const express = require('express');
const app = express();
const port = process.env.PORT || 4040;
const cors = require('cors');
const mongoose = require('mongoose');

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB Configuration using Mongoose
const uri = "mongodb+srv://taskmgt:bdu8QZMySbHFhRin@taskapplication1.a50tmd1.mongodb.net/TaskApplication1?retryWrites=true&w=majority";

mongoose.connect(uri);

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    }
});

const Task = mongoose.model('Task', taskSchema);

// CRUD operations
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
        console.log(tasks)
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.send('Task deleted');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Confirm a successful connection
mongoose.connection.once('open', () => {
    console.log("Successfully connected to MongoDB!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
