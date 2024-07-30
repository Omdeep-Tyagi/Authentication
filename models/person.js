const mongoose= require("mongoose");
const bcrypt=require("bcrypt");

//defining Person schema
const personSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
});


//hashing the password before saving using bcrypt
personSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // generate salt
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
});

// Use bcrypt to compare the provided password with the hashed password
personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

// ompass ---> badndidejdcbekw2
// while login---> ompass
// now above fuction working is... badndidejdcbekw2 --> extract salt
// salt+ompass ---> convert to hash ---> badndidejdcbekw2
// compair both hash

//creating Person model
const Person= mongoose.model('Person',personSchema);

module.exports=Person;