# Work Day Scheduler

<https://geminiad.github.io/weather-dashboard>

------------------------------------------------------

![Work Day Scheduler Demo](./assets/images/weather-dashboard-demo.gif)

<a href="#description">Description</a> •
<a href="#key-features">Key Features</a> •
<a href="#usage">Usage</a> •
<a href="#technologies-used">Technologies Used</a> •
<a href="#concepts-demonstrated">Concepts Demonstrated</a> •
<a href="#credits">Credits</a> •
<a href="#author">Author</a>

## Description

This is is a fairly simple web application that gives the current weather and five-day forecast. All you have to do is enter a valid city in the city search form. If you enter a city that openweather doesn't recognize, a modal dialog pops up telling you the city isn't recognized. When you do enter a city in the city search form and a match is found, the city is added to the application, in the form of a button on the left-hand side. When you close the application, all of the cities in the search bar on the left hand side are saved to local storage and are loaded on application start, so they persist among sessions. Each city button has a little close button on it that, when clicked, removes the city from the application and our saved list. When you click a city button on the left, it becomes "selected" and the current weather and five-day forecast is displayed for the currently selected city. When the application is started, the city at the top of the city list is automatically selected so that weather is displayed immediately. You can drag and rearrange the city buttons on the left to make your preferred city on the top so that it displays automatically.

## Key Features

- See the current weather and five-day forecast for anywhere in the world.
- Boasts a responsive design - it looks fantastic on desktop, tablet, and it looks decent on mobile.
- Draggable city buttons, so you can put the city whose weather you care about the most on the top of the list so it displays automatically.

## Usage

Navigate to: <https://geminiad.github.io/weather-dashboard>

## Technologies Used

- [Sortable.js](https://github.com/SortableJS/Sortable)
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Moment.js](https://momentjs.com/)
- [JavaScript](https://www.javascript.com/)
- CSS
- HTML

## Concepts Demonstrated

- Calling a server-side API to get, parse, and display data.
- The importing and use of third-party APIs in JavaScript.
- General HTML/CSS/JavaScript syntax and purpose.
- Setting and stopping JavaScript timers using setInterval().
- Handling JavaScript events.
- Adding and removing HTML elements on demand using the DOM.
- Storing and retrieving data on local storage for persistence between sessions.

## Credits

Manuel Nunes for a mockup of the application.

## Author

Adam Ferro
- [Github](https://github.com/GeminiAd)
- [Linked-In](https://www.linkedin.com/in/adam-ferro)