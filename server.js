//basic setup
const express=require("express");
const app=express();
const mongoose = require("mongoose");
const passport =require("passport");
const localStrategy = require("passport-local").Strategy;
const Person = require('./models/person');


// Mongoose debug mode
mongoose.set('debug', true);

// connecting with DB
const MONGO_URL="mongodb://127.0.0.1:27017/AuthAPI"; 

main()
    .then(()=>{
      console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Increase to 5 seconds
        socketTimeoutMS: 45000, // Increase to 45 seconds
    });
}

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//initialize passport
app.use(passport.initialize());


// verification function in localStrategy: that check provided username and password are correct or not...by compairing from database
passport.use(new localStrategy(async (username,password,done)=>{ //callback function 
    //authentication logic here
    try
    {
        const user = await Person.findOne({ username });
        if (!user) //user nhi mila
            return done(null, false, { message: 'Incorrect username.' });
        //now we get user...checking for password now
        //const isPasswordMatch= user.password === password ? true : false; //can use it without using bcrypt in your code
        const isPasswordMatch = await user.comparePassword(password);
        if (isPasswordMatch) // password match
            return done(null, user);
        else
            return done(null, false, { message: 'Incorrect password.' });

    }
    catch(err)
    {
        return done(err);
    }

}));

// Authentication Middleware
const localAuthMiddleware = passport.authenticate("local", { session: false });


// Protected routes
app.get("/", localAuthMiddleware, (req, res) => {
    res.send("Hi! I am root, you are authenticated.");
  });


// Public routes
app.get("/public", (req, res) => {
    res.send("This is a public route. Anyone can access this.");
  });

  
// starting server at port 8080
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

  
