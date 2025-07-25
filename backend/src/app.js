const express = require('express');
const cors = require('cors');
const databaseManager = require('./database/database');
const userRoutes = require('./router/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database test route
app.get('/db-test', async (req, res) => {
    try {
        const models = databaseManager.getModels();
        const users = await models.User.findAll();
        res.json({ 
            status: 'Database connected with Sequelize ORM', 
            users: users,
            userCount: users.length,
            timestamp: new Date().toISOString() 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database error', 
            message: error.message 
        });
    }
});

// ORM info route
app.get('/orm-info', async (req, res) => {
    try {
        const models = databaseManager.getModels();
        const sequelize = models.sequelize;
        
        // Get database info
        const dbInfo = {
            dialect: sequelize.getDialect(),
            database: sequelize.getDatabaseName(),
            models: Object.keys(sequelize.models),
            version: require('sequelize/package.json').version
        };
        
        res.json({
            status: 'Sequelize ORM Active',
            info: dbInfo,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'ORM error', 
            message: error.message 
        });
    }
});

// Initialize database when app starts
async function initializeApp() {
    try {
        await databaseManager.initialize();
        console.log('App initialized with database connection');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        process.exit(1);
    }
}

// Start database initialization
initializeApp();

module.exports = app;