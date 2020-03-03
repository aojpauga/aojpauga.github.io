var getDogsFromSever = function() {
  return fetch("http://localhost:3000/dogs");
};

var createDogOnServer = function(name, breed, age, url) {
  var data = `name=${encodeURIComponent(name)}`;
  data += `&breed=${encodeURIComponent(breed)}`;
  data += `&age=${encodeURIComponent(age)}`;
  data += `&url=${encodeURIComponent(url)}`;
  return fetch("http://localhost:3000/dogs", {
    body: data,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var deleteDogOnServer = function(id) {
  return fetch("http://localhost:3000/dogs/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var putDogOnServer = function(id, name, breed, age, url) {
  console.log("put on server called");
  var data = `name=${encodeURIComponent(name)}`;
  data += `&breed=${encodeURIComponent(breed)}`;
  data += `&age=${encodeURIComponent(age)}`;
  data += `&url=${encodeURIComponent(url)}`;
  return fetch("http://localhost:3000/dogs/" + id, {
    body: data,
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    homePage: true,
    dogPage: false,
    addPage: false,
    adoptPage: false,
    name: "",
    breed: "",
    age: "",
    id: "",
    url: "",
    nameError: "",
    breedError: "",
    ageError: "",
    dogs: [],
    errors: [],
    editDialog: false
  },
  methods: {
    checkFields: function() {
      this.errors = [];
      if (this.name == "") {
        this.errors.push("Please enter a name");
      }
      if (this.breed == "") {
        this.errors.push("Please enter a breed");
      }
      if (this.age == "") {
        this.errors.push("Please enter an age");
      }
      if (this.url == "") {
        this.errors.push("Please enter a image url");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    createdButtonClicked: function() {
      if (this.checkFields()) {
        createDogOnServer(this.name, this.breed, this.age, this.url).then(
          response => {
            this.checkFields();
            if (response.status == 201) {
              this.name = "";
              this.breed = "";
              this.age = "";
              this.url = "";
              this.loadDogs();
            }
          }
        );
      }
    },
    loadDogs: function() {
      getDogsFromSever().then(response => {
        response.json().then(dogs => {
          console.log(dogs);
          this.dogs = dogs;
        });
      });
    },
    deleteDog: function() {
      deleteDogOnServer(this.id).then(response => {
        if (response.status == 200) {
          this.loadDogs();
        }
      });
    },
    putDog: function() {
      console.log("put called");
      console.log("put here");
      console.log(this.id, this.name, this.breed, this.age, this.url)
      putDogOnServer(this.id, this.name, this.breed, this.age, this.url).then(
        response => {
          if (response.status == 202) {
            this.loadDogs();
          } else {
            console.log("failed");
          }
        }
      );
    }
  },
  created: function() {
    console.log("VUE LOADED");
    this.loadDogs();
  }
});
