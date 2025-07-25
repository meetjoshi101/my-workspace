const databaseManager = require('../database/database');

class UserRepository {
    constructor() {
        this.User = null;
    }

    getModel() {
        if (!this.User) {
            const models = databaseManager.getModels();
            this.User = models.User;
        }
        return this.User;
    }

    async findAll(options = {}) {
        try {
            const User = this.getModel();
            const users = await User.findAll({
                order: [['created_at', 'DESC']],
                ...options
            });
            return users;
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const User = this.getModel();
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const User = this.getModel();
            const user = await User.findOne({ where: { email } });
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    async create(userData) {
        try {
            const User = this.getModel();
            const user = await User.create(userData);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const User = this.getModel();
            const [updatedRowsCount] = await User.update(userData, {
                where: { id },
                returning: true
            });
            
            if (updatedRowsCount === 0) {
                throw new Error('User not found');
            }
            
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const User = this.getModel();
            const deletedRowsCount = await User.destroy({
                where: { id }
            });
            
            return deletedRowsCount > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async count(where = {}) {
        try {
            const User = this.getModel();
            const count = await User.count({ where });
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            throw error;
        }
    }

    async findWithPagination(page = 1, limit = 10, where = {}) {
        try {
            const User = this.getModel();
            const offset = (page - 1) * limit;
            
            const { rows: users, count: total } = await User.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
            
            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Error finding users with pagination:', error);
            throw error;
        }
    }
}

module.exports = new UserRepository();
