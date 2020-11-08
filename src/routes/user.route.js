const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create-user', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Email is duplicate' });
  }
});

router.get('/get-user/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const result = await User.findById(_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get('/get-all-user', auth, async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.patch('/user/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const { user } = req;
    const allowsUpdate = Object.keys(user.toObject());
    const isValidUpdate = updates.every((e) => allowsUpdate.includes(e));
    if (isValidUpdate) {
      // eslint-disable-next-line no-return-assign
      updates.forEach((e) => (user[e] = req.body[e]));
      const result = await user.save();
      res.status(200).json(result);
    }
    res.status(400).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/user/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/user/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return callback('File must be jpg type');
    }
    callback(undefined, true);
  },
}).single('avatar');

router.post('/user/me/avatar', auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).send({ error: err.message });
    }

    const buffer = await sharp(req.user.avatar)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(200).send();
  });
});

router.delete('/user/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  try {
    await req.user.save();
    res.status(200).json({ message: 'Delete successfully' });
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/user/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      res.status(404).send();
    }

    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
