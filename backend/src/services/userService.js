const userRepository = require('../repositories/userRepository');
const { ValidationError, UniqueConstraintError } = require('sequelize');

class UserService {
    async getAllUsers(options = {}) {
        try {
            return await userRepository.findAll(options);
        } catch (error) {
            throw new Error(`Failed to get users: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await userRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to get user: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            const { name, email } = userData;
            
            // Basic validation
            if (!name || !email) {
                throw new Error('Name and email are required');
            }

            return await userRepository.create({ name, email });
        } catch (error) {
            if (error instanceof ValidationError) {
                const messages = error.errors.map(err => err.message);
                throw new Error(`Validation error: ${messages.join(', ')}`);
            }
            
            if (error instanceof UniqueConstraintError) {
                throw new Error('User with this email already exists');
            }
            
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            const { name, email } = userData;
            
            // Basic validation
            if (!name || !email) {
                throw new Error('Name and email are required');
            }

            // Check if user exists
            await this.getUserById(id);

            return await userRepository.update(id, { name, email });
        } catch (error) {
            if (error instanceof ValidationError) {
                const messages = error.errors.map(err => err.message);
                throw new Error(`Validation error: ${messages.join(', ')}`);
            }
            
            if (error instanceof UniqueConstraintError) {
                throw new Error('Email is already taken by another user');
            }
            
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    async deleteUser(id) {
        try {
            // Check if user exists
            await this.getUserById(id);

            const deleted = await userRepository.delete(id);
            if (!deleted) {
                throw new Error('Failed to delete user');
            }
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    async getUsersWithPagination(page = 1, limit = 10, filters = {}) {
        try {
            return await userRepository.findWithPagination(page, limit, filters);
        } catch (error) {
            throw new Error(`Failed to get users with pagination: ${error.message}`);
        }
    }

    async getUserCount(filters = {}) {
        try {
            return await userRepository.count(filters);
        } catch (error) {
            throw new Error(`Failed to get user count: ${error.message}`);
        }
    }
}

module.exports = new UserService();
