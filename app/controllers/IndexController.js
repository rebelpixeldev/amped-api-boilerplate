const config = require('../config/config');

class IndexController{

    constructor(app){
        this.app = app;
    }

    setupRoutes(){
        this.app.get('/', this.home.bind(this));
        this.app.get('/config', this.config.bind(this));
    }


    home(req, res){
        res.render('index');
    }
    config(req, res){
        res.feedback({
	        site : config.site,
	        urls: config.urls
        })
    }
}

module.exports = IndexController;
