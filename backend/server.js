const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server URL: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Graceful shutdown...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM. Graceful shutdown...');
    process.exit(0);
});