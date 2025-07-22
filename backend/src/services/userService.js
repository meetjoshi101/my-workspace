const userRepository = require('../repositories/userRepository');

class UserService {
    async getAllUsers() {
        try {
            return await userRepository.findAll();
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
            
            // Validate input
            if (!name || !email) {
                throw new Error('Name and email are required');
            }

            // Check if user already exists
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            return await userRepository.create({ name, email });
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    async updateUser(id, userData) {
        try {
            const { name, email } = userData;
            
            // Validate input
            if (!name || !email) {
                throw new Error('Name and email are required');
            }

            // Check if user exists
            await this.getUserById(id);

            // Check if email is already taken by another user
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser && existingUser.id !== parseInt(id)) {
                throw new Error('Email is already taken by another user');
            }

            return await userRepository.update(id, { name, email });
        } catch (error) {
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
}

module.exports = new UserService();
