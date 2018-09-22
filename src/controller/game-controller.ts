import {Router, Request, Response} from "express";
import {loggedInCheck} from "../middleware/logged-in-check";
import {CookieJar} from "../middleware/cookie-jar";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repository/user-repository";
import {GameRepository} from "../repository/game-repository";
import {Board} from "../game/board";
import {Guid} from "guid-typescript";

const router: Router = Router();
const create = getCustomRepository;

router.use(loggedInCheck);

// TODO post
router.get("/id/:gameId/propose-draw", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined || game.isGameOver || game.drawProposalCode !== "") {
        res.statusMessage = "NOPE, TODO";
        res.status(400).end();
        return;
    }

    const cookieJar = CookieJar.from(req);

    if (cookieJar.email !== game.redPlayer!.email && cookieJar.email !== game.blackPlayer!.email) {
        res.statusMessage = `only ${game.redPlayer!.name} and ${game.blackPlayer!.name} can propose a draw`;
        res.status(403).end();
        return;
    }

    const code = Guid.create().toString();
    game.drawProposalCode = code;
    await gameRepo.save(game);

    const link = `${req.protocol}://${req.get("host")}/game/id/${game.id}/accept-draw?code=${code}`;

    res.send(link);
});

router.get("/id/:gameId/accept-draw", async (req: Request, res: Response) => {
    res.send(`TODO: handle ${req.query.code}`);
});

router.post("/id/:gameId/move/:move", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined || game.isGameOver) {
        res.statusMessage = game === undefined ? "game does not exist" : "game is over";
        res.status(400).end();
        return;
    }

    const cookieJar = CookieJar.from(req);

    if (cookieJar.email !== game.turnPlayer!.email) {
        res.statusMessage = `nope, it"s ${game.turnPlayer!.name}"s turn`;
        res.status(403).end();
        return;
    }

    try {
        const board = new Board();
        const moves = JSON.parse(game!.movesJson) as string[];
        moves.push(req.params.move);
        board.makeMoves(moves);

        // If `makeMoves(...)` didn"t throw an exception, it was a valid move
        game.setMoves(moves);

        if (board.isCheckmate(board.getTurn())) {
            game.end(board.getTurn());
            res.statusMessage = `checkmate, winner: ${game.winner!.name}`;
        }

        gameRepo.save(game!);

        res.status(200).end();
    } catch (e) {
        res.statusMessage = e;
        res.status(400).end();
    }
});

router.get("/id/:gameId", async (req: Request, res: Response) => {
    const userRepo = create(UserRepository);
    const gameRepo = create(GameRepository);
    const user = await userRepo.findByUsername(CookieJar.from(req).email);
    const game = await gameRepo.getById(parseInt(req.params.gameId));
    res.render("game/id", { game: game, user: user });
});

router.get("/list", async (req: Request, res: Response) => {
    const gameRepo = create(GameRepository);
    const games = await gameRepo.getAll();
    res.render("game/list", { games: games });
});

router.get("/new", async (req: Request, res: Response) => {
    const repo = create(UserRepository);
    const cookieJar = CookieJar.from(req);
    const opponents = await repo.getAllBut(cookieJar.email);
    res.render("game/new", { opponents: opponents });
});

router.post("/new", async (req: Request, res: Response) => {
    const userRepo = create(UserRepository);
    const gameRepo = create(GameRepository);
    const cookieJar = CookieJar.from(req);
    const opponentEmail = req.body.opponent;
    const initiator = await userRepo.findByUsername(cookieJar.email);
    const opponent = await userRepo.findByUsername(opponentEmail);
    const game = await gameRepo.createAndSave(initiator!, opponent!, req.body.color === "red");
    res.send(game);
});

export const GameController: Router = router;
