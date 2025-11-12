require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
console.log("Mongo URI:", mongoURI);