
const router = require('express').Router();
const { signup, login, updateUser, deleteUser } = require('./user.service');
const auth = require('../middleware/auth');

router.post('/', signup);
router.post('/login', login);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
