import {Router, Request, Response} from "express";
const router: Router = Router();

const pieces = ["s", "c", "r", "h", "e", "a", "g"];
const colors = ["r", "b"];

function random(values: string[]): string {
    return values[Math.floor(Math.random() * values.length)];
}

router.get("/", (req: Request, res: Response) => {

    const logo = `${random(pieces)}${random(colors)}`;

    res.render("home", { loggedIn: req.cookies["xi"] !== undefined, logo: logo });
});

export const HomeController: Router = router;
