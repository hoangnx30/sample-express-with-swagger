const express = require('express');

const Task = require('../models/Task');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/create-task', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    const result = await task.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/get-all-task', auth, async (req, res) => {
  let match = {};
  const sort = {};

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  if (req.query.completed) {
    match = {
      completed: req.query.completed === 'true',
    };
  }
  try {
    const user = await User.findById(req.user._id);
    await user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit, 10),
          skip: parseInt(req.query.skip, 10),
          sort,
        },
      })
      .execPopulate();
    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/get-task/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await Task.findOne({ owner: _id });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch('/task/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await Task.findOneAndUpdate({ _id, owner: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (result) {
      res.status(200).json(result);
    }
    res.status(500).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
