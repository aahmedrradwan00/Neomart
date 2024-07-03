const app = require('./app.js');
const dotenv = require('dotenv');
const dbConnection = require('./config/database.js.js');

dotenv.config({ path: './config.env' });

// Connect with db
dbConnection();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
