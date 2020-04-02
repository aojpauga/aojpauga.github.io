const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(
  "mongodb+srv://ajdb:Talofa123@cluster0-a37uh.mongodb.net/herodatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  }
});

userSchema.methods.setEcryptedPassword = function(
  plainPassword,
  callbackFunction
) {
  //this is the user instance
  bcrypt.hash(plainPassword, 12).then(hash => {
    this.encryptedPassword = hash;
    callbackFunction();
  });
};

userSchema.methods.verifyPassword = function(plainPassword, callbackFunction) {
  bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
    callbackFunction(result);
  });
};

var User = mongoose.model("User", userSchema);

var Dog = mongoose.model("Dog", {
  name: {
    type: String,
    requred: [true, "Name required"]
  },
  breed: {
    type: String,
    requred: [true, "Breed required"]
  },
  age: {
    type: String,
    requred: [true, "Age required"]
  },
  url: {
    type: String,
    requred: [true, "URL required"]
  }
});

module.exports = {
  Dog: Dog,
  User: User
};
