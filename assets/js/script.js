var cityListElement = $("#city-list");
var submitButtonElement = $(".submit-button");

var cityList;

/* Logic for the city button on click */
function cityButtonOnClick(event) {
    console.log("CITY BUTTON CLICK");

    var cityButtonElement = $(event.target);
    var currentlySelectedElement = $(".selected");
    currentlySelectedElement.removeClass("selected");

    cityButtonElement.addClass("selected");
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
        cityList = ["Atlanta", "San Jose", "Dallas"];
    } else {
        console.log("NO SAVED DATA EXISTS");
        cityList = JSON.parse(stringifiedCityList);
    }
}

/* Displays the city buttons in a list below the search bar */
function renderCityList() {
    for (var i = 0; i < cityList.length; i++) {
        var cityButton = $("<button>");
        cityButton.addClass("city-button");
        cityButton.text(cityList[i]);
        cityButton.on("click", cityButtonOnClick);

        cityListElement.append(cityButton);
    }
}

/* Logic for the submit button on click */
function submitButtonClick(event) {
    event.preventDefault();

    console.log("SUBMIT BUTTON CLICK");
}

initializeWeatherDashboard();