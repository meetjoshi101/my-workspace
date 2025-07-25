const userService = require('../services/userService');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json({
                success: true,
                data: users,
                count: users.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const user = await userService.createUser(userData);
            res.status(201).json({
                success: true,
                data: user,
                message: 'User created successfully'
            });
        } catch (error) {
            const statusCode = error.message.includes('already exists') || 
                              error.message.includes('required') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await userService.updateUser(id, userData);
            res.json({
                success: true,
                data: user,
                message: 'User updated successfully'
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 :
                              error.message.includes('required') || 
                              error.message.includes('already taken') ? 400 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(id);
            res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUsersWithPagination(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await userService.getUsersWithPagination(page, limit);
            
            res.json({
                success: true,
                data: result.users,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUserCount(req, res) {
        try {
            const count = await userService.getUserCount();
            res.json({
                success: true,
                count: count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new UserController();
