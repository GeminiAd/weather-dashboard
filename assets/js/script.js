/*
 *  This represents a city in the world. I created this mainly so I could associate city names with latitude and longitude to minimize any API
 *  calls to OpenWeather, as I'm limited to a certain amount per minute.
 */
class City {
    constructor(name, latitude, longitude) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    static equals(cityObject) {
        return ((this.name === cityObject.name) && (this.latitude === cityObject.latitude) && (this.longitude === cityObject.longitude));
    }
}

var cityListElement = $("#city-list");
var submitButtonElement = $(".submit-button");
var cityTextInputElement = $("#cityText");
var openWeatherApiKey = "cf19996b2ee225f691c3a37e5129a402";

var cityList;

/* 
 *  Adds a city button to our list of city buttons on the left-hand side of the page. This function will both add the city button as child
 *  of the city-button-list element to render it to the page and add a new City Object to our saved list of Cities.
 *  Steps needed to add a city button to our list of city buttons:
 *      1. Add the city button as the first child of the city list element.
 *      2. Add a new City to the beginning of our city list.
 *      3. Write the new city list to storage.
 */
function addCityButton(cityButtonToAdd) {
    /* 1. Add the city button as the first child of the city list element. */
    cityListElement.prepend(cityButtonToAdd);

    /* 2. Add a new City to the beginning of our city list. */
    var cityName = cityButtonToAdd.text();
    var lat = cityButtonToAdd.attr("lat");
    var lon = cityButtonToAdd.attr("lon");
    cityList.unshift(new City(cityName, lat, lon));

    /* 3. Write the new city list to storage. */
    writeCityList();
}

/* Logic for the city button on click */
function cityButtonOnClick(event) {
    var clickedElement = $(event.target);

    if (clickedElement.is(".city-button")) {
        console.log("CITY BUTTON CLICK");
        var currentlySelectedElement = $(".selected");
        currentlySelectedElement.removeClass("selected");

        clickedElement.addClass("selected");
    }
}

function closeButtonOnClick(event) {
    console.log("CLOSE BUTTON HIT");

    var closeButtonElement;
    var clickedElement = $(event.target);

    if (clickedElement.is("i")) {
        closeButtonElement = clickedElement.parent();
    } else {
        closeButtonElement = clickedElement;
    }

    cityButtonElement = closeButtonElement.parent();
    var indexToRemove = cityButtonElement.attr("index");

    cityList.splice(indexToRemove, 1);
    cityButtonElement.remove();

    writeCityList();
}

/* 
 *  Creates a new city button using jQuery when given a City Object. Returns the city button element jQuery Object.
 *  Also note that this function just creates and returns the button: all work of adding the button to the city list and
 *  setting the index of the City in our City list has to be done outside of this function.
 * 
 *  When creating a city button, we need to:
 *      1. Create the city button, set the classes and attributes we need except the index.
 *      2. Create the close button, append it to the city button element.
 *      3. Create the close icon, append it to the close button element.
 *      4. Return the city button jQuery Object.
 */
function createCityButton(cityName, lat, lon) {
    /* 1. Create the city button, set the classes and attributes we need except the index. */
    var cityButton = $("<button>");
    cityButton.addClass("city-button list-button");
    cityButton.attr("lat", lat);
    cityButton.attr("lon", lon);
    cityButton.text(cityName);
    cityButton.on("click", cityButtonOnClick);

    /* 2. Create the close button, append it to the city button element. */
    var closeButton = $("<button>");
    closeButton.attr("type", "button");
    closeButton.attr("aria-label", "Close");
    closeButton.addClass("close");
    closeButton.on("click", closeButtonOnClick);
    cityButton.append(closeButton);

    /* 3. Create the close icon, append it to the close button element. */
    var iconToAdd = $("<i>");
    iconToAdd.addClass("fas fa-times");
    closeButton.append(iconToAdd);

    /* 4. Return the city button jQuery Object. */
    return cityButton;
}

/* 
 *  This function fetches the coordinates for the entered city after the user submits a city name.
 *  When we fetch coordinate for a city we must:
 *      1. Fetch the data for the city
 *      2. If there's some error code - if the api can't determine the city - we want to communicate that to the user.
 *      3. Otherwise, we'll get the latitude and longitude from the return data, and create a new city button.
 */
function fetchCoordinates(cityName) {
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+cityName+"&appid="+openWeatherApiKey;

    fetch(requestUrl)
        .then(function (response) {
            console.log("response", response);
            return response.json();
        })
        .then(function (data) {
            console.log("data",data);
            dataObject = data[0];
            console.log(dataObject);
            var lat = dataObject.lat;
            var lon = dataObject.lon;
            var cityButtonToAdd = createCityButton(cityName, lat, lon);
            addCityButton(cityButtonToAdd);
        });
}

function fetchWeather(lat, lon) {
    var requestUrl = 'https://api.github.com/orgs/nodejs/repos';

    fetch(requestUrl)
      .then(function (response) {
        console.log("response", response);
        
        return response.json();
      })
      .then(function (data) {
        console.log("data",data)
      });
}

/* All one-time actions we need to do to when the application is first run goes here. */
function initializeWeatherDashboard() {
    submitButtonElement.on("click", submitButtonClick);

    loadCityList();
    renderCityList();
}

/* Loads any saved city list. If one doesn't exist, we create an empty array. */
function loadCityList() {
    console.log("LOADING CITY LIST");

    var stringifiedCityList = localStorage.getItem("weatherCityList");
    if (stringifiedCityList === null) {
        console.log("NO SAVED DATA EXISTS");
        cityList = [];
    } else {
        console.log("NO SAVED DATA EXISTS");
        cityList = JSON.parse(stringifiedCityList);
    }
}

/* Displays the city buttons in a list below the search bar */
function renderCityList() {
    for (var i = 0; i < cityList.length; i++) {
        var cityButton = $("<button>");
        cityButton.addClass("city-button list-button");
        cityButton.text(cityList[i]);
        cityButton.attr("index", i);
        cityButton.on("click", cityButtonOnClick);

        var closeButton = $("<button>");
        closeButton.attr("type", "button");
        closeButton.attr("aria-label", "Close");
        closeButton.addClass("close");
        closeButton.on("click", closeButtonOnClick);

        var iconToAdd = $("<i>");
        iconToAdd.addClass("fas fa-times");

        closeButton.append(iconToAdd);
        cityButton.append(closeButton);

        cityListElement.append(cityButton);
    }
}

/* Logic for the submit button on click */
function submitButtonClick(event) {
    event.preventDefault();
    console.log("SUBMIT BUTTON CLICK");
    var cityName = cityTextInputElement.val();

    fetchCoordinates(cityName);
}

function writeCityList() {

}

initializeWeatherDashboard();