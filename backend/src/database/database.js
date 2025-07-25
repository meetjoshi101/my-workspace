const sequelizeConnection = require('./connection/sequelize');
const models = require('./models');

class DatabaseManager {
    constructor() {
        this.connection = sequelizeConnection;
        this.models = models;
        this.isConnected = false;
    }

    async initialize() {
        try {
            // Connect to database
            await this.connection.connect();
            
            // Initialize models
            await this.models.initialize();
            
            // Sync database (create tables if they don't exist)
            await this.connection.sync({ alter: true });
            
            this.isConnected = true;
            console.log('Database with Sequelize ORM initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    getConnection() {
        if (!this.isConnected) {
            throw new Error('Database not connected. Call initialize() first.');
        }
        return this.connection;
    }

    getModels() {
        if (!this.isConnected) {
            throw new Error('Database not connected. Call initialize() first.');
        }
        return this.models.getModels();
    }

    async close() {
        try {
            await this.connection.close();
            this.isConnected = false;
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error);
            throw error;
        }
    }
}

// Create singleton instance
const databaseManager = new DatabaseManager();

module.exports = databaseManager;
