//imports
const mongoose = require("mongoose");
const configuration = require('./configurations');

//temp var init
let connectionString = "";
mongoose.Promise = global.Promise;

//connection logic
if (process.env.NODE_ENV === "production") {
  
    connectionString =  configuration.DB_URL;

  } else if (process.env.NODE_ENV === "development") {

    connectionString = configuration.DB_URL;

  } else {

    connectionString = configuration.DB_URL;
  }

  const connectDB = async () => {
    try {
      await mongoose.connect(connectionString, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        dbName: "gomigo",
      });
  
      console.log("MongoDB connected...");
    } catch (err) {
      console.log(err.message);
      process.exit(1);
    }
};

  
module.exports = connectDB; 
