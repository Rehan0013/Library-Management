require('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/db/db.js');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
