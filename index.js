const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ajdb:Talofa123@cluster0-a37uh.mongodb.net/herodatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

var Dog = mongoose.model("Dog", {
  name: {
    type:String, 
    requred: [true, "Name required"]
  },
  breed: {
    type:String, 
    requred: [true, "Breed required"]
  },
  age: {
    type:String, 
    requred: [true, "Age required"]
  },
  url: {
    type:String, 
    requred: [true, "URL required"]
  }
});

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/dogs", function(req, res) {
  console.log("GET called");
  Dog.find({}).then(function(dogs) {
    res.json(dogs);
  });
});

app.post("/dogs", function(req, res) {
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
  console.log("Put on server called");
  console.log(req.body);
  let dogId = req.params.dogId;
  Dog.findByIdAndUpdate({ _id: dogId })
    .then(function(dog) {
      dog.name = req.body.name;
      dog.age = req.body.age;
      dog.breed = req.body.breed;
      dog.url = req.body.url
      dog.save().then(function() {
        res.sendStatus(202);
      });
    })
    .catch(function() {
      res.sendStatus(400);
    });
});

app.listen(port, () => console.log(`listening on port ${port}!`));
