var getDogsFromSever = function() {
  return fetch("http://localhost:3000/dogs");
};

var createDogOnServer = function(name, breed, age) {
  var data = `name=${encodeURIComponent(name)}`;
  data += `&breed=${encodeURIComponent(breed)}`;
  data += `&age=${encodeURIComponent(age)}`;
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
    dogs: [],
    items: [
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg"
      },
      {
        src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg"
      }
    ]
  },
  methods: {
    createdButtonClicked: function() {
      console.log("Clicked");
      createDogOnServer(this.name, this.breed, this.age).then(response => {
        if (response.status == 201) {
          this.loadDogs();
        }
      });
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
    }
  },
  created: function() {
    console.log("VUE LOADED");
    this.loadDogs();
  }
});
