

# Installation
* Clone the repository into the 'mod' folder of your Moodle instance: `git clone https://gitlab.pi6.fernuni-hagen.de/aple/entwicklung/local-ari`
* Rename the folder to 'ari': `mv local-ari ari`
* Enter the folder and go into the 'vue' directory. Execute 'npm install' in the terminal.
* Open the Moodle administration area in your web browser and follow the instrauctions to install the plugn.

## Development
* in the folder vue run `npm run watch` and open Moodle in your browser. After saving changes Webpack will run and transpile the source code. The changes will be visible in the browser after a page refresh.
## Production
* run `npm run build`


## To-Do
* Replace grunt by Webpack
* add vue.js incl vuex and router
* Connect ARI to the backend
* Extend the controller to let the backend access the different classes over the communication

## Functionalities
* Management of cookies
* Navigation through the history
* Send notifications or messages over Moodle API
* Display popup, confirm or prompt messages over native JS
* Get data of the screen, the browser, the current used tab, the OS, the geolocation of mobile devices, the acceleration of mobile devices
* Create service worker e.g. to receive push messages or create offline pages/reader
* Notify user with vibration
* Create webworker to increase the performance
* Use the webstorage to cache data
* Use the browser's db to cache data
* Communicate with moodle over a standard communication class
* Change the style of any DOM object

