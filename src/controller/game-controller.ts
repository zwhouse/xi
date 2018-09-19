import {Router, Request, Response} from 'express';
import {loggedInCheck} from "../middleware/logged-in-check";
import {CookieJar} from "../middleware/cookie-jar";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repository/user-repository";
import {GameRepository} from "../repository/game-repository";
import {Board} from "../game/board";
import {Move} from "../game/move";

const router: Router = Router();
const create = getCustomRepository;

router.use(loggedInCheck);

router.post('/id/:gameId/move/:move', async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined) {
        res.status(400).end();
        return;
    }

    const cookieJar = CookieJar.from(req);

    if (cookieJar.email !== game!.blackPlayer!.email && cookieJar.email !== game!.redPlayer!.email) {
        console.log("player does not participate");
        res.status(403).end();
        return;
    }

    if (!((game.isRedTurn && cookieJar.email === game!.redPlayer!.email) || (!game.isRedTurn && cookieJar.email === game!.blackPlayer!.email))) {
        console.log("not the player's turn");
        res.status(403).end();
        return;
    }

    try {
        const board = new Board();
        const moves = JSON.parse(game!.movesJson) as string[];
        moves.push(req.params.move);

        for (let move of moves) {
            board.makeMove(Move.create(move, board));
        }

        // TODO explain
        game.setMoves(moves);
        gameRepo.save(game!);

        res.status(200).end();
    } catch (e) {
        res.statusMessage = e;
        res.status(400).end();
    }
});

router.get('/id/:gameId', async (req: Request, res: Response) => {
    const gameRepo = create(GameRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));
    res.render('game/id', { game: game });
});

router.get('/list', async (req: Request, res: Response) => {
    const gameRepo = create(GameRepository);
    const games = await gameRepo.getAll();
    res.render('game/list', { games: games });
});

router.get('/new', async (req: Request, res: Response) => {
    const repo = create(UserRepository);
    const cookieJar = CookieJar.from(req);
    const opponents = await repo.getAllBut(cookieJar.email);
    res.render('game/new', { opponents: opponents });
});

router.post('/new', async (req: Request, res: Response) => {
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
