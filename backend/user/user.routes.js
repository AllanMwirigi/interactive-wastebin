
const router = require('express').Router();
const { signup, login, updateUser, deleteUser, getAllUsers } = require('./user.service');
const auth = require('../middleware/auth');

router.post('/', signup);
router.post('/login', login);
router.get('/', auth, getAllUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
