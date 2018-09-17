import {Router, Request, Response} from 'express';
import {loggedInCheck} from "../middleware/logged-in-check";
import {CookieJar} from "../middleware/cookie-jar";

const router: Router = Router();

router.use(loggedInCheck);

router.get('/list', (req: Request, res: Response) => {
    const cookieJar = CookieJar.from(req);
    console.log('~>', cookieJar);
    res.render('game/list');
});

export const GameController: Router = router;
