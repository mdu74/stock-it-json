# Stock It App
## _This app manages stock data from json files_

The app uses an API to convert the json files to managable data and a typescript front end to display and create a new file.

## Features

- Displays all the available stock data in a table
- Select multiple stock items from the stock table 
- Search filter for any stock item that exists in the stock table
- Table pagination in the stock table 
- Add the selected stock items to the second table below
- Clear the data on the second table
- Export data from the second table to a Json document which gets created in the JsonData folder

## Tech

Dillinger uses a number of open source projects to work properly:

- [Angular] -  A TypeScript-based free and open-source web application framework
- [Asp.Net Core] - A framework for building HTTP services that can be accessed from any client including browsers and mobile devices

## Installation

Stock It requires [Node.js](https://nodejs.org/) v10+ to run, and the [Angular cli](https://angular.io/cli) so you can run the angular commands.

Install the angular dependencies and devDependencies and start the client server.

```sh
cd StockItClient
npm i
ng serve -o
```

## To run the Stock It API

Navigate to the StockItAPI folder, in the root of this folder you'll see the StockItAPI.sln. Double click it to open your Visual Studio IDE. 

At the top of Visual Studio find the Debug button, when you select it, a drop down appears with the Start Debugging option in it. 

When you click on the Start Debugging button, it will launch the apps Swagger API on your browser.