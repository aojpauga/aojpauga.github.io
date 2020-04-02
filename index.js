const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");

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
    required: true,
    createIndexes: true
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

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "null,aojpauga.github.io" }));
app.use(
  session({
    secret: "jytfgvjytf98795445676",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: "email",
      passwordField: "plainPassword"
    },
    function(email, plainPassword, done) {
      User.findOne({ email: email })
        .then(function(user) {
          if (!user) {
            return done(null, false);
          } else {
            user.verifyPassword(plainPassword, function(result) {
              if (result) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          }
        })
        .catch(function(err) {
          done(err);
        });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }).then(function(user) {
    done(null, user);
  });
});

app.post("/session", passport.authenticate("local"), function(req, res) {
  console.log("user", req.user);
  res.sendStatus(201);
});

app.get("/session", function(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
    console.log("no usr");
  }
});

app.post("/users", function(req, res) {
  // Store hash in your password DB.

  let user = new User({
    name: req.body.name,
    email: req.body.email
  });
  user.setEcryptedPassword(req.body.plainPassword, function() {
    user
      .save()
      .then(function() {
        res.sendStatus(201);
      })
      .catch(function(err) {
        if (err.errors) {
          var messages = {};
          for (let e in err.errors) {
            messages[e] = err.errors[e].message;
          }
          res.status(422).json(messages);
        } else {
          res.sendStatus(500);
        }
      });
  });
});

app.get("/dogs", function(req, res) {
  //console.log("user", req.user);
  Dog.find({}).then(function(dogs) {
    res.json(dogs);
  });
});

app.post("/dogs", function(req, res) {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  console.log("Posted the body", req.body);
  req.body.name;

  let dog = new Dog({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    url: req.body.url
  });

  dog.save().then(function() {
    res.sendStatus(201);
  });
});

app.delete("/dogs/:dogId", function(req, res) {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  console.log("DELETE Called");
  let dogId = req.params.dogId;
  Dog.findOneAndDelete({ _id: dogId })
    .then(function(dog) {
      if (dog) {
        res.json(dog);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function() {
      res.sendStatus(400);
    });
});

app.put("/dogs/:dogId", function(req, res) {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }
  console.log("Put on server called");
  console.log(req.body);
  let dogId = req.params.dogId;
  Dog.findByIdAndUpdate({ _id: dogId })
    .then(function(dog) {
      dog.name = req.body.name;
      dog.age = req.body.age;
      dog.breed = req.body.breed;
      dog.url = req.body.url;
      dog.save().then(function() {
        res.sendStatus(202);
      });
    })
    .catch(function() {
      res.sendStatus(400);
    });
});

app.listen(port, () => console.log(`listening on port ${port}!`));
