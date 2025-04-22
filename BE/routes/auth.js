const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const DUMMY_USER = {
  username: 'admin',
  password: 'admin123' // In production, never store plain passwords!
};

router.post('/login', (req, res) => {
  const { identifier, password } = req.body;

  if (identifier === DUMMY_USER.username && password === DUMMY_USER.password) {
    const token = jwt.sign({ username: identifier }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
