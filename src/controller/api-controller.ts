import {Router, Request, Response} from "express";
import {apiSecretCheck} from "../middleware/api-secret-check";
import {getCustomRepository} from "typeorm";
import {SqlRepository} from "../repository/sql-repository";

const router: Router = Router();
const create = getCustomRepository;

router.use(apiSecretCheck);

router.post("/sql", async (req: Request, res: Response) => {
    const repo = create(SqlRepository);
    const result = await repo.execute(req.body["query"]);
    res.send(result);
});

export const ApiController: Router = router;
