import {Router, Request, Response} from "express";
import {loggedInCheck} from "../middleware/logged-in-check";
import {CookieJar} from "../middleware/cookie-jar";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repository/user-repository";
import {GameRepository} from "../repository/game-repository";
import {Board} from "../game/board";
import {Guid} from "guid-typescript";
import {MailService} from "../service/mail-service";
import {response} from "../util/response-utils";
import {drawProposal, forfeitNotification, moveNotification} from "../template/mail";

const mailService = new MailService();
const router: Router = Router();
const create = getCustomRepository;

router.use(loggedInCheck);

router.post("/id/:gameId/forfeit", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const userRepo = create(UserRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined)
        return response(res, 404, `no such game: ${req.params.gameId}`);

    if (game.isGameOver)
        return response(res, 400, `game ${req.params.gameId} is over`);

    if (!game.isAccepted)
        return response(res, 400, `game ${req.params.gameId} hasn't started yet`);

    const user = await userRepo.findByUsername(CookieJar.from(req).email);

    if (user!.email !== game.redPlayer!.email && user!.email !== game.blackPlayer!.email)
        return response(res, 403, `only ${game.redPlayer!.name} and ${game.blackPlayer!.name} can forfeit`);

    game.forfeit(user!);
    await gameRepo.save(game);
    await userRepo.save(game.redPlayer!);
    await userRepo.save(game.blackPlayer!);

    const opponent = game.getOpponentOf(user!);
    mailService.send(opponent.email!, `${user!.name} forfeited game ${game.id}`, forfeitNotification(req, game));

    res.status(200).end();
});


router.post("/id/:gameId/propose-draw", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const userRepo = create(UserRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined || game.isGameOver || !game.isAccepted || game.drawProposalCode !== "") {
        res.statusMessage = "NOPE, TODO 2";
        res.status(400).end();
        return;
    }

    const user = await userRepo.findByUsername(CookieJar.from(req).email);

    if (user!.email !== game.redPlayer!.email && user!.email !== game.blackPlayer!.email)
        return response(res, 403, `only ${game.redPlayer!.name} and ${game.blackPlayer!.name} can propose a draw`);

    game.drawProposalCode = Guid.create().toString();

    const opponent = game.getOpponentOf(user!);

    await mailService.send(opponent.email!, `${user!.name} proposes a draw for game ${game.id}`, drawProposal(req, game));
    await gameRepo.save(game);

    res.status(200).end();
});

router.get("/id/:gameId/accept-draw", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const userRepo = create(UserRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));
    const code = req.query.code;

    if (code === null || game === undefined || game.isGameOver || game.drawProposalCode !== code) {
        res.statusMessage = "NOPE, TODO 1";
        res.status(400).end();
        return;
    }

    if (!code)
        return response(res, 400, `invalid code: ${code}`);

    if (game === undefined)
        return response(res, 404, `no such game: ${req.params.gameId}`);

    if (game.isGameOver)
        return response(res, 400, `game ${req.params.gameId} is over`);

    if (!game.isAccepted)
        return response(res, 400, `game ${req.params.gameId} hasn't started yet`);

    game.draw();
    await gameRepo.save(game);
    await userRepo.save(game.redPlayer!);
    await userRepo.save(game.blackPlayer!);

    res.redirect(`/game/id/${game.id}`);
});

router.post("/id/:gameId/move/:move", async (req: Request, res: Response) => {

    const gameRepo = create(GameRepository);
    const userRepo = create(UserRepository);
    const game = await gameRepo.getById(parseInt(req.params.gameId));

    if (game === undefined)
        return response(res, 404, `no such game: ${req.params.gameId}`);

    if (game.isGameOver)
        return response(res, 400, `game ${req.params.gameId} is over`);

    const cookieJar = CookieJar.from(req);

    if (cookieJar.email !== game.turnPlayer!.email)
        return response(res, 403, `nope, you're not ${game.turnPlayer!.name}`);

    try {
        const board = new Board();
        const moves = JSON.parse(game!.movesJson) as string[];
        moves.push(req.params.move);
        board.makeMoves(moves);

        // If `makeMoves(...)` didn't throw an exception, it was a valid move
        game.move(req.params.move);

        if (board.isCheckmate(board.getTurn())) {
            game.end(board.getTurn());
            res.statusMessage = `checkmate, winner: ${game.winner!.name}`;
        }

        gameRepo.save(game!);
        await userRepo.save(game.redPlayer!);
        await userRepo.save(game.blackPlayer!);

        if (process.env.SEND_MAIL_AFTER_MOVE === "true") {
            const subject = `${game.getOpponentOf(game.turnPlayer!).name} made a move in game ${game.id}`;
            mailService.send(game.turnPlayer!.email!, subject, moveNotification(req, game));
        }

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
    res.render("game/id", { game: game, user: user, reversed: game!.blackPlayer!.id === user!.id });
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
