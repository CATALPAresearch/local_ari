

<!-- TODO:
- upload to zenodo
- link to the tex2html converter and mention footnotes
- provide example HTML structures for footnotes, references, images, tables, and headlines in separate document
- set tag 'latest'
- done: make animation `ffmpeg -ss 00:00:12.000 -i longpage.mov -pix_fmt rgb24 -r 10 -s 720x480 -t 00:02:38.000 longpage.gif`
-->


<br>
<div align="center">

![](pix/promotion/longpage.gif)

</div>

<br>
<h1 align="center">ARI: Adaptation Rule Interface</h1>

## *ARI* is a Moodle local plugin for ....


*ARI* (local_ari) xxx

<p align="center" style="font-size:1.4em; font-weight:bold;">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#citation">Citation</a> •
  <a href="#license">License</a>
</p>
<br><br>

<!-- development-related badges -->
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/CATALPAresearch/mod_longpage/commit-activity)
[![github latest commit](https://badgen.net/github/last-commit/CATALPAresearch/mod_longpage)](https://github.com/CATALPAresearch/mod_longpage/commit/)
[![github contributors](https://badgen.net/github/contributors/CATALPAresearch/mod_longpage)](https://github.com/CATALPAresearch/mod_longpage/contributors/)
[![github issues](https://img.shields.io/github/issues/CATALPAresearch/mod_longpage.svg)](https://github.com/CATALPAresearch/mod_longpage/issues/)
[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-green.svg)](http://perso.crans.org/besson/LICENSE.html)

![https://img.shields.io/badge/any_text-you_like-blue](https://img.shields.io/badge/Tested_Moodle_versions-3.5_to_3.11-green)
![](https://img.shields.io/badge/PHP-7.4_to_8.0.29-green)
![](https://img.shields.io/badge/NPM-~10.2.3-green)
![](https://img.shields.io/badge/node.js-~18.17.0-green)
![](https://img.shields.io/badge/vue.js-2-green)

<!-- Maturity-related badges 
see: https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md
-->
[![stability-mature](https://img.shields.io/badge/stability-mature-008000.svg)](https://github.com/mkenney/software-guides/blob/master/STABILITY-BADGES.md#experimental)
![](https://img.shields.io/badge/years_in_productive_use-1-darkgreen)
![](https://img.shields.io/badge/used_in_unique_courses-1-darkgreen)



<!-- AI-related and LA-related badges -->
<!-- 
https://nutrition-facts.ai/

Privacy Ladder Level
Feature is Optional
Model type
Base model
Base Model Trained with Customer Data
Customer Data is Shared with Model Vendor
Training Data Anonymized
Data Deletion
Human in the Loop
Data Retention
Compliance
-->
![](https://img.shields.io/badge/collects_clickstream_data-no-blue)
![](https://img.shields.io/badge/collects_scroll_data-no-blue)
![](https://img.shields.io/badge/collects_mouse_data-no-blue)
![](https://img.shields.io/badge/collects_audio_data-no-blue)
![](https://img.shields.io/badge/collects_video_data-no-blue)
![](https://img.shields.io/badge/data_shared_with_vendor-no-blue)

![](https://img.shields.io/badge/AI_methods-recommender_system-blue)
![](https://img.shields.io/badge/Base_model-none-blue)
![](https://img.shields.io/badge/Feature_is_optional-yes-blue)
![](https://img.shields.io/badge/Human_in_the_loop-yes-blue)


<br><br>
<p align="center" hidden>
  ![Screenshot of the GUI to read and annotate](./screenshot.png)
</p>





# Key Features

**Adaptation Rule Board**
* Create, edit, update, delete adaptation rules
* A rule consists of conditions using learner model keys, operators, and user-defined threshold values. If the rule conditions are fulfulled the actions are triggered. An action includes instructions and inputs for the individual selected actors.
* statistics how often a rule was triggered
* activate/deactive rule for every course

**Sensors**
* current Moodle page
* idle time
* Get data of the screen, the browser, the current used tab, the OS, the geolocation of mobile devices, the acceleration of mobile devices


**Actors**
* Send notifications or messages using the Moodle API
* Display popup, confirm or prompt messages over native JS
* Notify user with vibration
* Change CSS style of any DOM object
* Inject DOM elements

**Learner Model**
* Comprehensive set of over 200 features of individual users per course
* Including data of mod_page, mod_assign, mod_quiz, mod_longpage, mod_usenet, mod_safran
* Extensible for other activity plugins

**Data Interfaces**
* Within Moodle other plugins can consume rule actions through items stored in the indexedDB on client-side
* University API (Python):
  * load content model
  * grasp course enrollments and grades from university database


<!--
* Management of cookies
* Navigation through the history
* Create service worker e.g. to receive push messages or create offline pages/reader
* Create webworker to increase the performance
* Communicate with moodle over a standard communication class
-->


## Roadmap and Limitations
**Roadmap**
* Replace grunt by Webpack
* Extend the controller to let the backend access the different classes over the communication

**Limitations**
- xxx

## How To Use
For installation you should use your terminal.
```bash
# 1. Clone the repository into the 'local' folder of your Moodle instance: 
git clone https://gitlab.pi6.fernuni-hagen.de/aple/entwicklung/local-ari

# 2. Rename the plugin folder
mv local-ari ari

# 3. Enter the folder and install the dependencies:
cd vue
npm install

# 4. Build the coe
npm run build

# 5. Install the plugin using the terminal 
# Alternatively, open the Moodle administration area in your web browser and follow the instructions
php admin/cli/uninstall_plugins.php --plugins=local_ari --run
php admin/cli/upgrade.php

# 6. To view the local plugin, call its directory in your web browser  (for example: http://localhost/moodle/local/ari/)
```

**Trouble shooting**
* run `export NODE_OPTIONS=--openssl-legacy-provider` in a terminal in the vue folder if the error "ERR_OSSL_EVP_UNSUPPORTED" appears
* purge all caches in Moodle

**Plugin Settings**
xxx

## Download

You can [download](https://github.com/catalparesearch/mod_longpage/releases/tag/latest) the latest installable version of *Longpage* for Moodle 3.11.


## Getting into Development
```bash
# Use hot reloading during teh developmen of vue components
cd vue
npm run watch

# update the tag
git tag -d ws2223 && git push --delete origin ws2223 && git tag ws2223 && git push origin ws2223

# Upload the code to your test or production system
$ rsync -r ./* aple-test:/var/moodle/htdocs/moodle/local/ari/ --exclude={'.env','node_modules','*.git','.DS_Store','.gitignore','.vscode'}
```



## Emailware

*Longpage* is an [emailware](https://en.wiktionary.org/wiki/emailware). Meaning, if you liked using this plugin or it has helped you in any way, I'd like you send me an email at <niels.seidel@fernuni-hagen.de> about anything you'd want to say about this software. I'd really appreciate it!

## Credits

This software uses the following open source packages:
[vue.js](https://vuejs.org/), 
[vuex](https://vuex.vuejs.org/), 
[node.js](https://nodejs.org/).

## Related

* xxx

## Citation

**Cite this software:**

tba. xxx

**Research articles and datasets about Longpage:**

xxx

## You may also like ...

* [format_serial3](https//github.com/catalparesearch/format_serial3) - Learning Analytics Dashboard for Moodle Courses
* [mod_usenet](https//github.com/catalparesearch/mod_usenet) - Usenet client for Moodle
* [mod_longpage](https//github.com/catalparesearch/mod_longpage) - Support reading of long texts
* [mod_hypercast](https://github.com/nise/mod_hypercast) - Hyperaudio player for course texts supporting audio cues, text2speech conversion, text comments, and collaborative listining experiences 

## License

[GNU GPL v3 or later](http://www.gnu.org/copyleft/gpl.html)


## Contributors
* Niels Seidel [@nise81](https://twitter.com/nise81)
* Marc Burchart

---
<a href="https://www.fernuni-hagen.de/english/research/clusters/catalpa/"><img src="pix/promotion/catalpa.jpg" width="300" /></a>
<a href="https://www.fernuni-hagen.de/"><img src="pix/promotion/fernuni.jpg" width="250" /></a>





