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

### Mobile Caveat

For the mobile version, ended up just stacking all of the content on top of each other. As in you have the header at the top, then the city submission form is stacked below that, and then you have the weather for the selected city stacked below that. Also, on mobile the draggable interface works okay, but every now and then it fails to register when you select a button. If this were a professional application, I would make some changes to the application on mobile. I would make it so that the city selection and weather display were on different screens, and you have to click an icon to go from one screen to the next, like Google Weather on mobile. That, however, comes with its own set of problems, and it seems like its beyond the scope of the assignment. So, I decided that the best course would be to leave the application as is, as it meets the minimum specs of what was given, and I can't really be tooling around with this application for a month. It's perfectly functional as-is on mobile, but the caveat here is if I had a month to work on it, it would be even better.

## Key Features

- See the current weather and five-day forecast for anywhere in the world.
- Boasts a responsive design - it looks fantastic on desktop, tablet, and it looks decent on mobile.
- Draggable city buttons, so you can put the city whose weather you care about the most on the top of the list so it displays automatically.

## Usage

Navigate to: <https://geminiad.github.io/weather-dashboard>

Enter a city name. Click the button of the city you would like to see the weather for. If you don't want to see the weather for a certain city anymore, click the close button on each city, and it will be removed from the application and won't pop up until you search for the city again.

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