# High Level Software Design
## Solution

The app should work on Windows, Linux and Mac. It should also be available as a web app on a website. To meet these requirements we wrote the app as a web app using React, a component based UI design approach by Facebook, and used Electron, a framework for creating native applications with web technologies like JavaScript, HTML, and CSS, to make it work on Windows, Mac an Linux.

## System
### Bleeding Edge JavaScript features

The app had to be written using newest ES6 features such as Promises and arrow-functions, hence we used Babel, a compiler that transforms ES6 code (and other things like React's JSX syntax) into ES5 code.

### Ability to execute Custom Code

For Custom Code section the app needs to be able to evaluate custom codes written by the user. Since exposing the running environment of the app would be dangerous, we use JS-Interpreter, a sandboxed JavaScript interpreter in JavaScript, isolating it from the main context.

### Bundling

The app composes multiple modules, both third-party and in-house modules. We used Webpack module bundler,  to bundle these modules into the app. Using webpack we could also minify the code, which we did, in order to reduce the loading time for the version on the browser.

### Testing

Testing is done with the popular Mocha framework and Chai. To make mocha work with webpack we are using a plugin, mocha-webpack, and jsdom, a framework for emulating browser in node.js.

#### Linting and Duplicate Code

To find syntax and coding errors, enforce complying to javascript standards, and enforce consistent styling; eslint, a pluggable javascript linter. CSS and SCSS is linted using sass-lint. Duplicate code in the app is found using jsinspect.
