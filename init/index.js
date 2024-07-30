const mongoose = require("mongoose");
const initData = require("./data.js"); // initData is object and we have key in it ny the name of data
const Person = require("../models/person.js");

const MONGO_URL="mongodb://127.0.0.1:27017/AuthAPI";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();
  } catch (err) {
    console.error("Error connecting to DB or initializing data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

// const initDB = async () => {
//   try {
//     await Person.deleteMany({}); // Clear old data
//     await Person.insertMany(initData.data); // Insert new data
//     console.log("Data was initialized");
//   } catch (err) {
//     console.error("Error initializing data:", err);
//   }
// };

// If your password is not being stored in hashed form, it's likely that the pre('save') middleware is not being executed. This can happen if you use insertMany since it bypasses middleware by default.

// One solution is to iterate through each user and save them individually. 
// thank you chatGPT.

const initDB = async () => {
  try {
    await Person.deleteMany({}); // Clear old data

    for (let userData of initData.data) {
      const user = new Person(userData);
      await user.save(); // This will trigger the pre('save') middleware
    }
    
    console.log("Data was initialized");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};


main();