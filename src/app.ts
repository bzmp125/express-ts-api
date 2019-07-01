import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from 'passport';
//route handlers
import { adminRoutesHandler } from './routes'
import { response } from "./helpers";

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(passport.initialize());
        // setup cors
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            // res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });
        // routes
        this.setupRoutes();

        // 404
        this.app.use((
            _req: express.Request,
            _res: express.Response,
            next: express.NextFunction
          ) => {
            _res.status(404).json(response(false, "ROUTE NOT FOUND."));
        })
    }
    private setupRoutes() {
        this.app.use('/admin', adminRoutesHandler);
    }
}

export default new App().app;