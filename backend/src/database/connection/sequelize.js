const { Sequelize } = require('sequelize');
const path = require('path');

class SequelizeConnection {
    constructor() {
        this.sequelize = null;
        this.dbPath = path.join(__dirname, '../../../database.sqlite');
    }

    async connect() {
        try {
            this.sequelize = new Sequelize({
                dialect: 'sqlite',
                storage: this.dbPath,
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                define: {
                    timestamps: true,
                    underscored: true,
                    createdAt: 'created_at',
                    updatedAt: 'updated_at'
                },
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });

            // Test the connection
            await this.sequelize.authenticate();
            console.log('Sequelize connection established successfully');
            
            return this.sequelize;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.sequelize) {
                await this.sequelize.close();
                console.log('Sequelize connection closed');
            }
        } catch (error) {
            console.error('Error closing Sequelize connection:', error);
            throw error;
        }
    }

    getSequelize() {
        if (!this.sequelize) {
            throw new Error('Sequelize not initialized. Call connect() first.');
        }
        return this.sequelize;
    }

    async sync(options = {}) {
        try {
            if (!this.sequelize) {
                throw new Error('Sequelize not initialized');
            }
            
            await this.sequelize.sync(options);
            console.log('Database synchronized successfully');
        } catch (error) {
            console.error('Error synchronizing database:', error);
            throw error;
        }
    }
}

// Create singleton instance
const sequelizeConnection = new SequelizeConnection();

module.exports = sequelizeConnection;
