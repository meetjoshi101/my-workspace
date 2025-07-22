const sqliteConnection = require('./connection/sqlite');

class DatabaseManager {
    constructor() {
        this.connection = sqliteConnection;
        this.isConnected = false;
    }

    async initialize() {
        try {
            await this.connection.connect();
            this.isConnected = true;
            console.log('Database initialized successfully');
            
            // Run initial setup/migrations if needed
            await this.createTables();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    async createTables() {
        try {
            // Example table creation - you can modify this based on your needs
            await this.connection.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('Tables created successfully');
        } catch (error) {
            console.error('Error creating tables:', error);
            throw error;
        }
    }

    getConnection() {
        if (!this.isConnected) {
            throw new Error('Database not connected. Call initialize() first.');
        }
        return this.connection;
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
