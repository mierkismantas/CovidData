# Author: Mantas Mierkis 2021-02-10
# Project: Covid19 tests
# Summary: Frontend application that lists Covid 19 Tests information

#How to start
Navigate with CMD to root project folder (where this readme is located)
In CMD use docker command or npm commands:

### docker-compose up -d --build
Runs the app using docker containers
Open (http://localhost:3000) to view it in the browser.

### npm install

Installs node_modules

### npm start

Runs the app in the development mode.
Open (http://localhost:3000) to view it in the browser.

### npm test

Runs tests


### -------------------------------------------------------------------------------------

### Functionality:
Authentication: username/password
Page with data table, filtering, search, ordering, download, print, pagination (using tubular)
Page with chart and filters (SignalR realtime data update; data will be updated after new data insertion ['/input'])
Page to add new data (can be accessed only when signed in [credentials: 'admin', 'admin'])
Header to control authentication and page navigation

Requirements are met and the project is complete, but because there was a limited time interval, there are multiple 'todo' in the code.
If there is a need to improve this project, these 'todo' can help to point out improvement areas.

### Technical info:
React
State management solution (react-redux)
TypeScript
Material UI (dark)
Indicates loading state when requests are in action
Uses responsive components (Looks good on desktop and mobile)
Has tests which check if App component can be rendered

# Tips:

### Clean node packages

npm install rimraf -g
rimraf node_modules