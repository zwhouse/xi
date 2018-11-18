import {Router, Request, Response} from "express";
import {apiSecretCheck} from "../middleware/api-secret-check";
import {getCustomRepository} from "typeorm";
import {SqlRepository} from "../repository/sql-repository";
import {GameRepository} from "../repository/game-repository";
import {MailService} from "../service/mail-service";
import {warnUser} from "../template/mail";

const router: Router = Router();
const create = getCustomRepository;
const mailService = new MailService();

router.use(apiSecretCheck);

router.post("/sql", async (req: Request, res: Response) => {
    const repo = create(SqlRepository);
    const result = await repo.execute(req.body["query"]);
    res.send(result);
});

router.get("/update-countdown-minutes", async (req: Request, res: Response) => {
    const gameRepo = create(GameRepository);
    const result: { [id: string] : string; } = {};
    const now = new Date().getTime();
    const games = await gameRepo.getAll();

    for (const game of games) {

        if (!game.isGameOver) {
            const remainingMinutes = game.updateCountdownMinutes(now);

            if (remainingMinutes === 59) {
                const user = game.turnPlayer!;
                await mailService.send(user.email!, "Xi - Your time is almost up!", warnUser(req, user, game));
            }

            result[`game:${game.id}`] = `remaining minutes: ${remainingMinutes}`;

            await gameRepo.save(game);
        }
    }

    res.send(result);
});

export const ApiController: Router = router;
