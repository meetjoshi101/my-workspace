const databaseManager = require('../database/database');

class UserRepository {
    constructor() {
        this.db = null;
    }

    getDatabase() {
        if (!this.db) {
            this.db = databaseManager.getConnection();
        }
        return this.db;
    }

    async findAll() {
        try {
            const db = this.getDatabase();
            const users = await db.all('SELECT * FROM users ORDER BY created_at DESC');
            return users;
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const db = this.getDatabase();
            const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
            return user;
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const db = this.getDatabase();
            const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    async create(userData) {
        try {
            const { name, email } = userData;
            const db = this.getDatabase();
            
            const result = await db.run(
                'INSERT INTO users (name, email) VALUES (?, ?)',
                [name, email]
            );
            
            return await this.findById(result.id);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id, userData) {
        try {
            const { name, email } = userData;
            const db = this.getDatabase();
            
            await db.run(
                'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, email, id]
            );
            
            return await this.findById(id);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const db = this.getDatabase();
            const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = new UserRepository();
