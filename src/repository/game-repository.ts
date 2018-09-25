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

    getAll(desc: boolean = true): Promise<Game[]> {
        return this.manager
            .getRepository(Game)
            .createQueryBuilder("game")
            .leftJoinAndSelect("game.redPlayer", "red")
            .leftJoinAndSelect("game.blackPlayer", "black")
            .orderBy("game.created", desc ? "DESC" : "ASC")
            .getMany();
    }

    createAndSave(initiator: User, opponent: User, ownColorIsRed: boolean): Promise<Game> {
        const game = new Game(initiator, opponent, ownColorIsRed);
        return this.manager.save<Game>(game);
    }

    save(game: Game): Promise<Game> {
        return this.manager.save(game);
    }
}
