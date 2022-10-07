var cityListElement = $("#city-list");

var cityList;

/* Loads any saved city list. If one doesn't exist, we create an empty array. */
function loadCityList() {
    console.log("LOADING CITY LIST");

    var stringifiedCityList = localStorage.getItem("weatherCityList");
    if (stringifiedCityList === null) {
        console.log("NO SAVED DATA EXISTS");
        cityList = ["Atlanta"];
    } else {
        console.log("NO SAVED DATA EXISTS");
        cityList = JSON.parse(stringifiedCityList);
    }
}

/* Displays the city buttons in a list below the search bar */
function renderCityList() {
    for (var i = 0; i < cityList.length; i++) {
        console.log(cityListElement);

        var cityButton = $("<button>");
        cityButton.addClass("btn btn-secondary btn-block");
        cityButton.text(cityList[i]);
        cityListElement.append(cityButton);
    }
}

loadCityList();
renderCityList();