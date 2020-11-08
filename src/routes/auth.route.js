const express = require('express');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

router.post('/auth/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/auth/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
