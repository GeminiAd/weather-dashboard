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
     *  Object a in the array. If you wanted that function to work with custom classes, you had to extend Class Object and then define your own 
     *  equals function, and that would be an elegant way to find an Object in a list. This is my attempt to replicate that in JavaScript.
     *  This function is used in conjunction with Array.prototype.findIndex to compare any each City Object in the array is equal to an input City Object.
     *  See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
     *  When you call Array.prototype.findIndex() with a compare function, you can optionally pass it a second argument that you may reference with
     *  the variable this. It may seem odd that a static function is referencing this Object, but findIndex(callbackFn, thisArg) is the concept behind it.
     */
    static equals(cityObject) {
        return ((this.name === cityObject.name) && (this.latitude === cityObject.latitude) && (this.longitude === cityObject.longitude));
    }
}

/* The following are variables I will need later, I'm just defining them now for convenience. */
var cityListElement = $("#city-list");
var submitButtonElement = $(".submit-button");
var cityTextInputElement = $("#cityText");
var weatherContentElement = $("#weather-content");
var modalElement = $("#exampleModal");
var modalTextElement = $(".modal-body p");
var cityIconElement = $("#city-icon");
var weatherIconElement = $("#weather-icon");
var citySelectBarElement = $("#city-bar");

var cityInputFormElement = document.getElementById("city-input-form"); // jQuery doesn't have a form reset function, so I have to use regular JS here.

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
    var cityName = cityButtonToAdd.attr("city-name");
    var lat = cityButtonToAdd.attr("lat");
    var lon = cityButtonToAdd.attr("lon");
    cityToAdd = new City(cityName, lat, lon);
    index = cityList.findIndex(City.equals, cityToAdd);

    /* 1. If the City isn't already in our list. */
    if (index == -1) {
        /* 2. Add the city button as the first child of the city list element. */
        cityListElement.prepend(cityButtonToAdd);

        /* 3. Add a new City to the beginning of our city list. */
        cityList.unshift(cityToAdd);

        /* 4. Write the new city list to storage. */
        writeCityList();

        if (cityList.length === 1) {
            selectFirstCity();
        }
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
            deselect();

            /* 2. b. We need to select this button. */
            select(clickedElement);
        }
    }
}

/* 
 *  Contains logic for the city icon, which only displays on mobile devices. 
 *  When the city icon is clicked we need to:
 *      1. Remove the weather display screen.
 *      2. Remove the city icon
 *      3. Display the weather icon 
 *      4. Display the city select screen
 */
function cityIconClick(event) {
    /* 1. Remove the weather display screen. */
    weatherContentElement.addClass("d-none");

    /* 2. Remove the city icon */
    cityIconElement.removeClass("d-sm-none");
    cityIconElement.addClass("d-none");

    /* 3. Display the weather icon  */
    weatherIconElement.removeClass("d-none");
    weatherIconElement.addClass("d-sm-none");

    /* 4. Display the city select screen */
    citySelectBarElement.removeClass("d-none");
}

/*
 *  Logic for clicking the close button goes here. Becuase of event delegation, when the close icon is clicked, event.target is the close icon,
 *  so we have to check for that. If the city button that was clicked was selected, we want to deselect it so that the weather content area is cleared.
 *  If the city is selected, we also want to remove the button and then select the first button in the list.
 *  When the close button is clicked, we need to:
 *      1. See if it was the span element that was clicked. If so, set the close button accordingly.
 *      2. Get the parent of the close button, the city button.
 *      3. Remove the city button from the DOM and our saved list.
 *      4. If the city button was selected, we want to deselect it to clear the weather content window and we want to select the first city in the list.
 */
function closeButtonOnClick(event) {
    var closeButtonElement;
    var clickedElement = $(event.target);

    /* 1. See if it was the span element that was clicked. If so, set the close button accordingly. */
    if (clickedElement.is("span")) {
        closeButtonElement = clickedElement.parent();
    } else {
        closeButtonElement = clickedElement;
    }

    /* 2. Get the parent of the close button, the city button. */
    var cityButtonElement = closeButtonElement.parent();

    /* 3. Remove the city button from the DOM and our saved list. */
    removeCityButton(cityButtonElement);

    /* 4. If the city button was selected, we want to deselect it to clear the weather content window and we want to select the first city in the list. */
    if (cityButtonElement.is(".selected")) {
        deselect();
        selectFirstCity();
    }
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
    cityButton.attr("city-name", cityName);
    cityButton.text(cityName);
    cityButton.on("click", cityButtonOnClick);
    
    /* 
     *  The city buttons were looking weird as they were being dragged due to the hover effect. The following chunk of code is my hack around that,
     *  or else I would have just used .city-button:hover to achieve the hovering effect.
     */
    cityButton.on("touchstart", cityButtonOnClick);
    cityButton.on("mouseenter", function () {
        $(this).addClass("hover");
    });
    cityButton.on("mouseleave", function () {
        $(this).removeClass("hover");
    });
    cityButton.on("dragstart", function() {
        cityListElement.children().removeClass("hover");
    });
    cityButton.on("dragend", function () {
        $(this).removeClass("hover");
    });
    cityButton.on("dragleave", function () {
        $(this).removeClass("hover");
    });

    /* 2. Create the close button, append it to the city button element. */
    var closeButton = $("<button>");
    closeButton.attr("type", "button");
    closeButton.attr("aria-label", "Close");
    closeButton.addClass("close btn-close");
    closeButton.on("click", closeButtonOnClick);
    cityButton.append(closeButton);

    /* 3. Create the close icon, append it to the close button element. */
    var spanToAdd = $("<span>");
    spanToAdd.html("&times;");
    spanToAdd.attr("aria-hidden", "true");
    spanToAdd.addClass("align-text-top px-2");
    closeButton.append(spanToAdd);
    

    /* 4. Return the city button jQuery Object. */
    return cityButton;
}

/* 
 *  Deselects the currently selected city. 
 *  When the currently selected city is deselected we must:
 *      1. Get the currently selected item.
 *      2. Remove the class selected so that it is styled correctly.
 *      3. Clear the weather content element.
 */
function deselect() {
    /* 1. Get the currently selected item. */
    var currentlySelectedElement = $(".selected");

    /* 2. Remove the class selected so that it is styled correctly. */
    currentlySelectedElement.removeClass("selected");

    /* 3. Clear the weather content element. */
    weatherContentElement.empty();
}

/*
 *  Displays the current weather for the selected city. The current weather for the selected city appears in a card above the 5-day forecast.
 *  The classes for each div are defined that way as bootstrap 4.6x requires that for styling purposes. See:
 *  https://getbootstrap.com/docs/4.6/components/card/
 *
 *  The HTML added is of the form:
 *  <div class="card my-3" id="current-weather-card">
 *      <div class="card-body" id="current-weather-card-body">
 *          <img src="{weathericonpath}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Current Weather Icon" />
 *          <h2 class="card-title">{CityName} {City Date/Time}</h2>
 *          <p class="card-text">Temp: {temp}</p>
 *          <p class="card-text">Wind: {wind}</p>
 *          <p class="card-text">Humidity: {humidity}</p>
 *      </div>
 *  </div>
 */
function displayCurrentWeather(cityName, data) {
    //var cityName = data.name;

    var forecastTimeUTC = data.dt;
    var timezoneOffset = data.timezone;
    var forecastMoment = moment.unix(forecastTimeUTC+timezoneOffset).utc();

    var temp = data.main.temp;
    var wind = data.wind.speed;
    var humidity = data.main.humidity;
    var weatherIcon = data.weather[0].icon;
    var weatherIconPath = "https://openweathermap.org/img/wn/"+weatherIcon+"@4x.png";

    var cardToAdd = $("<div>");
    cardToAdd.addClass("card my-3");
    cardToAdd.attr("id", "current-weather-card");

    var cardBody = $("<div>");
    cardBody.addClass("card-body");
    cardBody.attr("id", "current-weather-card-body");
    cardToAdd.append(cardBody);

    var weatherImage = $("<img>");
    weatherImage.attr("src", weatherIconPath);
    weatherImage.attr("referrerpolicy", "strict-origin");
    weatherImage.attr("crossorigin", "anonymous");
    weatherImage.attr("id", "current-weather-icon");
    weatherImage.attr("alt", "Current weather icon");
    cardBody.append(weatherImage);

    var cardHeader = $("<h2>");
    cardHeader.addClass("card-title");
    cardHeader.text(cityName+" "+forecastMoment.format("(dddd, MMMM Do, YYYY   HH:mm:ss)"));
    cardBody.append(cardHeader);

    var cardTemp = $("<p>");
    cardTemp.addClass("card-text");
    cardTemp.text("Temp: "+temp+"??F");
    cardBody.append(cardTemp);

    var cardWind = $("<p>");
    cardWind.addClass("card-text");
    cardWind.text("Wind: "+wind+" MPH");
    cardBody.append(cardWind);

    var cardHumidity = $("<p>");
    cardHumidity.addClass("card-text");
    cardHumidity.text("Humidity: "+humidity+"%");
    cardBody.append(cardHumidity);

    weatherContentElement.append(cardToAdd);
}

/*
 *  Displays the 5-day forecast for the selected city, given the data blob we recieve from OpenWeather.
 *  The classes for each div are defined that way as bootstrap 4.6x requires that for styling purposes. See:
 *  https://getbootstrap.com/docs/4.6/components/card/
 *  
 *  The HTML added is of the form:
 *  <div class="card">
 *      <div class="card-body">
 *          <h3 class="card-title">5-Day Forecast:</h3>
 *          <div class="container-fluid">
 *              <div class="row">
 *                  <div class="card col-xl m-xl-3 forecast-card">
 *                      <div class="card-body d-flex flex-column align-items-xl-center">
 *                          <h4 class="card-title">{forecast1-date}</h4>
 *                          <img src="{forecast1-icon-path}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Forecast Weather Icon" />
 *                          <p class="card-text">Temp: {forecast1-temp}</p>
 *                          <p class="card-text">Wind: {forecast1-wind}</p>
 *                          <p class="card-text">Humidity: {forecast1-humidity}</p>
 *                      </div>
 *                  </div>
 *                  <div class="card col-xl m-xl-3 forecast-card">
 *                      <div class="card-body d-flex flex-column align-items-xl-center">
 *                          <h4 class="card-title">{forecast2-date}</h4>
 *                          <img src="{forecast2-icon-path}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Forecast Weather Icon" />
 *                          <p class="card-text">Temp: {forecast2-temp}</p>
 *                          <p class="card-text">Wind: {forecast2-wind}</p>
 *                          <p class="card-text">Humidity: {forecast2-humidity}</p>
 *                      </div>
 *                  </div>
 *                  <div class="card col-xl m-xl-3 forecast-card">
 *                      <div class="card-body d-flex flex-column align-items-xl-center">
 *                          <h4 class="card-title">{forecast3-date}</h4>
 *                          <img src="{forecast3-icon-path}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Forecast Weather Icon" />
 *                          <p class="card-text">Temp: {forecast3-temp}</p>
 *                          <p class="card-text">Wind: {forecast3-wind}</p>
 *                          <p class="card-text">Humidity: {forecast3-humidity}</p>
 *                      </div>
 *                  </div>
 *                  <div class="card col-xl m-xl-3 forecast-card">
 *                      <div class="card-body d-flex flex-column align-items-xl-center">
 *                          <h4 class="card-title">{forecast4-date}</h4>
 *                          <img src="{forecast4-icon-path}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Forecast Weather Icon" />
 *                          <p class="card-text">Temp: {forecast4-temp}</p>
 *                          <p class="card-text">Wind: {forecast4-wind}</p>
 *                          <p class="card-text">Humidity: {forecast4-humidity}</p>
 *                      </div>
 *                  </div>
 *                  <div class="card col-xl m-xl-3 forecast-card">
 *                      <div class="card-body d-flex flex-column align-items-xl-center">
 *                          <h4 class="card-title">{forecast5-date}</h4>
 *                          <img src="{forecast5-icon-path}" referrerpolicy="strict-origin" crossorigin="anonymous" alt="Forecast Weather Icon" />
 *                          <p class="card-text">Temp: {forecast5-temp}</p>
 *                          <p class="card-text">Wind: {forecast5-wind}</p>
 *                          <p class="card-text">Humidity: {forecast5-humidity}</p>
 *                      </div>
 *                  </div>
 *              </div>
 *          </div>
 *      </div>
 *  </div>
 */
function displayFiveDayForecast(data) {
    var fiveDayForecastCard = $("<div>");
    fiveDayForecastCard.addClass("card");

    var fiveDayForecastBody = $("<div>");
    fiveDayForecastBody.addClass("card-body");
    fiveDayForecastCard.append(fiveDayForecastBody);

    var fiveDayForecastHeader = $("<h3>");
    fiveDayForecastHeader.addClass("card-title");
    fiveDayForecastHeader.text("5-Day Forecast:");
    fiveDayForecastHeader.attr("id", "forecast-card-title");
    fiveDayForecastBody.append(fiveDayForecastHeader);

    var containerToAdd = $("<div>");
    containerToAdd.addClass("container-fluid");
    fiveDayForecastBody.append(containerToAdd);

    var rowToAdd = $("<div>");
    rowToAdd.addClass("row");
    containerToAdd.append(rowToAdd);

    /* 
     *  I say, for each data nugget we get back, we check to see if the hour of the data nugget is 3PM. If it is, we display it as the 1-day forecast.
     *  The next day at 3PM is the next forecast, etc. Sometimes we will be past 3PM, say on October 11 2022. The 5-day forecast that I get from
     *  openweather will include the forecast for hours that are in the past, and the only forecast for the day 5 days from now is at 3AM. I don't consider
     *  3AM a good representative of what the weather will be like during the day, so just display the 5-day forecast with the current day included. If
     *  openweather gives me the forecast for the 5th day out, I display it, if they don't give me the forecast for the 5th day out, I don't display it.
     *  If I'm not displaying the forecast of the day 5 days from now, I'm going to say its a flaw with openweather's API and not my program.
     */
    var now = moment();
    var currentDayOfYear = now.dayOfYear();

    var dataList = data.list;
    for(var i = 0; i < dataList.length; i++) {
        //var forecastTime = moment(dataList[i].dt_txt);
        var forecastTime = moment.unix(dataList[i].dt).utc();
        //console.log(forecastTime.format("MM/DD/YYYY hA"));
        var forecastHour = forecastTime.hour();
        var forecastDayOfYear = forecastTime.dayOfYear();

        if (((forecastDayOfYear - currentDayOfYear) > 0) && (forecastHour === 15)) {
            var weatherIconName = dataList[i].weather[0].icon;

            /* If the weather icon given is for night, let's change it to the day icon instead. */
            if (weatherIconName[weatherIconName.length-1] === "n") {
                weatherIconName = weatherIconName.replace("n", "d");
            }

            var weatherIconPath = "https://openweathermap.org/img/wn/"+weatherIconName+"@2x.png";

            var temp = dataList[i].main.temp;
            var wind = dataList[i].wind.speed;
            var humidity = dataList[i].main.humidity;

            var cardToAdd = $("<div>");
            cardToAdd.addClass("card col-xl m-xl-3 forecast-card");
            rowToAdd.append(cardToAdd);

            var cardBody = $("<div>");
            cardBody.addClass("card-body d-flex flex-column align-items-xl-center");
            cardToAdd.append(cardBody);

            var cardHeader = $("<h4>");
            cardHeader.addClass("card-title");
            cardHeader.text(forecastTime.format("(M/D/YYYY)"));
            cardBody.append(cardHeader);

            var weatherIcon = $("<img>");
            weatherIcon.attr("src", weatherIconPath);
            weatherIcon.attr("referrerpolicy", "strict-origin");
            weatherIcon.attr("crossorigin", "anonymous");
            weatherIcon.attr("alt", "Forecast weather icon");
            weatherIcon.addClass("forecast-weather-icon");
            cardBody.append(weatherIcon);

            var cardTemp = $("<p>");
            cardTemp.addClass("card-text");
            cardTemp.text("Temp: "+temp+"??F");
            cardBody.append(cardTemp);

            var cardWind = $("<p>");
            cardWind.addClass("card-text");
            cardWind.text("Wind: "+wind+" MPH");
            cardBody.append(cardWind);

            var cardHumidity = $("<p>");
            cardHumidity.addClass("card-text");
            cardHumidity.text("Humidity: "+humidity+"%");
            cardBody.append(cardHumidity);
        }
    }

    weatherContentElement.append(fiveDayForecastCard);
}

/* 
 *  This function fetches the coordinates for the entered city after the user submits a city name.
 *  When we fetch coordinate for a city we must:
 *      1. Fetch the data for the city.
 *      2. If there's some error code - if the api can't determine the city - we want to show the invalid city modal dialog.
 *      3. Otherwise, we'll get the latitude and longitude from the return data, and create a new city button.
 */
function fetchCoordinates(cityName) {
    /* 1. Fetch the data for the city. */
    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+cityName+"&appid="+openWeatherApiKey;

    fetch(requestUrl, {
        cache: "no-cache"
    })
        .then(function (response) {
            //console.log("response", response);

            if (response.ok) {
                return response.json();
            } else {
                /*2. If there's some error code - if the api can't determine the city - we want to show the invalid city modal dialog. See the .catch function. */
                Promise.reject(response);
            }
        })
        .then(function (data) {
            /* 3. Otherwise, we'll get the latitude and longitude from the return data, and create a new city button. */
            dataObject = data[0];
            var lat = dataObject.lat;
            var lon = dataObject.lon;
            var cityButtonToAdd = createCityButton(cityName, lat, lon);
            addCityButton(cityButtonToAdd);
        })
        .catch(function (response) {
            showModal(cityName);
        });
}

/* Fetches the current weather, then displays the current weather, and then fetches the 5-day forecast. */
function fetchCurrentWeather(cityName, lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=imperial&appid="+openWeatherApiKey;

    fetch(requestUrl, {
        cache: "no-cache"
    })
    .then(function (response) {
      
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(cityName, data);
      
      // I have to include the fetch call to get the five-day forecast here or else sometimes the forecast arrives before the current weather.
      fetchFiveDayForecast(lat, lon);
    });
}

/*
 *  This function fetches the 5-day forecast for the selected city.
 */
function fetchFiveDayForecast(lat, lon) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+"&lon="+lon+"&units=imperial&appid="+openWeatherApiKey;

    fetch(requestUrl, {
        cache: "no-cache"
    })
      .then(function (response) {
        //console.log("response", response);
        
        return response.json();
      })
      .then(function (data) {
        //console.log("data",data)
        displayFiveDayForecast(data);
      });
}

/* 
 *  This function makes the city buttons draggable/sortable. I'm saving each city in an array called city list, with the city at index 0
 *  automatically selected when the user starts the application. So, if the user drags the city button to the top of the list, for instance,
 *  I need to update the city list so that the dragged city button is removed from its old position and added to its new position, at index 0,
 *  so that the next time the user starts the application that change is saved and the dragged city is displayed first.
 * 
 *  To make the city buttons draggable/sortable, I'm using the third party API SortableJS: 
 *  https://github.com/SortableJS/Sortable
 */
function initializeSortables() {
    var el = document.getElementById("city-list");
    var sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        dragClass: "sortable-drag",

        /* 
         *  After the city button is dragged I need to:
         *      1. Remove the City from its old index.
         *      2. Insert the city at its new index
         */
        onEnd: function (event) {
            //console.log(event.clone);
            var cityName = $(event.clone).attr("city-name");
            //console.log(cityName);
            var lat = $(event.clone).attr("lat");
            //console.log(lat);
            var lon = $(event.clone).attr("lon");
            //console.log(lon);

            /* 1. Remove the City from its old index. */
            cityList.splice(event.oldIndex, 1);

            cityList.splice(event.newIndex, 0, new City(cityName, lat, lon));

            writeCityList();
        }
    });
}

/* All one-time actions we need to do to when the application is first run goes here. */
function initializeWeatherDashboard() {
    submitButtonElement.on("click", submitButtonClick);
    cityIconElement.on("click", cityIconClick);
    weatherIconElement.on("click", weatherIconClick);

    loadCityList();
    renderCityList();
    selectFirstCity();
    initializeSortables();
}



/* Loads any saved city list. If one doesn't exist, we create an empty array. */
function loadCityList() {
    var stringifiedCityList = localStorage.getItem("weatherCityList");
    if (stringifiedCityList === null) {
        cityList = [];
    } else {
        cityList = JSON.parse(stringifiedCityList);
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
    var cityName = cityButtonToRemove.attr("city-name");
    var lat = cityButtonToRemove.attr("lat");
    var lon = cityButtonToRemove.attr("lon");
    var cityToRemove = new City(cityName, lat, lon);
    index = cityList.findIndex(City.equals, cityToRemove);
    cityList.splice(index, 1)

    /* 3. Write the updated city list to storage. */
    writeCityList();
}

/* Displays the city buttons in a list below the search bar */
function renderCityList() {
    for (var i = 0; i < cityList.length; i++) {
        var cityName = cityList[i].name;
        var lat = cityList[i].latitude;
        var lon = cityList[i].longitude;

        var cityButton = createCityButton(cityName, lat, lon);

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
    /* 1. Apply the selected class to style the button. */
    cityButton.addClass("selected");

    /* 2. Fetch the weather data for the selected city. */
    var lat = cityButton.attr("lat");
    var lon = cityButton.attr("lon");
    var cityName = cityButton.attr("city-name");

    fetchCurrentWeather(cityName, lat, lon);
}

/*
 *  This function selects the first button in the city button list. This function is used when the weather dashboard is initially loaded, and
 *  is also used in the event that a selected city is removed from our list of cities.
 */
function selectFirstCity() {
    if (!cityListElement.is(":empty")) {
        var cities = cityListElement.children();
        var firstCity = cities.eq(0).eq(0);
        select(firstCity);
    }
}

/* Shows the modal. I have showModal as a function so I can add a more descriptive error message with a city name before I tell the modal to show. */
function showModal(cityName) {
    modalTextElement.text("Error: \""+cityName+"\" is not a recognized city. Enter a valid city in the city search box.");
    modalElement.modal("show");
}

/* Logic for the submit button on click */
function submitButtonClick(event) {
    event.preventDefault();
    var cityName = cityTextInputElement.val();

    fetchCoordinates(cityName);
    cityInputFormElement.reset();
}

/*
 *  Logic for when the weather icon is clicked on mobile.
 *  When the weather ico is clicked we have to:
 *      1. Stop displaying the city select element.
 *      2. Display the weather content
 *      3. Stop displaying the weather icon.
 *      4. Display the city icon.
 */
function weatherIconClick(event) {
    /* 1. Stop displaying the city select element. */
    citySelectBarElement.addClass("d-none");

    /* 2. Display the weather content */
    weatherContentElement.removeClass("d-none");

    /* 3. Stop displaying the weather icon. */
    weatherIconElement.removeClass("d-sm-none");
    weatherIconElement.addClass("d-none");

    /* 4. Display the city icon. */
    cityIconElement.removeClass("d-none");
    cityIconElement.addClass("d-sm-none");
}

/* 
 *  Writes our city list to local storage.
 *  When we write the city list to storage we must:
 *      1. Stringify the list
 *      2. Save the stringified list.
 */
function writeCityList() {
    var stringifiedCityList = JSON.stringify(cityList);
    localStorage.setItem("weatherCityList", stringifiedCityList);
}

/* This call is where the application starts. All other interactions happen through clickables. */
initializeWeatherDashboard();