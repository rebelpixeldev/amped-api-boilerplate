## Amped API Boilerplate

Amped API Boilerplate is a project that has everything setup to get your api for a project up and running. This functions as the starting point for you to build your api on top of so this should be cloned and the remote url should be changed to your repo.

The idea behind the Amped project is to get you up and started with the basics you need with for any project and allowing you to focus on the business logic of your app.

### Setup

If you are on mac or linux you can just run `./install.sh`

If you are on windows you can run
```
npm install
```

Running `npm start` will startup the project and listen for changes to restart the server. Once started you cn find the api on [`http://localhost:4000`](http://localhost:4000) by default

*Note* Currently the `app.js` is very tied to the `amped-api` project. There are many middleware setup and function calls in there that are in a specific order. There are plans to simplify this but for now if you want to use the amped api, keep them in that order and position in the file. (They are marked with a comment)

### The database

Currently there aren't any migrations setup to create the database for you so you'll need to do this manually. All of the queries can be found in [`amped-api/db`](https://github.com/rebelpixeldev/amped-api) project

### How the project works
* app - All of your projects specific endpoints and logic
    * config - all of the environment specific config varibles should be put into `env` with a filename that matches your environment variable
    * controllers - These are the controllers for the site that handle specific endpoints for the business logic. They are automatically initialized and `setupRoutes` is called to add your endpoints to the api.
    * models - These models have become a little more than what a model should be. All files in here should extend `react-api/AmpedModel` and customized from there (No testing has been done if they do not extend AmpedModel) A model has its crud endpoints setup by default, the sequelize schema and options as well as many more options. (The file is fully documented [here](https://github.com/rebelpixeldev/amped-api/blob/master/models/AmpedModel.js))
    * views - Not used unless localhost:4000 is hit
* pm2 - The pm2 configuration for when you put the project on a server
* uploads - A location for file uploads to be put.


### Related Projects
* [Amped api](https://github.com/rebelpixeldev/amped-api)
* [Amped react boilerplate](https://github.com/rebelpixeldev/amped-react-boilerplate)
* [Amped react core](https://github.com/rebelpixeldev/amped-react-core)
