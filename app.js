var local = "http://localhost:3000";
var heroku = "https://warm-forest-47794.herokuapp.com";

var getDogsFromSever = function() {
  return fetch(heroku + "/dogs", {
    credentials: "include"
  });
};

var createDogOnServer = function(name, breed, age, url) {
  var data = `name=${encodeURIComponent(name)}`;
  data += `&breed=${encodeURIComponent(breed)}`;
  data += `&age=${encodeURIComponent(age)}`;
  data += `&url=${encodeURIComponent(url)}`;
  return fetch(heroku + "/dogs", {
    body: data,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var deleteDogOnServer = function(id) {
  return fetch(heroku + "/dogs/" + id, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var deleteSessionOnServer = function() {
  return fetch(heroku + "/session", {
    method: "DELETE",
    credentials: "include",
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
  return fetch(heroku + "/dogs/" + id, {
    body: data,
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var createUserOnServer = function(name, email, plainPassword) {
  var data = `name=${encodeURIComponent(name)}`;
  data += `&email=${encodeURIComponent(email)}`;
  data += `&plainPassword=${encodeURIComponent(plainPassword)}`;
  console.log(data);
  return fetch(heroku + "/users", {
    body: data,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var createSessionOnServer = function(email, plainPassword) {
  console.log("create session function: ", email, plainPassword);
  var data = `email=${encodeURIComponent(email)}`;
  data += `&plainPassword=${encodeURIComponent(plainPassword)}`;
  console.log(data);
  return fetch(heroku + "/session", {
    body: data,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

var getSessionOnServer = function() {
  return fetch(heroku + "/session", {
    credentials: "include"
  });
};

var app = new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    userLoggin: false,
    loginButton: true,
    logoutButton: false,
    loginPage: false,
    signUpPage: false,
    appBar: true,
    homePage: true,
    dogPage: false,
    addPage: false,
    adoptPage: false,
    userName: "",
    email: "",
    plainPassword: "",
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
    editDialog: false,
    deleteDialog: false,
    dialog: false,
    editRules: [v => v.length >= 1 || "Minimum length is one character"],
    numberRule: v => {
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 99) return true;
      return "Number has to be between 0 and 99";
    },

    valid: true
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
      if (this.$refs.form.validate()) {
        createDogOnServer(this.name, this.breed, this.age, this.url).then(
          response => {
            if (response.status == 201) {
              this.loadDogs();
            }
          }
        );
      }
    },
    createUser: function() {
      console.log("Create user clicked");
      createUserOnServer(this.userName, this.email, this.plainPassword).then(
        response => {
          if (response.status == 201) {
            console.log("User created");
            alert("User Created!");
          } else {
            alert("User exists");
          }
        }
      );
    },
    createSession: function() {
      console.log(this.email, this.plainPassword);
      createSessionOnServer(this.email, this.plainPassword).then(response => {
        if (response.status == 201) {
          this.userLoggin = true;
          this.loginPage = false;
          this.homePage = true;
          this.appBar = true;
          this.loginButton = false;
          this.logoutButton = true;
        } else {
          alert("Incorrect loggin. Do you need to sign up?");
          console.log("Broke");
        }
      });
    },
    deleteSession: function() {
      deleteSessionOnServer().then(response => {
        if (response.status == 200) {
          alert("You have logged out");
          this.userLoggin = false;
          this.logoutButton = false;
          this.loginButton = true;
          this.addPage = false;
          this.adoptPage = false;
          this.homePage = true;
        }
      });
    },
    loadDogs: function() {
      console.log("here");
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
      console.log(this.id, this.name, this.breed, this.age, this.url);
      putDogOnServer(this.id, this.name, this.breed, this.age, this.url).then(
        response => {
          if (response.status == 202) {
            this.loadDogs();
          } else {
            console.log("failed");
          }
        }
      );
    },
    reset: function() {
      console.log("reset clicked");
      this.$refs.form.reset();
      //this.$refs.form.resetValidation()
    }
  },
  created: function() {
    console.log("VUE LOADED");
    this.loadDogs();
    getSessionOnServer().then(res => {
      if (res.status != 401) {
        console.log(res.status);
        this.loginPage = false;
        this.homePage = true;
        this.appBar = true;
        this.userLoggin = true;
        this.loginButton = false;
        this.logoutButton = true;
        //this.loadDogs();
      } else {
        console.log(res.status);
        //this.loginPage = true;
        //this.appBar = false;
        //this.homePage = false;
      }
    });
  }
});
