var cityListElement = $("#city-list");
var submitButtonElement = $(".submit-button");

var cityList;

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
}

function writeCityList() {

}

initializeWeatherDashboard();