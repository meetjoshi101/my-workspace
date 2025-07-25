const sequelizeConnection = require('../connection/sequelize');

// Import model definitions
const UserModel = require('./User');

class Models {
    constructor() {
        this.sequelize = null;
        this.User = null;
    }

    async initialize() {
        try {
            // Get Sequelize instance
            this.sequelize = sequelizeConnection.getSequelize();
            
            // Initialize models
            this.User = UserModel(this.sequelize);
            
            // Set up associations here when you have more models
            // Example: this.User.hasMany(this.Post);
            
            console.log('Models initialized successfully');
            return this;
        } catch (error) {
            console.error('Error initializing models:', error);
            throw error;
        }
    }

    getModels() {
        return {
            User: this.User,
            sequelize: this.sequelize
        };
    }
}

// Create singleton instance
const models = new Models();

module.exports = models;
