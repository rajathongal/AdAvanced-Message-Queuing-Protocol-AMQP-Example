const app = require("./server");
const configuration = require('./configuration/configurations');
const connectDB = require("./configuration/database");

//start server
const PORT = configuration.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));

//INIT database connection
connectDB()