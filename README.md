# Work Day Scheduler

<https://geminiad.github.io/weather-dashboard>

------------------------------------------------------

## Desktop demo:           

![Work Day Scheduler Desktop Demo](./assets/images/weather-dashboard-desktop-demo.gif)

## Mobile demo:                    

![Work Day Scheduler Mobile Demo](./assets/images/weather-dashboard-mobile-demo.gif)

<a href="#description">Description</a> •
<a href="#key-features">Key Features</a> •
<a href="#usage">Usage</a> •
<a href="#technologies-used">Technologies Used</a> •
<a href="#concepts-demonstrated">Concepts Demonstrated</a> •
<a href="#credits">Credits</a> •
<a href="#author">Author</a>

## Description

This is is a fairly simple web application that gives the current weather and five-day forecast. All you have to do is enter a valid city in the city search form. If you enter a city that isn't recognized, a modal dialog pops up telling you the city isn't recognized. When you do enter a city in the city search form and a match is found, the city is added to the application, in the form of a button on the left-hand side. When you close the application, all of the cities in the search bar on the left hand side are saved to local storage and are loaded on application start, so they persist among sessions. Each city button has a little close button on it that, when clicked, removes the city from the application and the saved list. When you click a city button on the left, it becomes "selected" and the current weather and five-day forecast is displayed for the currently selected city. When the application is started, the city at the top of the city list is automatically selected so that weather is displayed immediately. You can drag and rearrange the city buttons on the left to put your preferred city on the top so that it displays automatically.

## Key Features

- See the time, current weather and five-day forecast for anywhere in the world.
- Boasts a responsive design - it looks great on desktop, tablet, and mobile.
- Closeable city buttons, so you can remove a city that you dont want to see anymore.
- Draggable city buttons, so you can put the city whose weather you care about the most on the top of the list so it displays automatically.

## Usage

Navigate to: <https://geminiad.github.io/weather-dashboard>

### Desktop

Enter a city name. Click the button of the city you would like to see the weather for, and the current weather and five-day forecast pops up with icons. If you don't want to see the weather for a certain city anymore, click the close button on the city, and it will be removed from the application and won't pop up until you search for the city again.

### Mobile

It works just like the desktop version, only the city select and weather display are on two different screens. If you are on the city select screen, click the sun icon in the top right corner to go to the weather display. If you are viewing the weather display, click on the city icon in the top-right corner to go to the city select screen.

## Technologies Used

- [Sortable.js](https://github.com/SortableJS/Sortable)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Moment.js](https://momentjs.com/)
- [JavaScript](https://www.javascript.com/)
- CSS
- HTML

## Concepts Demonstrated

- Calling a server-side API to get data, and then parsing and displaying that data.
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