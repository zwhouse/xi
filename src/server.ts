import * as dotenv from 'dotenv';
import * as express from 'express';
import * as handlebars from 'express-handlebars';
import * as validator from 'express-validator';
import * as cookieParser from 'cookie-parser';
import "reflect-metadata";
import {UserController} from "./controller/user-controller";
import {GameController} from "./controller/game-controller";
import bodyParser = require("body-parser");
import {createConnection} from "typeorm";
import {User} from "./db/user";
import {Game} from "./db/game";

const app: express.Application = express();
const hbs: Exphbs = handlebars.create({ /* config */ });

dotenv.config();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

export const secret = process.env.ENCRYPTION_SECRET as string;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(express.static('public'));

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "xi",
    entities: [User, Game],
    synchronize: true,
    logging: false
}).then(() => {
    console.log("Database connection established");

    const port: number = parseInt(process.env.PORT as string);

    app.use('/user', UserController);
    app.use('/game', GameController);

    app.listen(port, () => {
        console.log(`Listening at http://localhost:${port}/`);
    });
}).catch(error => console.log(error));
