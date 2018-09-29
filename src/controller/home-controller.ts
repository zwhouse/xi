import {Router, Request, Response} from "express";
const router: Router = Router();

const pieces = ["s", "c", "r", "h", "e", "a", "g"];
const colors = ["r", "b"];
const explanations: { [piece: string] : string } = {
    "s": "Soldiers begin the game located on every other point one row back from the edge of the river. They move and capture by advancing one point. Once they have crossed the river, they may also move and capture one point horizontally. ",
    "c": "Cannons move like chariots, any distance orthogonally without jumping, but can only capture by jumping a single piece, friend or foe, along the path of attack.",
    "r": "The chariot is sometimes known as the rook by English-speaking players, since it is like the rook in Western chess. Chinese players (and others) often call this piece a car, since that is one modern meaning of the character 車.",
    "h": "A horse moves and captures one point orthogonally and then one point diagonally away from its former position, a move which is traditionally described as being like the character 日 Rì. The horse does not jump as the knight does in Western chess, and can be blocked by a piece located one point horizontally or vertically adjacent to it.",
    "e": "Elephants may not cross the river, and serve as defensive pieces. Because an elephant's movement is restricted to just seven board positions, it can be easily trapped or threatened. The two elephants are often used to defend each other.",
    "a": "The advisors start on either side of the general. They move and capture one point diagonally and may not leave the palace, which confines them to five points on the board. The advisor is probably derived from the mantri in chaturanga, like the queen in Western chess.",
    "g": "The general starts the game at the midpoint of the back edge, within the palace. The general may move and capture one point orthogonally and may not leave the palace."
};

function random(values: string[]): string {
    return values[Math.floor(Math.random() * values.length)];
}

router.get("/", (req: Request, res: Response) => {

    const piece = random(pieces);
    const logo = `${piece}${random(colors)}`;
    const explanation = explanations[piece];

    res.render("home", { loggedIn: req.cookies["xi"] !== undefined, logo: logo, explanation: explanation });
});

export const HomeController: Router = router;
