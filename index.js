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
  name: String,
  breed: String,
  age: String,
  url: String
});

const app = express();
const port = 3000;
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
  let dogId = req.params.dogId;
  let newName = req.params.name;
  Dog.findOneAndUpdate({ _id: dogId }, { name: newName })
    .then(function(dog) {
      if (dog) {
        res.sendStatus(200);
        res.json(dog);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function() {
      res.sendStatus(400);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
