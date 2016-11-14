'use strict';

class IndexController{

    constructor(app){
        this.app = app;
      console.log('HEYY');
    }

    setupRoutes(){
        this.app.get('/', this.home.bind(this));
    }


    home(req, res){
        res.render('index');
    }
}

module.exports = IndexController;
