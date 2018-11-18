import {EntityRepository, Repository, EntityManager, createConnection, Not, Equal} from "typeorm";
import {User} from "../db/user";
import {Game} from "../db/game";

@EntityRepository()
export class GameRepository {

    constructor(private manager: EntityManager) {
    }

    getById(id: number): Promise<Game | undefined> {
        return this.manager.findOne(Game, id);
    }

    getAll(desc: boolean = true, includePlayers: boolean = true): Promise<Game[]> {

        let queryBuilder = this.manager
            .getRepository(Game)
            .createQueryBuilder("game");

        if (includePlayers) {
            queryBuilder = queryBuilder
                .leftJoinAndSelect("game.redPlayer", "red")
                .leftJoinAndSelect("game.blackPlayer", "black")
                .leftJoinAndSelect("game.turnPlayer", "turn");
        }

        return queryBuilder
            .orderBy("game.created", desc ? "DESC" : "ASC")
            .getMany();
    }

    createAndSave(initiator: User, opponent: User, ownColorIsRed: boolean, daysThinkingTime: number = 4): Promise<Game> {
        const game = new Game(initiator, opponent, ownColorIsRed, daysThinkingTime * 24 * 60);
        return this.manager.save<Game>(game);
    }

    save(game: Game): Promise<Game> {
        return this.manager.save(game);
    }
}
