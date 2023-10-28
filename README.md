

# Installation
* Clone the repository into the 'local' folder of your Moodle instance: `git clone https://gitlab.pi6.fernuni-hagen.de/aple/entwicklung/local-ari`
* Rename the folder to 'ari': `mv local-ari ari`
* Enter the folder and go into the 'vue' directory. Execute 'npm install' in the terminal.
* Open the Moodle administration area in your web browser and follow the instructions to install the plugin.
* To view the local plugin, call its directory in your web browser  (for example: http://localhost/moodle/local/ari/)

## Development
* in the folder vue run `npm run watch` and open Moodle in your browser. After saving changes Webpack will run and transpile the source code. The changes will be visible in the browser after a page refresh.
* run "export NODE_OPTIONS=--openssl-legacy-provider" in a terminal in the vue folder if error "ERR_OSSL_EVP_UNSUPPORTED" appears
## Production
```
$ npm run build
$ php admin/cli/uninstall_plugins.php --plugins=local_ari --run
$ php admin/cli/upgrade.php
$ rsync -r ./* aple-test:/var/moodle/htdocs/moodle/local/ari/ --exclude={'.env','node_modules','*.git','.DS_Store','.gitignore','.vscode'}
```


## To-Do
* Replace grunt by Webpack
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

# Dev notes
`git tag -d ws2223 && git push --delete origin ws2223 && git tag ws2223 && git push origin ws2223`

