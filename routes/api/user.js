const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const staticUser = { id: 1, mail: 'test@mail.ru' };

  res.status(201);
  res.json(staticUser);
});

module.exports = router;
