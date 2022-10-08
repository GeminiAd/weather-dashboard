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

    /*
     *  In Java, I seem to recall that there was a function that searches an array for an Object, and it calls a.equals(target) for each element
     *  Object a in the array. If you wanted that function to work, you had to extend Class Object and then define your own equals function,
     *  and that would be an elegant way to find an Object in a list. This is my attempt to replicate that in JavaScript.
     *  This function is used in conjunction with findIndex to compare if each City Object in the array is equal.
     *  See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
     *  When you call Array.prototype.findIndex() with a compare function, you can optionally pass it a second argument that you may reference with
     *  the variable this. It may seem odd that a static function is referencing this Object, but findIndex(callbackFn, thisArg) is the concept behind it.
     */
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
 *      1. If the City isn't already in our list.
 *      2. Add the city button as the first child of the city list element.
 *      3. Add a new City to the beginning of our city list.
 *      4. Write the new city list to storage.
 */
function addCityButton(cityButtonToAdd) {
    var cityName = cityButtonToAdd.text();
    var lat = cityButtonToAdd.attr("lat");
    var lon = cityButtonToAdd.attr("lon");
    cityToAdd = new City(cityName, lat, lon);
    index = cityList.findIndex(City.equals, cityToAdd);

    /* 1. If the City isn't already in our list. */
    if (index == -1) {
        /* 2. Add the city button as the first child of the city list element. */
        cityListElement.prepend(cityButtonToAdd);

        /* 3. Add a new City to the beginning of our city list. */
        var cityName = cityButtonToAdd.text();
        var lat = cityButtonToAdd.attr("lat");
        var lon = cityButtonToAdd.attr("lon");
        cityList.unshift(cityToAdd);

        /* 4. Write the new city list to storage. */
        writeCityList();
    }
}

/* 
 *  Logic for the city button on click.
 *  When the city button is clicked we need to:
 *      1. Determine if the the city button click was actually registered by the city button, in case the close button was clicked.
 *      2. If this button isn't already selected
 *          a. We need to deselect the currently selected city button.
 *          b. We need to select this button.
 */
function cityButtonOnClick(event) {
    /* 1. Determine if the the city button click was actually registered by the city button, in case the close button was clicked. */
    var clickedElement = $(event.target);

    if (clickedElement.is(".city-button")) {
        /* 2. If this button isn't already selected */
        if (!clickedElement.is(".selected")) {
            /* 2. a. We need to deselect the currently selected city button. */
            var currentlySelectedElement = $(".selected");
            currentlySelectedElement.removeClass("selected");

            /* 2. b. We need to select this button. */
            select(clickedElement);
        }
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

    removeCityButton(cityButtonElement);
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
 *  Displays the forecast for the selected city when given a list of data representing the 5-day forecast.
 */
function displayForecast() {

}

/* 
 *  This function fetches the coordinates for the entered city after the user submits a city name.
 *  When we fetch coordinate for a city we must:
 *      1. Fetch the data for the city.
 *      2. If there's some error code - if the api can't determine the city - we want to do something.
 *      3. Otherwise, we'll get the latitude and longitude from the return data, and create a new city button.
 */
function fetchCoordinates(cityName) {
    /* 1. Fetch the data for the city. */
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+cityName+"&appid="+openWeatherApiKey;

    fetch(requestUrl)
        .then(function (response) {
            /* 2. If there's some error code - if the api can't determine the city - we want to do something. */
            console.log("response", response);
            return response.json();
        })
        .then(function (data) {
            /* 3. Otherwise, we'll get the latitude and longitude from the return data, and create a new city button. */
            dataObject = data[0];
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
        console.log(cityList);
    }
}

/* 
 *  Removes a city button from the list of city buttons on the left hand side of the screen.
 *  In order to fully remove a button on the left-hand side of the screen we must:
 *      1. Remove the button element from the DOM.
 *      2. Remove the city from our list of saved cities.
 *      3. Write the updated city list to storage.
 */
function removeCityButton(cityButtonToRemove) {
    /* 1. Remove the button element from the DOM. */
    cityButtonToRemove.remove();

    /* 2. Remove the city from our list of saved cities. */
    var cityName = cityButtonToRemove.text();
    var lat = cityButtonToRemove.attr("lat");
    var lon = cityButtonToRemove.attr("lon");
    var cityToRemove = new City(cityName, lat, lon);
    index = cityList.findIndex(City.equals, cityToRemove);
    console.log(index);
    cityList.splice(index, 1)
    console.log(cityList);

    /* 3. Write the updated city list to storage. */
    writeCityList();
}

/* Displays the city buttons in a list below the search bar */
function renderCityList() {
    for (var i = 0; i < cityList.length; i++) {
        /*
        var cityButton = $("<button>");
        cityButton.addClass("city-button list-button");
        cityButton.text(cityList[i].name);
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
        */

        var cityName = cityList[i].name;
        var lat = cityList[i].lat;
        var lon = cityList[i].lon;

        cityButton = createCityButton(cityName, lat, lon);

        cityListElement.append(cityButton);
    }
}

/*
 *  Selects the input cityButton jQuery Object.
 *  In order to select a city button we have to:
 *      1. Apply the selected class to style the button.
 *      2. Fetch the weather data for the selected city.
 */
function select(cityButton) {
    cityButton.addClass("selected");
}

/* Logic for the submit button on click */
function submitButtonClick(event) {
    event.preventDefault();
    console.log("SUBMIT BUTTON CLICK");
    var cityName = cityTextInputElement.val();

    fetchCoordinates(cityName);
}

/* 
 *  Writes our city list to local storage.
 *  When we write the city list to storage we must:
 *      1. Stringify the list
 *      2. Save the stringified list.
 */
function writeCityList() {
    var stringifiedCityList = JSON.stringify(cityList);
    console.log(stringifiedCityList);
    localStorage.setItem("weatherCityList", stringifiedCityList);
}

initializeWeatherDashboard();