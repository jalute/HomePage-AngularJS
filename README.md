# JaluteWeb

This project is the source code for jalute.com.  The project contains the Video Poker Trainer ported from C# to angularJS.

## Getting Started

To get you started you can simply clone the JaluteWeb repository and install the dependencies:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
angular changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.* (if not minifying).

## Directory Layout

```
app/                    --> all of the source files for the application
  app.css               --> default stylesheet
  components/           --> all app specific modules
    version/              --> version related components
      version.js                 --> version module declaration and basic "version" value service
      version_test.js            --> "version" value service tests
      version-directive.js       --> custom directive that returns the current app version
      version-directive_test.js  --> version directive tests
      interpolate-filter.js      --> custom interpolation filter
      interpolate-filter_test.js --> interpolate filter tests
  css/                  --> subpage css files
  data/                 --> contains fixed data json files video poker trainer
  home/                 --> main page
  img/                  --> all images for website
  intro/                --> video poker introduction
  projects/             --> list of projects
  resume/               --> my current resume/cv
  screenshots/          --> screenshot of video poker game
  vpt/                  --> video poker trainer section
    tabs/               --> video poker tactics section
  app.js                --> main application module
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```

### Running the App during Development

I have configured the gulp file to run locally using NodeJS.  This will not uglify the code
before running.  Sections of the index.html file need to uncomment out the development javascript includes,
and comment out the production javascript includes.  After you have made the alteration run the script:

```
gulp dev
```

Now browse to the app at `http://localhost:8080/`.


### Running the App in Production
Before running the 'gulp install' command, make sure production code is uncommented in the index.html file.

'''
gulp install
'''

A deployment folder is created at the root folder called '_build'.  Deploy this directory to host website.
