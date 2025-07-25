const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /api/users - Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

// GET /api/users/paginated - Get users with pagination
router.get('/paginated/list', userController.getUsersWithPagination);

// GET /api/users/count - Get user count
router.get('/count/total', userController.getUserCount);

module.exports = router;
