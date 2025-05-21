const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let database;

const mongoConnect = (callback) => {
  MongoClient.connect("")
    .then((client) => {
      console.log("Connected to MongoDB Atlas!");
      database = client.db("shop"); 
      callback();
    })
    .catch((error) => console.error("Connection error:", error));
};

const getDatabase = () => {
  if (!database) {
    throw "No database found!";
  }
  return database;
};

module.exports = { mongoConnect, getDatabase };
