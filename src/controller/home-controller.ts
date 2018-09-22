import {Router, Request, Response} from "express";
import {loggedInCheck} from "../middleware/logged-in-check";
const router: Router = Router();

router.use(loggedInCheck);

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

export const HomeController: Router = router;
