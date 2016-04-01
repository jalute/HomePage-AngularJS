# HomePage-AngularJS

This project is the source code for jalute.com.  The project contains the Video Poker Trainer ported from C# to HTML5/CSS/Javascript and AngularJS.

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

```
gulp install
```

A deployment folder is created at the root folder called '_build'.  Deploy this directory to host website.

### Disclaimer

By accessing the Video Poker Training, you are agreeing to the following terms.  If you do not agree to these terms, do not use this application.

The developer accepts no responsibility or liability for any losses which may be incurred by any person or persons using the whole or part of the contents of the information, systems, plans, methods and games contained herein and made available in this application. Use the information provided on the Video Poker Training application at your own risk.

No gambling occurs in the Video Poker Training application. Video Poker Training application are provided on an 'as is basis' and may be played for free for fun purposes. 

The developer does not promote or encourage illegal or underage gambling, or gambling to persons who reside in jurisdictions where gambling is considered unlawful. In those instances, this application is presented for informational and entertainment purposes only. By opening Video Poker Training, you agree that you are aware of the terms outlined herein and reside in an area where it is not unlawful to gamble online.
